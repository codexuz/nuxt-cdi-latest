<template>
  <div class="space-y-4">
    <div>
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Add YouTube or Vimeo Video
      </h3>

      <!-- URL Input -->
      <div class="relative mb-4">
        <div class="absolute left-3 top-1/2 -translate-y-1/2">
          <Link class="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </div>
        <Input
          :model-value="block.url"
          @update:model-value="updateUrl"
          placeholder="Insert a YouTube or Vimeo video URL"
          class="w-full pl-10"
        />
        <button
          v-if="block.url"
          @click="clearUrl"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Video Placeholder -->
      <div
        v-if="!block.url"
        class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700"
      >
        <div class="text-center text-gray-400 dark:text-gray-500">
          <Video class="h-16 w-16 mx-auto mb-2" />
          <p class="text-sm">Add YouTube or Vimeo URL above</p>
        </div>
      </div>

      <!-- Video Preview -->
      <div
        v-if="embedUrl"
        class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 mt-4"
      >
        <iframe
          :src="embedUrl"
          class="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>

      <!-- Video Title -->
      <div class="mt-4">
        <Label
          class="text-sm font-medium text-red-500 dark:text-red-400 mb-2 block"
          >Video Title</Label
        >
        <Input
          :model-value="block.title"
          @update:model-value="updateTitle"
          placeholder="Enter the title of the video"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Link, X, Video } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VideoBlockProps {
  block: {
    id: number;
    type: string;
    title: string;
    url: string;
  };
}

const props = defineProps<VideoBlockProps>();
const emit = defineEmits<{
  "update:block": [block: any];
}>();

// Convert YouTube/Vimeo URLs to embeddable format
const embedUrl = computed(() => {
  if (!props.block.url) return null;

  const url = props.block.url.trim();

  // YouTube URL patterns
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo URL patterns
  const vimeoMatch = url.match(/vimeo\.com\/(?:.*\/)?([0-9]+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
});

const updateUrl = (value: string | number) => {
  emit("update:block", { ...props.block, url: String(value) });
};

const updateTitle = (value: string | number) => {
  emit("update:block", { ...props.block, title: String(value) });
};

const clearUrl = () => {
  emit("update:block", { ...props.block, url: "" });
};
</script>
