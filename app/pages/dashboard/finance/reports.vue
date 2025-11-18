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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Financial Reports</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">View and download financial reports</p>
      </div>
      <Button>
        <Download class="h-4 w-4 mr-2" />
        Generate Report
      </Button>
    </motion.div>

    <!-- Report Cards -->
    <motion.div 
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card v-for="i in 4" :key="i" class="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <BarChart3 class="h-5 w-5" />
            {{ ['Monthly Report', 'Quarterly Report', 'Annual Report', 'Tax Report'][i - 1] }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-gray-600 mb-4">
            Detailed financial analysis for {{ ['this month', 'Q1 2025', '2024', 'fiscal year'][i - 1] }}
          </p>
          <Button variant="outline" size="sm" class="w-full">
            <Download class="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";
import { Download, BarChart3 } from "lucide-vue-next";

useHead({
  title: "Reports - Finance",
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
