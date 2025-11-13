<template>
  <section class="relative flex items-center justify-center overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10 dark:opacity-5">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>
    
    <!-- Floating Elements -->
    <div class="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
    <div class="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 animate-bounce" style="animation-delay: 2s;"></div>
    <div class="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full opacity-30 animate-ping" style="animation-delay: 1s;"></div>
    
    <div class="container mx-auto px-4 py-16 relative z-10">
      <div class="flex items-center justify-center">
        <!-- Content Section -->
        <div class="text-center space-y-8 max-w-4xl">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            Real IELTS Preparation Platform
          </div>
          
          <!-- Main Heading -->
          <div class="space-y-4">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Impulse CDI
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                IELTS
              </span>
              <br>Real Exam Atmosphere
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Achieve your target band score with our comprehensive IELTS preparation platform. Practice tests, expert guidance, and personalized feedback to boost your confidence.
            </p>
          </div>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink to="/exams" class="px-6 py-2.5 flex items-center bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-medium rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm">
                <laptop-minimal-check class="w-5 h-5 inline-block mr-2"/>
              CD Online
            </NuxtLink>
            <NuxtLink to="/exams" class="px-6 py-2.5 border-2 border-gray-300 cursor-pointer dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 font-medium rounded-2xl transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm">
                <laptop-minimal class="w-5 h-5 inline-block mr-2"/>
              CD Offline
            </NuxtLink>
          </div>
          
          <!-- Trust Indicators -->
          <div class="flex flex-wrap items-center justify-center gap-6 pt-8 opacity-70">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Authentic Exam Materials
            </div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Fastest Results
            </div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Reasonable Price
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </section>
</template>

<script setup lang="ts">
import { LaptopMinimalCheck, LaptopMinimal } from 'lucide-vue-next';
</script>

<style scoped>
/* Additional custom styles if needed */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating {
  animation: float 3s ease-in-out infinite;
}
</style>