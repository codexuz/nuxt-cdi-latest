<template>
  <motion.div
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.3 }"
  >
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Payments Management</h1>
        <p class="text-muted-foreground">Track and manage student payments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>All student transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground text-center py-8">
            Payment management features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";

definePageMeta({
  layout: "admin",
  middleware: ["auth", "role"],
});
</script>
