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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Courses</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your learning courses</p>
      </div>
      <Button>
        <Plus class="h-4 w-4 mr-2" />
        Create Course
      </Button>
    </motion.div>

    <!-- Stats -->
    <motion.div 
      class="grid grid-cols-1 md:grid-cols-3 gap-6"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
            <BookOpen class="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Students</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">156</p>
            </div>
            <Users class="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">78%</p>
            </div>
            <TrendingUp class="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <!-- Courses Grid -->
    <motion.div 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.3 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card v-for="i in 6" :key="i" class="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Course {{ i }}</CardTitle>
          <CardDescription>Learn essential skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="flex items-center text-sm text-gray-600">
              <Users class="h-4 w-4 mr-2" />
              {{ 20 + i }} students
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <BookOpen class="h-4 w-4 mr-2" />
              {{ 10 + i }} lessons
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";
import { Plus, BookOpen, Users, TrendingUp } from "lucide-vue-next";

useHead({
  title: "Courses - LMS",
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
