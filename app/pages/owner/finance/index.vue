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
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Finance Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Monitor your financial performance</p>
    </motion.div>

    <!-- Financial Stats -->
    <motion.div 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">$125K</p>
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
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Expenses</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">$45K</p>
            </div>
            <div class="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <TrendingDown class="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">$80K</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <TrendingUp class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Outstanding</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">$12K</p>
            </div>
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Clock class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <!-- Recent Transactions -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.3 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div class="flex items-center space-x-4">
                <div :class="i % 2 === 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'" class="p-2 rounded-full">
                  <ArrowUpRight v-if="i % 2 === 0" class="h-4 w-4" />
                  <ArrowDownRight v-else class="h-4 w-4" />
                </div>
                <div>
                  <p class="font-medium">{{ i % 2 === 0 ? 'Payment Received' : 'Expense Payment' }}</p>
                  <p class="text-sm text-gray-500">{{ new Date().toLocaleDateString() }}</p>
                </div>
              </div>
              <p :class="i % 2 === 0 ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                {{ i % 2 === 0 ? '+' : '-' }}${{ 100 * i }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";
import { DollarSign, TrendingDown, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from "lucide-vue-next";

useHead({
  title: "Finance - Dashboard",
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
