<template>
  <div class="space-y-4">
    <div>
      <h3 class="text-base font-semibold text-gray-900 mb-1">Pinned attachments</h3>
      <p class="text-sm text-gray-500 mb-4">Will be placed at the very top of the content</p>
      
      <!-- File List -->
      <div v-if="block.files && block.files.length > 0" class="space-y-2 mb-3">
        <div
          v-for="(file, fileIndex) in block.files"
          :key="fileIndex"
          class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100 group hover:bg-orange-100 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="bg-orange-500 p-2 rounded">
              <FileText class="h-4 w-4 text-white" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            @click="removeFile(fileIndex)"
            class="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X class="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>

      <!-- Add Attachments Button -->
      <Button 
        @click="$emit('open-media-picker')" 
        variant="outline" 
        class="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
      >
        <Paperclip class="h-4 w-4 mr-2" />
        Add attachments
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, X, Paperclip } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

interface AttachmentFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface AttachmentBlockProps {
  block: {
    id: number;
    type: string;
    files: AttachmentFile[];
  };
}

const props = defineProps<AttachmentBlockProps>();
const emit = defineEmits<{
  'update:block': [block: any];
  'open-media-picker': [];
}>();

const formatFileSize = (bytes: number = 0) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const removeFile = (fileIndex: number) => {
  const updatedFiles = [...props.block.files];
  updatedFiles.splice(fileIndex, 1);
  emit('update:block', { ...props.block, files: updatedFiles });
};
</script>
