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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Leads Management</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Track and manage your sales leads</p>
      </div>
      <Button>
        <Plus class="h-4 w-4 mr-2" />
        Add Lead
      </Button>
    </motion.div>

    <!-- Filters -->
    <motion.div 
      class="flex gap-4"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input placeholder="Search leads..." class="pl-10" />
      </div>
      <Select>
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="contacted">Contacted</SelectItem>
          <SelectItem value="qualified">Qualified</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>

    <!-- Leads Table -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.3 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card>
        <CardContent class="p-6">
          <div class="text-center py-12 text-gray-500">
            No leads found. Add your first lead to get started.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";
import { Plus, Search } from "lucide-vue-next";

useHead({
  title: "Leads - CRM",
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
