<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <motion.button
      @click="$emit('add-block', 'Editor')"
      class="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
      :whileHover="{ scale: 1.02 }"
      :whileTap="{ scale: 0.98 }"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="bg-blue-50 p-4 rounded-xl group-hover:bg-blue-100 transition-colors">
          <FileEdit class="h-8 w-8 text-blue-500" />
        </div>
        <span class="font-medium text-gray-700">Editor</span>
      </div>
    </motion.button>

    <motion.button
      @click="$emit('add-block', 'Video')"
      class="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all duration-200"
      :whileHover="{ scale: 1.02 }"
      :whileTap="{ scale: 0.98 }"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="bg-purple-50 p-4 rounded-xl group-hover:bg-purple-100 transition-colors">
          <Video class="h-8 w-8 text-purple-500" />
        </div>
        <span class="font-medium text-gray-700">Video</span>
      </div>
    </motion.button>

    <motion.button
      @click="$emit('add-block', 'Iframe')"
      class="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200"
      :whileHover="{ scale: 1.02 }"
      :whileTap="{ scale: 0.98 }"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="bg-green-50 p-4 rounded-xl group-hover:bg-green-100 transition-colors">
          <Code class="h-8 w-8 text-green-500" />
        </div>
        <span class="font-medium text-gray-700">Iframe</span>
      </div>
    </motion.button>

    <motion.button
      @click="$emit('add-block', 'Attachment')"
      class="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-200"
      :whileHover="{ scale: 1.02 }"
      :whileTap="{ scale: 0.98 }"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="bg-orange-50 p-4 rounded-xl group-hover:bg-orange-100 transition-colors">
          <Paperclip class="h-8 w-8 text-orange-500" />
        </div>
        <span class="font-medium text-gray-700">Attachment</span>
      </div>
    </motion.button>
  </div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { FileEdit, Video, Code, Paperclip } from "lucide-vue-next";

defineEmits<{
  'add-block': [type: string];
}>();
</script>
