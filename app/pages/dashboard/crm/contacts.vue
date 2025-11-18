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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Contacts</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Manage all your customer contacts</p>
      </div>
      <Button>
        <Plus class="h-4 w-4 mr-2" />
        Add Contact
      </Button>
    </motion.div>

    <!-- Contacts Grid -->
    <motion.div 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }">
      <Card v-for="i in 6" :key="i">
        <CardContent class="p-6">
          <div class="flex items-center space-x-4">
            <Avatar class="h-12 w-12">
              <AvatarFallback>C{{ i }}</AvatarFallback>
            </Avatar>
            <div>
              <p class="font-medium">Contact {{ i }}</p>
              <p class="text-sm text-gray-500">contact{{ i }}@example.com</p>
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
  title: "Contacts - CRM",
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
