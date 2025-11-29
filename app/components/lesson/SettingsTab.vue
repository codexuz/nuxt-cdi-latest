<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl p-6 space-y-6">
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Topic and Description
      </h3>

      <div class="space-y-4">
        <div>
          <Label
            for="lesson-title"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
            >Title</Label
          >
          <Input
            id="lesson-title"
            :model-value="lesson.title"
            @update:model-value="updateTitle"
            placeholder="Lesson 1"
            class="w-full"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            {{ lesson.title?.length || 0 }} / 120
          </p>
        </div>

        <div>
          <Label
            for="lesson-description"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
            >Brief description</Label
          >
          <textarea
            id="lesson-description"
            :value="lesson.description"
            @input="updateDescription"
            placeholder="What will be learned..."
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent resize-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          ></textarea>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            {{ lesson.description?.length || 0 }} / 500
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsTabProps {
  lesson: {
    title: string;
    description: string;
  };
}

const props = defineProps<SettingsTabProps>();
const emit = defineEmits<{
  "update:lesson": [lesson: any];
}>();

const updateTitle = (value: string) => {
  emit("update:lesson", { ...props.lesson, title: value });
};

const updateDescription = (event: Event) => {
  const value = (event.target as HTMLTextAreaElement).value;
  emit("update:lesson", { ...props.lesson, description: value });
};
</script>
