<template>
  <motion.div
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.3 }"
  >
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p class="text-muted-foreground">
          Welcome back! Manage your classes and students.
        </p>
      </div>
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";

definePageMeta({
  layout: "teacher",
  middleware: ["auth"],
});


useHead({
  title: "Teacher Dashboard - Mockmee LMS",
});
</script>
