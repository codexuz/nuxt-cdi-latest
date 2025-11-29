<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <motion.button
      @click="$emit('add-block', 'Editor')"
      class="group bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
      :whileHover="{ scale: 1.02 }"
      :whileTap="{ scale: 0.98 }"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors"
        >
          <FileEdit class="h-8 w-8 text-blue-500 dark:text-blue-400" />
        </div>
        <span class="font-medium text-gray-700 dark:text-gray-300">Editor</span>
      </div>
    </motion.button>

    <motion.button
      @click="$emit('add-block', 'Video')"
      class="group bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200"
      :whileHover="{ scale: 1.02 }"
      :whileTap="{ scale: 0.98 }"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors"
        >
          <Video class="h-8 w-8 text-purple-500 dark:text-purple-400" />
        </div>
        <span class="font-medium text-gray-700 dark:text-gray-300">Video</span>
      </div>
    </motion.button>

    <motion.button
      @click="$emit('add-block', 'Iframe')"
      class="group bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-200"
      :whileHover="{ scale: 1.02 }"
      :whileTap="{ scale: 0.98 }"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors"
        >
          <Code class="h-8 w-8 text-green-500 dark:text-green-400" />
        </div>
        <span class="font-medium text-gray-700 dark:text-gray-300">Iframe</span>
      </div>
    </motion.button>

    <motion.button
      @click="$emit('add-block', 'Attachment')"
      class="group bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200"
      :whileHover="{ scale: 1.02 }"
      :whileTap="{ scale: 0.98 }"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors"
        >
          <Paperclip class="h-8 w-8 text-orange-500 dark:text-orange-400" />
        </div>
        <span class="font-medium text-gray-700 dark:text-gray-300"
          >Attachment</span
        >
      </div>
    </motion.button>
  </div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { FileEdit, Video, Code, Paperclip } from "lucide-vue-next";

defineEmits<{
  "add-block": [type: string];
}>();
</script>
