<template>
  <motion.div
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.3 }"
  >
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Listening Tests</h1>
          <p class="text-muted-foreground">
            View and manage your listening tests
          </p>
        </div>
        <Button as-child>
          <NuxtLink to="/teacher/test-builder/listening">
            Create New Test
          </NuxtLink>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Listening Tests</CardTitle>
          <CardDescription>All listening tests you've created</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground text-center py-8">
            No tests created yet. Create your first test to get started.
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
