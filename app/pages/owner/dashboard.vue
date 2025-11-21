<template>
  <motion.div class="space-y-6" 
  :initial="{ opacity: 0, y: 20 }"
  :transition="{ duration: 0.6, ease: 'easeOut' }"
  :animate="{ opacity: 1, y: 0 }">
    <!-- Dashboard Header -->
    <motion.div 
      class="flex items-center justify-between"
      :initial="{ opacity: 0, y: -10 }"
      :transition="{ duration: 0.5, delay: 0.1 }"
      :animate="{ opacity: 1, y: 0 }">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening at your learning center.
        </p>
      </div>
      <div class="flex items-center space-x-4">
        <Button
          @click="navigateTo('/owner/test-builder')"
          class="flex items-center space-x-2"
        >
          <Plus class="h-4 w-4" />
          <span>Create Test</span>
        </Button>
        <Button
          @click="navigateTo('/owner/students')"
          variant="outline"
          class="flex items-center space-x-2"
        >
          <UserPlus class="h-4 w-4" />
          <span>Add Student</span>
        </Button>
      </div>
    </motion.div>

  </motion.div>
</template>

<script setup>
import {
  Plus,
  UserPlus,
  Users,
  FileText,
  CheckCircle,
  BarChart3,
  TrendingUp,
  FileEdit,
  Calendar,
} from "lucide-vue-next";
import { motion } from "motion-v"
useHead({
  title: "Dashboard - Mockmee LMS",
});

// Mock data - replace with actual API calls
const stats = ref({
  totalStudents: 156,
  activeTests: 24,
  testCompletions: 342,
  averageScore: 78,
});

const recentActivities = ref([
  {
    id: 1,
    type: "test_completed",
    icon: CheckCircle,
    title: "John Doe completed IELTS Reading Test",
    description: "Score: 7.5/9",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "student_added",
    icon: UserPlus,
    title: "New student registered",
    description: "Sarah Wilson joined the platform",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "test_created",
    icon: FileEdit,
    title: "New test created",
    description: "IELTS Speaking Practice Test #5",
    time: "3 hours ago",
  },
  {
    id: 4,
    type: "test_completed",
    icon: CheckCircle,
    title: "Group test session completed",
    description: "Advanced Group - Writing Task 1",
    time: "5 hours ago",
  },
]);

const recentTests = ref([
  {
    id: 1,
    name: "IELTS Academic Reading",
    type: "Reading",
    duration: 60,
    completions: 23,
    averageScore: 76,
  },
  {
    id: 2,
    name: "General Training Writing",
    type: "Writing",
    duration: 60,
    completions: 18,
    averageScore: 72,
  },
  {
    id: 3,
    name: "Listening Practice Test",
    type: "Listening",
    duration: 40,
    completions: 31,
    averageScore: 81,
  },
]);

const recentStudents = ref([
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: null,
    status: "active",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    avatar: null,
    status: "active",
  },
  {
    id: 3,
    name: "Carol Brown",
    email: "carol@example.com",
    avatar: null,
    status: "inactive",
  },
]);

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "center", "role"],
});
</script>
