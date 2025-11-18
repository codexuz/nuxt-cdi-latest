<template>
  <motion.div
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.3 }"
  >
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p class="text-muted-foreground">
          Welcome back! Here's an overview of your center.
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
          <CardTitle class="text-sm font-medium">Total Leads</CardTitle>
          <UserPlus class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.totalLeads }}</div>
          <p class="text-xs text-muted-foreground">
            +{{ stats.newLeadsThisMonth }} this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Active Students</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.activeStudents }}</div>
          <p class="text-xs text-muted-foreground">
            {{ stats.totalGroups }} active groups
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            ${{ stats.monthlyRevenue.toLocaleString() }}
          </div>
          <p class="text-xs text-muted-foreground">
            +{{ stats.revenueGrowth }}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Conversion Rate</CardTitle>
          <TrendingUp class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.conversionRate }}%</div>
          <p class="text-xs text-muted-foreground">Leads to students</p>
        </CardContent>
      </Card>
    </motion.div>

    <!-- Recent Activity and Quick Actions -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, delay: 0.2 }"
      class="grid gap-4 md:grid-cols-2 mb-6"
    >
      <!-- Recent Leads -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Latest potential students</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="lead in recentLeads"
              :key="lead.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{{ lead.name.charAt(0) }}</AvatarFallback>
                </Avatar>
                <div>
                  <p class="text-sm font-medium">{{ lead.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ lead.phone }}</p>
                </div>
              </div>
              <Badge :variant="lead.status === 'new' ? 'default' : 'secondary'">
                {{ lead.status }}
              </Badge>
            </div>
            <Button variant="outline" class="w-full" as-child>
              <NuxtLink to="/admin/leads">View All Leads</NuxtLink>
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Payments -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="payment in recentPayments"
              :key="payment.id"
              class="flex items-center justify-between"
            >
              <div>
                <p class="text-sm font-medium">{{ payment.studentName }}</p>
                <p class="text-xs text-muted-foreground">{{ payment.date }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">${{ payment.amount }}</p>
                <Badge
                  :variant="
                    payment.status === 'completed' ? 'default' : 'secondary'
                  "
                  class="text-xs"
                >
                  {{ payment.status }}
                </Badge>
              </div>
            </div>
            <Button variant="outline" class="w-full" as-child>
              <NuxtLink to="/admin/payments">View All Payments</NuxtLink>
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
          <div class="grid gap-4 md:grid-cols-3">
            <Button variant="outline" class="h-20 flex-col gap-2" as-child>
              <NuxtLink to="/admin/leads">
                <UserPlus class="h-5 w-5" />
                <span>Add Lead</span>
              </NuxtLink>
            </Button>
            <Button variant="outline" class="h-20 flex-col gap-2" as-child>
              <NuxtLink to="/admin/students">
                <Users class="h-5 w-5" />
                <span>Manage Students</span>
              </NuxtLink>
            </Button>
            <Button variant="outline" class="h-20 flex-col gap-2" as-child>
              <NuxtLink to="/admin/payments">
                <CreditCard class="h-5 w-5" />
                <span>Process Payment</span>
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
  UserPlus,
  DollarSign,
  TrendingUp,
  CreditCard,
} from "lucide-vue-next";
import { motion } from "motion-v";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

// Mock data - replace with actual API calls
const stats = ref({
  totalLeads: 48,
  newLeadsThisMonth: 12,
  activeStudents: 156,
  totalGroups: 8,
  monthlyRevenue: 45600,
  revenueGrowth: 12,
  conversionRate: 35,
});

const recentLeads = ref([
  { id: 1, name: "John Doe", phone: "+998901234567", status: "new" },
  { id: 2, name: "Jane Smith", phone: "+998901234568", status: "contacted" },
  { id: 3, name: "Bob Johnson", phone: "+998901234569", status: "new" },
  { id: 4, name: "Alice Williams", phone: "+998901234570", status: "trial" },
]);

const recentPayments = ref([
  {
    id: 1,
    studentName: "John Doe",
    amount: 500,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: 2,
    studentName: "Jane Smith",
    amount: 450,
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: 3,
    studentName: "Bob Johnson",
    amount: 500,
    date: "2024-01-13",
    status: "pending",
  },
  {
    id: 4,
    studentName: "Alice Williams",
    amount: 450,
    date: "2024-01-12",
    status: "completed",
  },
]);

// Load data on mount
onMounted(() => {
  // TODO: Fetch actual data from API
});
</script>
