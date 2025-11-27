<template>
  <div class="space-y-3">
    <Input
      :model-value="block.url"
      @update:model-value="updateUrl"
      placeholder="Enter iframe URL"
      class="w-full"
    />
    <div v-if="block.url" class="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
      <Code class="h-12 w-12 text-gray-400" />
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
  'update:block': [block: any];
}>();

const updateUrl = (value: string) => {
  emit('update:block', { ...props.block, url: value });
};
</script>
