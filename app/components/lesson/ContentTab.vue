<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Content Blocks</h3>
      <span class="text-sm text-gray-500">{{ contentBlocks.length }} blocks</span>
    </div>
    <div class="space-y-2">
      <div
        v-for="(block, index) in contentBlocks"
        :key="block.id"
        class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <component :is="getBlockIcon(block.type)" class="h-5 w-5 text-gray-500" />
        <span class="text-sm font-medium text-gray-700 flex-1">{{ block.type }}</span>
        <Button variant="ghost" size="icon" @click="$emit('remove-block', index)">
          <X class="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div v-if="contentBlocks.length === 0" class="text-center py-8">
      <FileText class="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-500">No content blocks yet</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, FileEdit, Video, Code, Paperclip, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

interface ContentTabProps {
  contentBlocks: any[];
}

defineProps<ContentTabProps>();
defineEmits<{
  'remove-block': [index: number];
}>();

const getBlockIcon = (type: string) => {
  switch (type) {
    case "Editor":
      return FileEdit;
    case "Video":
      return Video;
    case "Iframe":
      return Code;
    case "Attachment":
      return Paperclip;
    default:
      return FileText;
  }
};
</script>
