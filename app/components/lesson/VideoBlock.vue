<template>
  <div class="space-y-4">
    <div>
      <h3 class="text-base font-semibold text-gray-900 mb-3">Upload a video or provide a link</h3>
      
      <!-- URL Input -->
      <div class="relative mb-4">
        <div class="absolute left-3 top-1/2 -translate-y-1/2">
          <Link class="h-4 w-4 text-gray-400" />
        </div>
        <Input
          :model-value="block.url"
          @update:model-value="updateUrl"
          placeholder="You can insert a YouTube, Vimeo or direct video link"
          class="w-full pl-10"
        />
        <button
          v-if="block.url"
          @click="clearUrl"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Upload Area -->
      <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
        <button
          type="button"
          class="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all group-hover:scale-110"
        >
          <Plus class="h-8 w-8" />
        </button>
      </div>

      <!-- Video Title -->
      <div class="mt-4">
        <Label class="text-sm font-medium text-red-500 mb-2 block">Video Title</Label>
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
import { Link, X, Plus } from "lucide-vue-next";
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
  'update:block': [block: any];
}>();

const updateUrl = (value: string) => {
  emit('update:block', { ...props.block, url: value });
};

const updateTitle = (value: string) => {
  emit('update:block', { ...props.block, title: value });
};

const clearUrl = () => {
  emit('update:block', { ...props.block, url: '' });
};
</script>
