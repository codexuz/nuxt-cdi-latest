<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle>Select {{ mediaTypeLabel }}</DialogTitle>
        <DialogDescription>
          Choose from your media library or upload new files
        </DialogDescription>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto space-y-4">
        <!-- Search and Filter -->
        <div class="flex gap-3">
          <div class="flex-1 relative">
            <Icon
              name="lucide:search"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search media..."
              class="pl-10"
            />
          </div>
          <Button @click="showUploadModal = true" variant="outline">
            <Icon name="lucide:upload" class="mr-2 w-4 h-4" />
            Upload New
          </Button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <Icon
            name="lucide:loader-2"
            class="w-8 h-8 animate-spin text-blue-600"
          />
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredMedia.length === 0" class="text-center py-12">
          <div
            class="mx-auto w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4"
          >
            <Icon
              :name="getEmptyIcon()"
              class="w-10 h-10 text-gray-400 dark:text-gray-600"
            />
          </div>
          <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">
            No {{ mediaTypeLabel.toLowerCase() }} found
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload your first {{ mediaTypeLabel.toLowerCase() }} to get started
          </p>
          <Button
            @click="showUploadModal = true"
            class="mt-4 bg-gradient-to-r from-[#2563EB] to-[#1A73E8]"
          >
            <Icon name="lucide:upload" class="mr-2 w-4 h-4" />
            Upload {{ mediaTypeLabel }}
          </Button>
        </div>

        <!-- Media Grid -->
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <div
            v-for="media in filteredMedia"
            :key="media.id"
            @click="selectMedia(media)"
            :class="[
              'group relative bg-white dark:bg-gray-800 rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-200',
              selectedMediaId === media.id
                ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
            ]"
          >
            <!-- Media Preview -->
            <div
              class="aspect-square bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="media.mime_type?.startsWith('image/')"
                :src="media.url"
                :alt="media.alt_text || 'Media'"
                class="w-full h-full object-cover"
              />
              <video
                v-else-if="media.mime_type?.startsWith('video/')"
                :src="media.url"
                class="w-full h-full object-cover"
              />
              <div
                v-else-if="media.mime_type?.startsWith('audio/')"
                class="flex flex-col items-center justify-center p-4"
              >
                <Icon
                  name="lucide:music"
                  class="w-12 h-12 text-blue-600 dark:text-blue-400 mb-2"
                />
                <p class="text-xs text-center text-gray-600 dark:text-gray-400">
                  {{ formatDuration(media) }}
                </p>
              </div>
              <Icon
                v-else
                :name="getMediaIcon(media.mime_type)"
                class="w-12 h-12 text-gray-400 dark:text-gray-600"
              />
            </div>

            <!-- Selected Checkmark -->
            <div
              v-if="selectedMediaId === media.id"
              class="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center"
            >
              <Icon name="lucide:check" class="w-4 h-4 text-white" />
            </div>

            <!-- Media Info -->
            <div class="p-2">
              <p
                class="text-xs font-medium text-gray-900 dark:text-gray-100 truncate"
                :title="media.alt_text || media.original_filename || 'Untitled'"
              >
                {{ media.alt_text || media.original_filename || "Untitled" }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatFileSize(parseInt(media.file_size)) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" @click="closeModal">
          Cancel
        </Button>
        <Button
          type="button"
          @click="confirmSelection"
          :disabled="!selectedMediaId"
          class="bg-gradient-to-r from-[#2563EB] to-[#1A73E8] hover:from-[#1d4ed8] hover:to-[#1557b0]"
        >
          <Icon name="lucide:check" class="mr-2 w-4 h-4" />
          Select {{ mediaTypeLabel }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Upload Modal -->
  <MediaUploadModal
    v-model:open="showUploadModal"
    :center-id="authStore.user?.center_id"
    @uploaded="handleUploaded"
  />
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";
import type { MediaItem } from "~/composables/useMedia";
import { useAuthStore } from "~/stores/auth";

const props = defineProps<{
  open: boolean;
  mediaType?: "audio" | "video" | "image" | "document";
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  selected: [media: MediaItem];
}>();

const authStore = useAuthStore();
const { getAllMedia, formatFileSize, getFileTypeCategory } = useMedia();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const mediaList = ref<MediaItem[]>([]);
const isLoading = ref(false);
const searchQuery = ref("");
const selectedMediaId = ref<string | null>(null);
const showUploadModal = ref(false);

const mediaTypeLabel = computed(() => {
  const labels = {
    audio: "Audio",
    video: "Video",
    image: "Image",
    document: "Document",
  };
  return labels[props.mediaType || "audio"] || "Media";
});

const filteredMedia = computed(() => {
  let filtered = mediaList.value;

  // Filter by media type (backend already filters, but we do it again for search results)
  if (props.mediaType) {
    filtered = filtered.filter((media) => media.media_type === props.mediaType);
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (media) =>
        media.alt_text?.toLowerCase().includes(query) ||
        media.description?.toLowerCase().includes(query) ||
        media.original_filename?.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const loadMedia = async () => {
  try {
    isLoading.value = true;

    const params: any = {};

    // Add center_id if available
    if (authStore.user?.center_id) {
      params.center_id = authStore.user.center_id;
    }

    // Add media_type if specified
    if (props.mediaType) {
      params.media_type = props.mediaType;
    }

    const response = await getAllMedia(params);
    mediaList.value = response.data || [];
  } catch (error) {
    console.error("Failed to load media:", error);
  } finally {
    isLoading.value = false;
  }
};

const selectMedia = (media: MediaItem) => {
  selectedMediaId.value = media.id;
};

const confirmSelection = () => {
  const selected = mediaList.value.find((m) => m.id === selectedMediaId.value);
  if (selected) {
    emit("selected", selected);
    closeModal();
  }
};

const closeModal = () => {
  isOpen.value = false;
  selectedMediaId.value = null;
  searchQuery.value = "";
};

const handleUploaded = (files: MediaItem[]) => {
  mediaList.value.unshift(...files);
  showUploadModal.value = false;

  // Auto-select the first uploaded file
  if (files.length > 0 && files[0]) {
    selectedMediaId.value = files[0].id;
  }
};

const getMediaIcon = (type?: string): string => {
  if (!type) return "lucide:file";
  if (type.startsWith("audio/")) return "lucide:music";
  if (type.startsWith("video/")) return "lucide:video";
  if (type.startsWith("image/")) return "lucide:image";
  if (type.includes("pdf")) return "lucide:file-text";
  return "lucide:file";
};

const getEmptyIcon = (): string => {
  const icons = {
    audio: "lucide:music",
    video: "lucide:video",
    image: "lucide:image",
    document: "lucide:file-text",
  };
  return icons[props.mediaType || "audio"] || "lucide:file";
};

const formatDuration = (media: MediaItem): string => {
  // If duration is available in metadata
  if (media.duration) {
    const minutes = Math.floor(media.duration / 60);
    const seconds = media.duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  return "Audio";
};

// Watch for modal open
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      loadMedia();
    }
  }
);
</script>
