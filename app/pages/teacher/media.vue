<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Toaster position="top-right" />

    <!-- Header -->
    <div
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Media Library
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your uploaded files and media assets
            </p>
          </div>

          <Button
            @click="openUploadModal"
            class="bg-gradient-to-r from-[#2563EB] to-[#1A73E8] hover:from-[#1d4ed8] hover:to-[#1557b0]"
          >
            <Icon name="lucide:upload" class="mr-2 w-4 h-4" />
            Upload Media
          </Button>
        </div>

        <!-- Filters -->
        <div class="mt-6 flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1 relative">
            <Icon
              name="lucide:search"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search media files..."
              class="pl-10"
            />
          </div>

          <!-- Type Filter -->
          <Select v-model="selectedType">
            <SelectTrigger class="w-full sm:w-[200px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="pdf">PDFs</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>

          <!-- View Mode Toggle -->
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              :class="{ 'bg-gray-100 dark:bg-gray-700': viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <Icon name="lucide:grid-3x3" class="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              :class="{ 'bg-gray-100 dark:bg-gray-700': viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <Icon name="lucide:list" class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <Icon
          name="lucide:loader-2"
          class="w-8 h-8 animate-spin text-blue-600"
        />
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredMedia.length === 0" class="text-center py-20">
        <div
          class="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4"
        >
          <Icon
            name="lucide:image-off"
            class="w-12 h-12 text-gray-400 dark:text-gray-600"
          />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
          No media files found
        </h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {{
            searchQuery
              ? "Try adjusting your search or filters"
              : "Get started by uploading your first media file"
          }}
        </p>
        <Button
          v-if="!searchQuery"
          @click="openUploadModal"
          class="mt-6 bg-gradient-to-r from-[#2563EB] to-[#1A73E8]"
        >
          <Icon name="lucide:upload" class="mr-2 w-4 h-4" />
          Upload Media
        </Button>
      </div>

      <!-- Grid View -->
      <div
        v-else-if="viewMode === 'grid'"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="media in filteredMedia"
          :key="media.id"
          class="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200"
        >
          <!-- Media Preview -->
          <div
            class="aspect-square bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden cursor-pointer"
            @click="viewMedia(media)"
          >
            <img
              v-if="media.mime_type?.startsWith('image/')"
              :src="media.url"
              :alt="media.alt_text || 'Media'"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <video
              v-else-if="media.mime_type?.startsWith('video/')"
              :src="media.url"
              class="w-full h-full object-cover"
            />
            <Icon
              v-else
              :name="getMediaIcon(media.mime_type)"
              class="w-16 h-16 text-gray-400 dark:text-gray-600"
            />
          </div>

          <!-- Actions Overlay -->
          <div
            class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button
              size="icon"
              variant="secondary"
              class="w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur"
              @click="editMedia(media)"
            >
              <Icon name="lucide:edit" class="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              class="w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur text-red-600 hover:text-red-700"
              @click="confirmDelete(media)"
            >
              <Icon name="lucide:trash-2" class="w-4 h-4" />
            </Button>
          </div>

          <!-- Media Info -->
          <div class="p-4">
            <p
              class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
              :title="media.alt_text || 'Untitled'"
            >
              {{ media.alt_text || "Untitled" }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ formatFileSize(parseInt(media.file_size)) }} •
              {{ formatDate(media.created_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="media in filteredMedia"
              :key="media.id"
              class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <TableCell @click="viewMedia(media)">
                <div
                  class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden"
                >
                  <img
                    v-if="media.mime_type?.startsWith('image/')"
                    :src="media.url"
                    :alt="media.alt_text || 'Media'"
                    class="w-full h-full object-cover"
                  />
                  <Icon
                    v-else
                    :name="getMediaIcon(media.mime_type)"
                    class="w-5 h-5 text-gray-400"
                  />
                </div>
              </TableCell>
              <TableCell @click="viewMedia(media)">
                <div>
                  <p class="font-medium text-gray-900 dark:text-gray-100">
                    {{ media.alt_text || "Untitled" }}
                  </p>
                  <p
                    v-if="media.description"
                    class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md"
                  >
                    {{ media.description }}
                  </p>
                </div>
              </TableCell>
              <TableCell @click="viewMedia(media)">
                <Badge variant="secondary">{{
                  getFileTypeLabel(media.mime_type)
                }}</Badge>
              </TableCell>
              <TableCell @click="viewMedia(media)">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{
                  formatFileSize(parseInt(media.file_size))
                }}</span>
              </TableCell>
              <TableCell @click="viewMedia(media)">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{
                  formatDate(media.created_at)
                }}</span>
              </TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" @click="editMedia(media)">
                    <Icon name="lucide:edit" class="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    class="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    @click="confirmDelete(media)"
                  >
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <!-- Upload Modal -->
    <MediaUploadModal
      v-model:open="showUploadModal"
      :center-id="user?.center_id"
      @uploaded="handleUploaded"
    />

    <!-- Edit Modal -->
    <MediaEditModal
      v-model:open="showEditModal"
      :media="selectedMedia"
      @updated="handleUpdated"
    />

    <!-- View Modal -->
    <Dialog v-model:open="showViewModal">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{{
            selectedMedia?.alt_text || "Media Preview"
          }}</DialogTitle>
          <DialogDescription v-if="selectedMedia?.description">
            {{ selectedMedia.description }}
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedMedia" class="space-y-4">
          <div
            class="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            style="max-height: 70vh"
          >
            <img
              v-if="selectedMedia.mime_type?.startsWith('image/')"
              :src="selectedMedia.url"
              :alt="selectedMedia.alt_text || 'Media'"
              class="max-w-full max-h-[70vh] object-contain"
            />
            <video
              v-else-if="selectedMedia.mime_type?.startsWith('video/')"
              :src="selectedMedia.url"
              controls
              class="max-w-full max-h-[70vh]"
            />
            <audio
              v-else-if="selectedMedia.mime_type?.startsWith('audio/')"
              :src="selectedMedia.url"
              controls
              class="w-full"
            />
            <div v-else class="p-12 text-center">
              <Icon
                :name="getMediaIcon(selectedMedia.mime_type)"
                class="w-24 h-24 text-gray-400 mx-auto mb-4"
              />
              <a
                :href="selectedMedia.url"
                target="_blank"
                class="text-blue-600 hover:text-blue-700 underline"
              >
                Download File
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation -->
    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Media?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the media
            file from your library.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="handleDelete"
            class="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { toast, Toaster } from "vue-sonner";
import type { MediaItem } from "~/composables/useMedia";
import { useMedia } from "~/composables/useMedia";

definePageMeta({
  middleware: "auth",
  layout: "teacher",
});

const { user } = useAuth();
const { getAllMedia, deleteMedia, formatFileSize, getFileTypeCategory } =
  useMedia();

// State
const mediaList = ref<MediaItem[]>([]);
const isLoading = ref(true);
const searchQuery = ref("");
const selectedType = ref("all");
const viewMode = ref<"grid" | "list">("grid");

// Modals
const showUploadModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const showDeleteDialog = ref(false);
const selectedMedia = ref<MediaItem | null>(null);

// Computed
const filteredMedia = computed(() => {
  let filtered = mediaList.value;

  // Filter by type
  if (selectedType.value !== "all") {
    filtered = filtered.filter(
      (media) => media.media_type === selectedType.value
    );
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (media) =>
        media.alt_text?.toLowerCase().includes(query) ||
        media.description?.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Methods
const loadMedia = async () => {
  try {
    isLoading.value = true;
    const response = await getAllMedia();
    mediaList.value = response.data || [];
  } catch (error) {
    console.error("Failed to load media:", error);
  } finally {
    isLoading.value = false;
  }
};

const openUploadModal = () => {
  showUploadModal.value = true;
};

const handleUploaded = (files: MediaItem[]) => {
  mediaList.value.unshift(...files);
  showUploadModal.value = false;
};

const viewMedia = (media: MediaItem) => {
  selectedMedia.value = media;
  showViewModal.value = true;
};

const editMedia = (media: MediaItem) => {
  selectedMedia.value = media;
  showEditModal.value = true;
};

const handleUpdated = (updated: MediaItem) => {
  const index = mediaList.value.findIndex((m) => m.id === updated.id);
  if (index !== -1) {
    mediaList.value[index] = updated;
  }
  showEditModal.value = false;
};

const confirmDelete = (media: MediaItem) => {
  selectedMedia.value = media;
  showDeleteDialog.value = true;
};

const handleDelete = async () => {
  if (!selectedMedia.value) return;

  try {
    await deleteMedia(selectedMedia.value.id);
    mediaList.value = mediaList.value.filter(
      (m) => m.id !== selectedMedia.value!.id
    );
    showDeleteDialog.value = false;
    selectedMedia.value = null;
  } catch (error) {
    console.error("Failed to delete media:", error);
  }
};

const getMediaIcon = (type: string): string => {
  if (!type) return "lucide:file";
  if (type.startsWith("image/")) return "lucide:image";
  if (type.startsWith("video/")) return "lucide:video";
  if (type.startsWith("audio/")) return "lucide:music";
  if (type.includes("pdf")) return "lucide:file-text";
  if (type.includes("word") || type.includes("document"))
    return "lucide:file-text";
  if (type.includes("sheet") || type.includes("excel"))
    return "lucide:file-spreadsheet";
  return "lucide:file";
};

const getFileTypeLabel = (type: string): string => {
  const category = getFileTypeCategory(type);
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Load media on mount
onMounted(() => {
  loadMedia();
});
</script>
