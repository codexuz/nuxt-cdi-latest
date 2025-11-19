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
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Comprehensive insights and metrics</p>
    </motion.div>

    <!-- Key Metrics -->
    <motion.div 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">2,543</p>
              <p class="text-xs text-green-600 mt-1">↑ 12% from last month</p>
            </div>
            <Users class="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">428</p>
              <p class="text-xs text-green-600 mt-1">↑ 8% from last week</p>
            </div>
            <Activity class="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">3.2%</p>
              <p class="text-xs text-red-600 mt-1">↓ 2% from last month</p>
            </div>
            <TrendingUp class="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Session</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">4m 32s</p>
              <p class="text-xs text-green-600 mt-1">↑ 15% from last week</p>
            </div>
            <Clock class="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <!-- Charts Section -->
    <motion.div 
      class="grid grid-cols-1 lg:grid-cols-2 gap-6"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.3 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Monthly user registration trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-64 flex items-center justify-center text-gray-400">
            <BarChart3 class="h-16 w-16" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>Where your users come from</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="(source, i) in trafficSources" :key="i">
              <div class="flex justify-between text-sm mb-2">
                <span>{{ source.name }}</span>
                <span class="font-semibold">{{ source.percentage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" :style="{ width: `${source.percentage}%` }"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <!-- Recent Activity -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.4 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="i in 6" :key="i" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div class="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>U{{ i }}</AvatarFallback>
                </Avatar>
                <div>
                  <p class="font-medium">User {{ i }} {{ ['registered', 'completed course', 'made purchase', 'left review'][i % 4] }}</p>
                  <p class="text-sm text-gray-500">{{ i }} minutes ago</p>
                </div>
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
import { Users, Activity, TrendingUp, Clock, BarChart3 } from "lucide-vue-next";

useHead({
  title: "Analytics - Dashboard",
});

const trafficSources = ref([
  { name: "Direct", percentage: 45 },
  { name: "Organic Search", percentage: 30 },
  { name: "Social Media", percentage: 15 },
  { name: "Referral", percentage: 10 }
]);

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
