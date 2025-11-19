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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Manage and track all invoices</p>
      </div>
      <Button>
        <Plus class="h-4 w-4 mr-2" />
        Create Invoice
      </Button>
    </motion.div>

    <!-- Invoices List -->
    <motion.div 
      class="space-y-4"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card v-for="i in 8" :key="i">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p class="font-semibold">Invoice #{{ 1000 + i }}</p>
                <p class="text-sm text-gray-500">Client {{ i }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="font-bold">${500 + i * 100}</p>
                <p class="text-sm text-gray-500">{{ new Date().toLocaleDateString() }}</p>
              </div>
              <Badge :variant="i % 3 === 0 ? 'default' : i % 3 === 1 ? 'secondary' : 'outline'">
                {{ i % 3 === 0 ? 'Paid' : i % 3 === 1 ? 'Pending' : 'Overdue' }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";
import { Plus, FileText } from "lucide-vue-next";

useHead({
  title: "Invoices - Finance",
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
