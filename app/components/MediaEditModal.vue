<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Edit Media Details</DialogTitle>
        <DialogDescription>
          Update information about this media file
        </DialogDescription>
      </DialogHeader>

      <div v-if="media" class="space-y-6">
        <!-- Media Preview -->
        <div
          class="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          style="max-height: 300px"
        >
          <img
            v-if="isImage"
            :src="media.url"
            :alt="media.alt_text || 'Media preview'"
            class="max-w-full max-h-[300px] object-contain"
          />
          <video
            v-else-if="isVideo"
            :src="media.url"
            controls
            class="max-w-full max-h-[300px]"
          />
          <audio v-else-if="isAudio" :src="media.url" controls class="w-full" />
          <div v-else class="p-12 text-center flex flex-col items-center gap-4">
            <Icon :name="getFileIcon()" class="w-20 h-20 text-gray-400" />
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ media.mime_type }}
            </p>
          </div>
        </div>

        <!-- File Info -->
        <div
          class="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
        >
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">File Size</p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ formatFileSize(parseInt(media.file_size)) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">File Type</p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ media.mime_type }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Uploaded</p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ formatDate(media.created_at) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Last Modified
            </p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ formatDate(media.updated_at) }}
            </p>
          </div>
        </div>

        <!-- Editable Fields -->
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="edit-alt-text">Alt Text</Label>
            <Input
              id="edit-alt-text"
              v-model="editData.alt_text"
              placeholder="Describe the media for accessibility"
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              v-model="editData.description"
              placeholder="Additional details about this file"
              rows="4"
            />
          </div>
        </div>

        <!-- URL Copy Section -->
        <div class="space-y-2">
          <Label>Media URL</Label>
          <div class="flex gap-2">
            <Input :model-value="media.url" readonly class="flex-1" />
            <Button
              type="button"
              variant="outline"
              @click="copyUrl"
              class="flex-shrink-0"
            >
              <Icon name="lucide:copy" class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          @click="closeModal"
          :disabled="isUpdating"
        >
          Cancel
        </Button>
        <Button
          type="button"
          @click="handleUpdate"
          :disabled="isUpdating || !hasChanges"
          class="bg-gradient-to-r from-[#2563EB] to-[#1A73E8] hover:from-[#1d4ed8] hover:to-[#1557b0]"
        >
          <Icon
            v-if="isUpdating"
            name="lucide:loader-2"
            class="mr-2 w-4 h-4 animate-spin"
          />
          <Icon v-else name="lucide:save" class="mr-2 w-4 h-4" />
          {{ isUpdating ? "Saving..." : "Save Changes" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";
import type { MediaItem } from "~/composables/useMedia";
import { useMedia } from "~/composables/useMedia";
const props = defineProps<{
  open: boolean;
  media: MediaItem | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  updated: [media: MediaItem];
}>();

const { updateMedia, formatFileSize } = useMedia();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const editData = ref({
  alt_text: "",
  description: "",
});

const isUpdating = ref(false);

// Computed properties
const isImage = computed(() => props.media?.mime_type.startsWith("image/"));
const isVideo = computed(() => props.media?.mime_type.startsWith("video/"));
const isAudio = computed(() => props.media?.mime_type.startsWith("audio/"));

const hasChanges = computed(() => {
  if (!props.media) return false;
  return (
    editData.value.alt_text !== (props.media.alt_text || "") ||
    editData.value.description !== (props.media.description || "")
  );
});

// Watch for media changes
watch(
  () => props.media,
  (newMedia) => {
    if (newMedia) {
      editData.value = {
        alt_text: newMedia.alt_text || "",
        description: newMedia.description || "",
      };
    }
  },
  { immediate: true }
);

const getFileIcon = (): string => {
  if (!props.media) return "lucide:file";
  const type = props.media.mime_type;
  if (type.includes("pdf")) return "lucide:file-text";
  if (type.includes("word") || type.includes("document"))
    return "lucide:file-text";
  if (type.includes("sheet") || type.includes("excel"))
    return "lucide:file-spreadsheet";
  return "lucide:file";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const copyUrl = async () => {
  if (props.media?.url) {
    try {
      await navigator.clipboard.writeText(props.media.url);
      toast.success("URL copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  }
};

const handleUpdate = async () => {
  if (!props.media) return;

  try {
    isUpdating.value = true;

    const updated = await updateMedia(props.media.id, {
      alt_text: editData.value.alt_text || undefined,
      description: editData.value.description || undefined,
    });

    emit("updated", updated);
    closeModal();
  } catch (error) {
    console.error("Update failed:", error);
  } finally {
    isUpdating.value = false;
  }
};

const closeModal = () => {
  isOpen.value = false;
};
</script>
