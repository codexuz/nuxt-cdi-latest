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

    <!-- Stats Overview -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, delay: 0.1 }"
      class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6"
    >
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">My Students</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.totalStudents }}</div>
          <p class="text-xs text-muted-foreground">
            Across {{ stats.totalGroups }} groups
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Classes Today</CardTitle>
          <CalendarCheck class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.classesToday }}</div>
          <p class="text-xs text-muted-foreground">
            {{ stats.completedToday }} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Attendance Rate</CardTitle>
          <TrendingUp class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.attendanceRate }}%</div>
          <p class="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Tests Created</CardTitle>
          <FileText class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.testsCreated }}</div>
          <p class="text-xs text-muted-foreground">
            +{{ stats.newTestsThisWeek }} this week
          </p>
        </CardContent>
      </Card>
    </motion.div>

    <!-- Today's Schedule and Recent Activity -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, delay: 0.2 }"
      class="grid gap-4 md:grid-cols-2 mb-6"
    >
      <!-- Today's Classes -->
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Your classes for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="classItem in todayClasses"
              :key="classItem.id"
              class="flex items-center justify-between p-3 border rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
                >
                  <Clock class="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p class="text-sm font-medium">{{ classItem.groupName }}</p>
                  <p class="text-xs text-muted-foreground">
                    {{ classItem.time }}
                  </p>
                </div>
              </div>
              <Badge
                :variant="
                  classItem.status === 'completed' ? 'default' : 'secondary'
                "
              >
                {{ classItem.status }}
              </Badge>
            </div>
            <Button variant="outline" class="w-full" as-child>
              <NuxtLink to="/teacher/attendance">Mark Attendance</NuxtLink>
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Students -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Students</CardTitle>
          <CardDescription
            >Students you've worked with recently</CardDescription
          >
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="student in recentStudents"
              :key="student.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{{ student.name.charAt(0) }}</AvatarFallback>
                </Avatar>
                <div>
                  <p class="text-sm font-medium">{{ student.name }}</p>
                  <p class="text-xs text-muted-foreground">
                    {{ student.group }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs text-muted-foreground">Last seen</p>
                <p class="text-xs font-medium">{{ student.lastSeen }}</p>
              </div>
            </div>
            <Button variant="outline" class="w-full" as-child>
              <NuxtLink to="/teacher/students">View All Students</NuxtLink>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <!-- Quick Actions -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, delay: 0.3 }"
    >
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-4">
            <Button variant="outline" class="h-20 flex-col gap-2" as-child>
              <NuxtLink to="/teacher/attendance">
                <CalendarCheck class="h-5 w-5" />
                <span>Take Attendance</span>
              </NuxtLink>
            </Button>
            <Button variant="outline" class="h-20 flex-col gap-2" as-child>
              <NuxtLink to="/teacher/test-builder/reading">
                <BookOpen class="h-5 w-5" />
                <span>Create Test</span>
              </NuxtLink>
            </Button>
            <Button variant="outline" class="h-20 flex-col gap-2" as-child>
              <NuxtLink to="/teacher/groups">
                <UsersRound class="h-5 w-5" />
                <span>Manage Groups</span>
              </NuxtLink>
            </Button>
            <Button variant="outline" class="h-20 flex-col gap-2" as-child>
              <NuxtLink to="/teacher/students">
                <Users class="h-5 w-5" />
                <span>View Students</span>
              </NuxtLink>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
