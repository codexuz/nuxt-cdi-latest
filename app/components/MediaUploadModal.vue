<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Upload Media</DialogTitle>
        <DialogDescription>
          Upload single or multiple files to your media library
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Upload Area -->
        <div
          @drop.prevent="handleDrop"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          :class="[
            'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
          ]"
        >
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
            @change="handleFileSelect"
            class="hidden"
          />

          <div class="space-y-4">
            <div
              class="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
            >
              <Icon
                name="lucide:upload-cloud"
                class="w-8 h-8 text-blue-600 dark:text-blue-400"
              />
            </div>

            <div>
              <p class="text-base font-medium text-gray-900 dark:text-gray-100">
                Drop files here or click to browse
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Support for images, videos, audio, documents (Max 10MB each)
              </p>
            </div>

            <Button
              type="button"
              @click="() => fileInput?.click()"
              variant="outline"
              class="mt-4"
            >
              <Icon name="lucide:folder-open" class="mr-2 w-4 h-4" />
              Browse Files
            </Button>
          </div>
        </div>

        <!-- Selected Files List -->
        <div v-if="selectedFiles.length > 0" class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-medium text-gray-900 dark:text-gray-100">
              Selected Files ({{ selectedFiles.length }})
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              @click="clearFiles"
              class="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              Clear All
            </Button>
          </div>

          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
            >
              <!-- File Preview/Icon -->
              <div
                class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              >
                <img
                  v-if="file.preview"
                  :src="file.preview"
                  :alt="file.name"
                  class="w-full h-full object-cover"
                />
                <Icon
                  v-else
                  :name="getFileIcon(file.type)"
                  class="w-6 h-6 text-gray-600 dark:text-gray-400"
                />
              </div>

              <!-- File Info -->
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
                >
                  {{ file.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(file.size) }}
                </p>
              </div>

              <!-- Remove Button -->
              <Button
                type="button"
                variant="ghost"
                size="icon"
                @click="removeFile(index)"
                class="flex-shrink-0 text-gray-500 hover:text-red-600"
              >
                <Icon name="lucide:x" class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Metadata (Optional) -->
        <div v-if="selectedFiles.length === 1" class="space-y-4">
          <div class="space-y-2">
            <Label for="alt-text">Alt Text (Optional)</Label>
            <Input
              id="alt-text"
              v-model="altText"
              placeholder="Describe the image for accessibility"
            />
          </div>

          <div class="space-y-2">
            <Label for="description">Description (Optional)</Label>
            <Textarea
              id="description"
              v-model="description"
              placeholder="Additional details about this file"
              rows="3"
            />
          </div>
        </div>

        <!-- Upload Progress -->
        <div v-if="isUploading" class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-700 dark:text-gray-300">Uploading...</span>
            <span class="text-gray-500 dark:text-gray-400"
              >{{ uploadProgress }}%</span
            >
          </div>
          <Progress :model-value="uploadProgress" class="h-2" />
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          @click="closeModal"
          :disabled="isUploading"
        >
          Cancel
        </Button>
        <Button
          type="button"
          @click="handleUpload"
          :disabled="selectedFiles.length === 0 || isUploading"
          class="bg-gradient-to-r from-[#2563EB] to-[#1A73E8] hover:from-[#1d4ed8] hover:to-[#1557b0]"
        >
          <Icon
            v-if="isUploading"
            name="lucide:loader-2"
            class="mr-2 w-4 h-4 animate-spin"
          />
          <Icon v-else name="lucide:upload" class="mr-2 w-4 h-4" />
          {{ isUploading ? "Uploading..." : "Upload Files" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";
import type { UploadMediaData } from "~/composables/useMedia";
import { useMedia } from "~/composables/useMedia";

const props = defineProps<{
  open: boolean;
  centerId?: string;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  uploaded: [files: any[]];
}>();

const { uploadMedia, uploadMultipleMedia, formatFileSize } = useMedia();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<
  Array<{
    file: File;
    name: string;
    size: number;
    type: string;
    preview?: string;
  }>
>([]);
const isDragging = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const altText = ref("");
const description = ref("");

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    addFiles(Array.from(target.files));
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files));
  }
};

const addFiles = (files: File[]) => {
  files.forEach((file) => {
    // Check file size (10MB limit)
    if (file.size > 100 * 1024 * 1024) {
      toast.error(`${file.name} is too large. Max size is 10MB.`);
      return;
    }

    const fileData = {
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: undefined as string | undefined,
    };

    // Generate preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.preview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }

    selectedFiles.value.push(fileData);
  });
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const clearFiles = () => {
  selectedFiles.value = [];
  altText.value = "";
  description.value = "";
};

const getFileIcon = (type: string): string => {
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

const handleUpload = async () => {
  try {
    isUploading.value = true;
    uploadProgress.value = 0;

    let uploadedFiles;

    if (selectedFiles.value.length === 1 && selectedFiles.value[0]) {
      // Single file upload with metadata
      const data: UploadMediaData = {
        file: selectedFiles.value[0].file,
        alt_text: altText.value || undefined,
        description: description.value || undefined,
        center_id: props.centerId,
      };

      const result = await uploadMedia(data);
      uploadedFiles = [result];
    } else {
      // Multiple file upload
      const files = selectedFiles.value.map((f) => f.file);
      uploadedFiles = await uploadMultipleMedia(files, props.centerId);
    }

    uploadProgress.value = 100;

    // Emit success
    emit("uploaded", uploadedFiles);

    // Close modal and reset
    setTimeout(() => {
      closeModal();
    }, 500);
  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
};

const closeModal = () => {
  isOpen.value = false;
  clearFiles();
};
</script>
