<template>
  <div class="space-y-6">
    <!-- Dashboard Header -->
    <motion.div
      :initial="{ opacity: 0, y: -20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.3 }"
      class="flex items-center justify-between"
    >
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
          @click="navigateTo('/dashboard/test-builder')"
          class="flex items-center space-x-2"
        >
          <Plus class="h-4 w-4" />
          <span>Create Test</span>
        </Button>
        <Button
          @click="navigateTo('/dashboard/students')"
          variant="outline"
          class="flex items-center space-x-2"
        >
          <UserPlus class="h-4 w-4" />
          <span>Add Student</span>
        </Button>
      </div>
    </motion.div>

    <!-- Stats Cards -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, delay: 0.1 }"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <!-- Total Students -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Students
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats.totalStudents }}
              </p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Users class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <TrendingUp class="h-4 w-4 text-green-500 mr-1" />
            <span class="text-sm text-green-600 dark:text-green-400"
              >+12% from last month</span
            >
          </div>
        </CardContent>
      </Card>

      <!-- Active Tests -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Tests
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats.activeTests }}
              </p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <FileText class="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <TrendingUp class="h-4 w-4 text-green-500 mr-1" />
            <span class="text-sm text-green-600 dark:text-green-400"
              >+5% from last month</span
            >
          </div>
        </CardContent>
      </Card>

      <!-- Test Completions -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Test Completions
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats.testCompletions }}
              </p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <CheckCircle
                class="h-6 w-6 text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <TrendingUp class="h-4 w-4 text-green-500 mr-1" />
            <span class="text-sm text-green-600 dark:text-green-400"
              >+8% from last month</span
            >
          </div>
        </CardContent>
      </Card>

      <!-- Average Score -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Score
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats.averageScore }}%
              </p>
            </div>
            <div class="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <BarChart3 class="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <TrendingUp class="h-4 w-4 text-green-500 mr-1" />
            <span class="text-sm text-green-600 dark:text-green-400"
              >+3% from last month</span
            >
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, delay: 0.2 }"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <!-- Recent Activity -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            Recent Activity
            <Button variant="outline" size="sm">View All</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-center space-x-4"
            >
              <div
                :class="[
                  'p-2 rounded-full',
                  activity.type === 'test_completed'
                    ? 'bg-green-100 dark:bg-green-900'
                    : activity.type === 'student_added'
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : activity.type === 'test_created'
                    ? 'bg-purple-100 dark:bg-purple-900'
                    : 'bg-gray-100 dark:bg-gray-700',
                ]"
              >
                <component
                  :is="activity.icon"
                  :class="[
                    'h-4 w-4',
                    activity.type === 'test_completed'
                      ? 'text-green-600 dark:text-green-400'
                      : activity.type === 'student_added'
                      ? 'text-blue-600 dark:text-blue-400'
                      : activity.type === 'test_created'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-400',
                  ]"
                />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ activity.title }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ activity.description }}
                </p>
              </div>
              <span class="text-xs text-gray-400 dark:text-gray-500">{{
                activity.time
              }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Actions -->
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <Button
              @click="navigateTo('/dashboard/test-builder')"
              variant="outline"
              class="w-full justify-start"
            >
              <FileEdit class="h-4 w-4 mr-2" />
              Create New Test
            </Button>
            <Button
              @click="navigateTo('/dashboard/students/add')"
              variant="outline"
              class="w-full justify-start"
            >
              <UserPlus class="h-4 w-4 mr-2" />
              Add Student
            </Button>
            <Button
              @click="navigateTo('/dashboard/students/groups')"
              variant="outline"
              class="w-full justify-start"
            >
              <Users class="h-4 w-4 mr-2" />
              Create Group
            </Button>
            <Button
              @click="navigateTo('/dashboard/schedule')"
              variant="outline"
              class="w-full justify-start"
            >
              <Calendar class="h-4 w-4 mr-2" />
              Schedule Class
            </Button>
            <Button
              @click="navigateTo('/dashboard/analytics')"
              variant="outline"
              class="w-full justify-start"
            >
              <BarChart3 class="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <!-- Recent Tests and Students -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, delay: 0.3 }"
      class="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <!-- Recent Tests -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            Recent Tests
            <Button
              variant="outline"
              size="sm"
              @click="navigateTo('/dashboard/tests')"
              >View All</Button
            >
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="test in recentTests"
              :key="test.id"
              class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ test.name }}
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ test.type }} • {{ test.duration }} minutes
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ test.completions }} completions
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Avg: {{ test.averageScore }}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Students -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            Recent Students
            <Button
              variant="outline"
              size="sm"
              @click="navigateTo('/dashboard/students')"
              >View All</Button
            >
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="student in recentStudents"
              :key="student.id"
              class="flex items-center space-x-4"
            >
              <Avatar>
                <AvatarImage :src="student.avatar" :alt="student.name" />
                <AvatarFallback>{{ student.name.charAt(0) }}</AvatarFallback>
              </Avatar>
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ student.name }}
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ student.email }}
                </p>
              </div>
              <div class="text-right">
                <Badge
                  :variant="
                    student.status === 'active' ? 'default' : 'secondary'
                  "
                >
                  {{ student.status }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
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
import { motion } from "motion-v";

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
  middleware: ["auth", "center"],
});
</script>
