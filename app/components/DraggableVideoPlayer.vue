<template>
  <div>
    <!-- Small Draggable Video Container -->
    <div
      ref="videoContainer"
      v-if="!isFullscreen"
      :style="{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab'
      }"
      class="group bg-black rounded-lg shadow-2xl overflow-hidden border-2 border-primary/20"
      style="width: 320px; height: 180px;"
    >
      <!-- Video -->
      <video
        ref="videoElement"
        :src="videoUrl"
        class="w-full h-full object-cover"
        controls
        autoplay
        muted
        loop
      />

      <!-- Overlay Controls -->
      <div
        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
      >
        <!-- Close Button (X) -->
        <Button
          variant="ghost"
          size="icon"
          @click.stop="closeVideo"
          class="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white pointer-events-auto"
        >
          <X class="h-4 w-4" />
        </Button>

        <!-- Fullscreen Button -->
        <Button
          variant="ghost"
          size="icon"
          @click.stop="openFullscreen"
          class="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white pointer-events-auto"
          title="Open fullscreen"
        >
          <Maximize2 class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <!-- Fullscreen Video Dialog -->
    <Dialog v-model:open="isFullscreen">
      <DialogContent class="max-w-7xl w-[95vw] h-[90vh] p-0">
        <div class="relative w-full h-full bg-black">
          <video
            ref="fullscreenVideoElement"
            :src="videoUrl"
            class="w-full h-full object-contain"
            controls
            autoplay
          />
          
          <Button
            variant="ghost"
            size="icon"
            @click="closeFullscreen"
            class="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 hover:bg-black/80 text-white z-10"
          >
            <X class="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDraggable } from '@vueuse/core'
import { X, Maximize2 } from 'lucide-vue-next'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  videoUrl: string
  initialX?: number
  initialY?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialX: 100,
  initialY: 100
})

const emit = defineEmits<{
  close: []
}>()

const videoContainer = ref<HTMLElement | null>(null)
const videoElement = ref<HTMLVideoElement | null>(null)
const fullscreenVideoElement = ref<HTMLVideoElement | null>(null)
const isFullscreen = ref(false)

// Setup draggable
const { x, y, isDragging } = useDraggable(videoContainer, {
  initialValue: { x: props.initialX, y: props.initialY },
})

// Sync video time when switching between small and fullscreen
let currentTime = 0
let isPlaying = false

watch(isFullscreen, (fullscreen) => {
  if (fullscreen) {
    // Save state from small video
    if (videoElement.value) {
      currentTime = videoElement.value.currentTime
      isPlaying = !videoElement.value.paused
    }
    // Apply to fullscreen video
    setTimeout(() => {
      if (fullscreenVideoElement.value) {
        fullscreenVideoElement.value.currentTime = currentTime
        if (isPlaying) {
          fullscreenVideoElement.value.play()
        }
      }
    }, 100)
  } else {
    // Save state from fullscreen video
    if (fullscreenVideoElement.value) {
      currentTime = fullscreenVideoElement.value.currentTime
      isPlaying = !fullscreenVideoElement.value.paused
    }
    // Apply to small video
    setTimeout(() => {
      if (videoElement.value) {
        videoElement.value.currentTime = currentTime
        if (isPlaying) {
          videoElement.value.play()
        }
      }
    }, 100)
  }
})

const openFullscreen = () => {
  isFullscreen.value = true
}

const closeFullscreen = () => {
  isFullscreen.value = false
}

const closeVideo = () => {
  emit('close')
}
</script>
