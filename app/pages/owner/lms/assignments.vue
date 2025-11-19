<template>
  <motion.div 
    class="space-y-6"
    :initial="{ opacity: 0, y: 20 }"
    :transition="{ duration: 0.6, ease: 'easeOut' }"
    :animate="{ opacity: 1, y: 0 }">
    <!-- Header -->
    <motion.div
      class="flex items-center justify-between"
      :initial="{ opacity: 0, y: -10 }"
      :transition="{ duration: 0.5, delay: 0.1 }"
      :animate="{ opacity: 1, y: 0 }">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Create and manage course assignments</p>
      </div>
      <Button>
        <Plus class="h-4 w-4 mr-2" />
        Create Assignment
      </Button>
    </motion.div>

    <!-- Assignments List -->
    <motion.div 
      class="space-y-4"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card v-for="i in 5" :key="i">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="font-semibold text-lg">Assignment {{ i }}</h3>
              <p class="text-sm text-gray-600 mt-1">Due date: {{ new Date().toLocaleDateString() }}</p>
            </div>
            <div class="flex items-center gap-4">
              <Badge>{{ 10 + i }} submissions</Badge>
              <Button size="sm" variant="outline">Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";
import { Plus } from "lucide-vue-next";

useHead({
  title: "Assignments - LMS",
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
