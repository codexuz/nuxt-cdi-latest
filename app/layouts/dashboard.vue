<template>
  <SidebarProvider>
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Mockmee</span>
                <span class="truncate text-xs">Learning Management System</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <!-- Dashboard -->
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as-child :is-active="$route.path === '/dashboard'">
                <NuxtLink to="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <!-- Students Section -->
        <SidebarGroup>
          <SidebarGroupLabel>Students</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/students'">
                  <NuxtLink to="/dashboard/students">
                    <Users />
                    <span>All Students</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/students/groups'">
                  <NuxtLink to="/dashboard/students/groups">
                    <UsersRound />
                    <span>Groups</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/students/add'">
                  <NuxtLink to="/dashboard/students/add">
                    <UserPlus />
                    <span>Add Student</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <!-- Tests & Exams Section -->
        <SidebarGroup>
          <SidebarGroupLabel>Tests & Exams</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/test-builder'">
                  <NuxtLink to="/dashboard/test-builder">
                    <FileEdit />
                    <span>Test Builder</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/tests'">
                  <NuxtLink to="/dashboard/tests">
                    <FileText />
                    <span>All Tests</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/results'">
                  <NuxtLink to="/dashboard/results">
                    <BarChart3 />
                    <span>Test Results</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <!-- Resources Section -->
        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/library'">
                  <NuxtLink to="/dashboard/library">
                    <Library />
                    <span>Question Bank</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/materials'">
                  <NuxtLink to="/dashboard/materials">
                    <FileBox />
                    <span>Materials</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <!-- Analytics Section -->
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/analytics'">
                  <NuxtLink to="/dashboard/analytics">
                    <TrendingUp />
                    <span>Performance</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/reports'">
                  <NuxtLink to="/dashboard/reports">
                    <PieChart />
                    <span>Reports</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <!-- Management Section -->
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/teachers'">
                  <NuxtLink to="/dashboard/teachers">
                    <UserCheck />
                    <span>Teachers</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/schedule'">
                  <NuxtLink to="/dashboard/schedule">
                    <Calendar />
                    <span>Schedule</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/billing'">
                  <NuxtLink to="/dashboard/billing">
                    <CreditCard />
                    <span>Billing</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton as-child :is-active="$route.path === '/dashboard/settings'">
              <NuxtLink to="/dashboard/settings">
                <Settings />
                <span>Settings</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage v-if="user?.avatar" :src="user.avatar" :alt="user?.name" />
                    <AvatarFallback class="rounded-lg">
                      {{ user?.name?.charAt(0) || 'U' }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ user?.name || 'User' }}</span>
                    <span class="truncate text-xs">{{ user?.email }}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="right"
                align="end"
                :side-offset="4"
              >
                <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage v-if="user?.avatar" :src="user.avatar" :alt="user?.name" />
                      <AvatarFallback class="rounded-lg">
                        {{ user?.name?.charAt(0) || 'U' }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{ user?.name || 'User' }}</span>
                      <span class="truncate text-xs">{{ user?.email }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="navigateTo('/subscriptions')">
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="navigateTo('/profile')">
                  <User />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem @click="navigateTo('/dashboard/billing')">
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem @click="navigateTo('/dashboard/settings')">
                  <Bell />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleLogout">
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    
    <SidebarInset>
      <!-- Top Bar -->
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          
          <!-- Breadcrumbs -->
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator v-if="breadcrumbs.length > 1" class="hidden md:block" />
              <BreadcrumbItem v-for="(crumb, index) in breadcrumbs.slice(1)" :key="index">
                <BreadcrumbLink v-if="index < breadcrumbs.length - 2" :href="crumb.href" class="hidden md:block">
                  {{ crumb.label }}
                </BreadcrumbLink>
                <BreadcrumbPage v-else>{{ crumb.label }}</BreadcrumbPage>
                <BreadcrumbSeparator v-if="index < breadcrumbs.length - 2" class="hidden md:block" />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div class="ml-auto flex items-center gap-2 px-4">
          <!-- Search -->
          <div class="relative hidden md:block">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              v-model="searchQuery"
            />
          </div>

          <!-- Notifications -->
          <Button variant="outline" size="icon" class="h-8 w-8">
            <Bell class="h-4 w-4" />
            <span class="sr-only">Notifications</span>
          </Button>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup>
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UsersRound,
  UserPlus,
  FileEdit,
  FileText,
  BarChart3,
  Library,
  FileBox,
  TrendingUp,
  PieChart,
  UserCheck,
  Calendar,
  CreditCard,
  Settings,
  User,
  LogOut,
  Search,
  Bell,
  ChevronsUpDown,
  Sparkles
} from "lucide-vue-next";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const { user, logout } = useAuth();
const route = useRoute();

// Search and notifications
const searchQuery = ref('');

// Breadcrumbs
const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean);
  const crumbs = [{ label: 'Dashboard', href: '/dashboard' }];
  
  let path = '';
  for (let i = 1; i < segments.length; i++) {
    path += '/' + segments[i];
    crumbs.push({
      label: segments[i].charAt(0).toUpperCase() + segments[i].slice(1).replace(/-/g, ' '),
      href: path
    });
  }
  
  return crumbs;
});

// Handle logout
const handleLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>