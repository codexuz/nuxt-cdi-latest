<template>
  <motion.div
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.3 }"
  >
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Create Listening Test</h1>
        <p class="text-muted-foreground">
          Build and customize IELTS listening tests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Builder</CardTitle>
          <CardDescription>Create a new listening test</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground text-center py-8">
            Test builder features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";

definePageMeta({
  layout: "teacher",
  middleware: ["auth", "role"],
});
</script>
