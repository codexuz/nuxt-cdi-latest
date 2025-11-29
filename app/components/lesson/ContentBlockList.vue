<template>
  <div>
    <!-- Empty State -->
    <motion.div
      v-if="contentBlocks.length === 0"
      class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-16 text-center mb-8"
      :initial="{ opacity: 0, scale: 0.95 }"
      :animate="{ opacity: 1, scale: 1 }"
      :transition="{ duration: 0.3 }"
    >
      <div class="flex items-center justify-center mb-6">
        <div class="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-2xl">
          <FileText class="h-16 w-16 text-blue-500 dark:text-blue-400" />
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Fill in the content
      </h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8">
        It's empty here for now, add the first block below
      </p>
    </motion.div>

    <!-- Content Blocks -->
    <div v-else class="space-y-4 mb-8">
      <motion.div
        v-for="(block, index) in contentBlocks"
        :key="block.id"
        class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.3, delay: index * 0.05 }"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <component
              :is="getBlockIcon(block.type)"
              class="h-5 w-5 text-blue-500 dark:text-blue-400"
            />
            <span class="font-semibold text-gray-900 dark:text-gray-100">{{
              block.type
            }}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            @click="$emit('remove-block', index)"
          >
            <X class="h-4 w-4" />
          </Button>
        </div>

        <!-- Editor Block -->
        <EditorBlock
          v-if="block.type === 'Editor'"
          :block="block"
          @update:block="(updated) => updateBlock(index, updated)"
        />

        <!-- Video Block -->
        <VideoBlock
          v-else-if="block.type === 'Video'"
          :block="block"
          @update:block="(updated) => updateBlock(index, updated)"
          @open-media-picker="$emit('open-media-picker', index)"
        />

        <!-- Iframe Block -->
        <IframeBlock
          v-else-if="block.type === 'Iframe'"
          :block="block"
          @update:block="(updated) => updateBlock(index, updated)"
        />

        <!-- Attachment Block -->
        <AttachmentBlock
          v-else-if="block.type === 'Attachment'"
          :block="block"
          @update:block="(updated) => updateBlock(index, updated)"
          @open-media-picker="$emit('open-media-picker', index)"
        />
      </motion.div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { FileText, FileEdit, Video, Code, Paperclip, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import EditorBlock from "./EditorBlock.vue";
import VideoBlock from "./VideoBlock.vue";
import IframeBlock from "./IframeBlock.vue";
import AttachmentBlock from "./AttachmentBlock.vue";

interface ContentBlockListProps {
  contentBlocks: any[];
}

const props = defineProps<ContentBlockListProps>();
const emit = defineEmits<{
  "update:content-blocks": [blocks: any[]];
  "remove-block": [index: number];
  "open-media-picker": [index: number];
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

const updateBlock = (index: number, updatedBlock: any) => {
  console.log("ContentBlockList updateBlock called:", { index, updatedBlock });
  const blocks = [...props.contentBlocks];
  blocks[index] = updatedBlock;
  emit("update:content-blocks", blocks);
};
</script>
