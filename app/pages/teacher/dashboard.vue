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
import {
  Users,
  CalendarCheck,
  TrendingUp,
  FileText,
  Clock,
  BookOpen,
  UsersRound,
} from "lucide-vue-next";
import { motion } from "motion-v";

definePageMeta({
  layout: "teacher",
  middleware: ["auth"],
});

// Mock data - replace with actual API calls
const stats = ref({
  totalStudents: 45,
  totalGroups: 3,
  classesToday: 4,
  completedToday: 2,
  attendanceRate: 87,
  testsCreated: 23,
  newTestsThisWeek: 5,
});

const todayClasses = ref([
  {
    id: 1,
    groupName: "IELTS Intensive A1",
    time: "09:00 - 10:30",
    status: "completed",
  },
  {
    id: 2,
    groupName: "IELTS Advanced B2",
    time: "11:00 - 12:30",
    status: "completed",
  },
  {
    id: 3,
    groupName: "IELTS Intermediate B1",
    time: "14:00 - 15:30",
    status: "upcoming",
  },
  {
    id: 4,
    groupName: "IELTS Evening A2",
    time: "18:00 - 19:30",
    status: "upcoming",
  },
]);

const recentStudents = ref([
  { id: 1, name: "John Doe", group: "IELTS Intensive A1", lastSeen: "Today" },
  { id: 2, name: "Jane Smith", group: "IELTS Advanced B2", lastSeen: "Today" },
  {
    id: 3,
    name: "Bob Johnson",
    group: "IELTS Intermediate B1",
    lastSeen: "Yesterday",
  },
  {
    id: 4,
    name: "Alice Williams",
    group: "IELTS Evening A2",
    lastSeen: "2 days ago",
  },
]);

// Load data on mount
onMounted(() => {
  // TODO: Fetch actual data from API
});
</script>
