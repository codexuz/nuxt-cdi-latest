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
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">CRM Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Manage customer relationships and interactions
      </p>
    </motion.div>

    <!-- Stats Cards -->
    <motion.div 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Leads</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">248</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <UserPlus class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Deals</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">42</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <DollarSign class="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">28%</p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <TrendingUp class="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">$52K</p>
            </div>
            <div class="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <BarChart3 class="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <!-- Recent Activity -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.3 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card>
        <CardHeader>
          <CardTitle>Recent Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <Avatar>
                <AvatarFallback>CL</AvatarFallback>
              </Avatar>
              <div class="flex-1">
                <p class="text-sm font-medium">Contact with Lead #{{ i }}</p>
                <p class="text-xs text-gray-500">{{ i }} hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";
import { UserPlus, DollarSign, TrendingUp, BarChart3 } from "lucide-vue-next";

useHead({
  title: "CRM - Dashboard",
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
