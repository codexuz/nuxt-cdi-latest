<template>
  <div class="space-y-3">
    <Input
      :model-value="block.url"
      @update:model-value="updateUrl"
      placeholder="Enter iframe URL"
      class="w-full"
    />
    <div
      v-if="block.url"
      class="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-300"
    >
      <iframe
        :src="block.url"
        class="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Code } from "lucide-vue-next";
import { Input } from "@/components/ui/input";

interface IframeBlockProps {
  block: {
    id: number;
    type: string;
    url: string;
  };
}

const props = defineProps<IframeBlockProps>();
const emit = defineEmits<{
  "update:block": [block: any];
}>();

const updateUrl = (value: string | number) => {
  let cleanUrl = String(value).trim();

  // Check if the input contains iframe HTML
  if (cleanUrl.includes("<iframe") && cleanUrl.includes("</iframe>")) {
    // Extract src attribute from iframe HTML
    const srcMatch = cleanUrl.match(/src="([^"]*)"/);
    if (srcMatch && srcMatch[1]) {
      cleanUrl = srcMatch[1];
    }
  }

  // Additional cleaning for common iframe scenarios
  if (cleanUrl.startsWith("<iframe")) {
    const srcMatch =
      cleanUrl.match(/src="([^"]*)"/) || cleanUrl.match(/src='([^']*)'/);
    if (srcMatch && srcMatch[1]) {
      cleanUrl = srcMatch[1];
    }
  }

  emit("update:block", { ...props.block, url: cleanUrl });
};
</script>
