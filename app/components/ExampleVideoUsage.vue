<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Draggable Video Player Example</h1>
    
    <Button @click="showVideo = true" v-if="!showVideo">
      Show Video
    </Button>

    <!-- Draggable Video Player -->
    <DraggableVideoPlayer
      v-if="showVideo"
      video-url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      :initial-x="100"
      :initial-y="100"
      @close="showVideo = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import DraggableVideoPlayer from '@/components/DraggableVideoPlayer.vue'

const showVideo = ref(false)
</script>
