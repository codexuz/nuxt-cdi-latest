<template>
  <motion.div 
    class="space-y-6"
    :initial="{ opacity: 0, y: 20 }"
    :transition="{ duration: 0.6, ease: 'easeOut' }"
    :animate="{ opacity: 1, y: 0 }">
    <!-- Header -->
    <motion.div
      :initial="{ opacity: 0, y: -10 }"
      :transition="{ duration: 0.5, delay: 0.1 }"
      :animate="{ opacity: 1, y: 0 }">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Student Progress</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Track student learning progress</p>
    </motion.div>

    <!-- Progress Overview -->
    <motion.div 
      class="grid grid-cols-1 lg:grid-cols-2 gap-6"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="i in 5" :key="i">
              <div class="flex justify-between text-sm mb-2">
                <span>Student {{ i }}</span>
                <span>{{ 60 + i * 5 }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" :style="{ width: `${60 + i * 5}%` }"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Completions</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>S{{ i }}</AvatarFallback>
                </Avatar>
                <div>
                  <p class="font-medium">Student {{ i }}</p>
                  <p class="text-sm text-gray-500">Completed Course {{ i }}</p>
                </div>
              </div>
              <Badge variant="outline">{{ i }}h ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";

useHead({
  title: "Progress - LMS",
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
