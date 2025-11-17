<template>
  <!-- Mobile Restriction Screen -->
  <div
    v-if="isMobileDevice"
    class="fixed inset-0 bg-background flex items-center justify-center p-6 z-50"
  >
    <div class="text-center max-w-md space-y-6">
      <div class="flex justify-center">
        <div class="rounded-full bg-muted p-6">
          <Monitor class="h-16 w-16 text-muted-foreground" />
        </div>
      </div>
      <div class="space-y-2">
        <h1 class="text-2xl font-bold tracking-tight">Desktop Required</h1>
        <p class="text-muted-foreground">
          To use this app, please access it from your laptop or computer for the
          best experience.
        </p>
      </div>
      <div class="pt-4">
        <div
          class="inline-flex items-center gap-2 text-sm text-muted-foreground"
        >
          <GraduationCap class="h-5 w-5" />
          <span class="font-semibold">Mockmee</span>
        </div>
      </div>
    </div>
  </div>

  <SidebarProvider v-else @update:open="handleSidebarChange">
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              >
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
              <SidebarMenuButton
                as-child
                :is-active="$route.path === '/dashboard'"
              >
                <NuxtLink to="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <!-- CRM Section -->
        <SidebarGroup>
          <SidebarGroupLabel>CUSTOMER MANAGEMENT</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible v-model:open="isCRMOpen" class="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton>
                      <span>CRM</span>
                      <ChevronRight
                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          as-child
                          :is-active="$route.path === '/dashboard/leads'"
                        >
                          <NuxtLink to="/dashboard/leads">
                            <UserPlus />
                            <span>Leads</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          as-child
                          :is-active="
                            $route.path === '/dashboard/trial-lessons'
                          "
                        >
                          <NuxtLink to="/dashboard/trial-lessons">
                            <ClipboardCheck />
                            <span>Lead Trial Lessons</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <!-- LMS Section -->
        <SidebarGroup>
          <SidebarGroupLabel>LEARNING MANAGEMENT SYSTEM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible v-model:open="isLMSOpen" class="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton>
                      <span>LMS</span>
                      <ChevronRight
                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          as-child
                          :is-active="$route.path === '/dashboard/students'"
                        >
                          <NuxtLink to="/dashboard/students">
                            <Users />
                            <span>Students</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          as-child
                          :is-active="$route.path === '/dashboard/groups'"
                        >
                          <NuxtLink to="/dashboard/groups">
                            <UsersRound />
                            <span>Groups</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          as-child
                          :is-active="$route.path === '/dashboard/attendance'"
                        >
                          <NuxtLink to="/dashboard/attendance">
                            <CalendarCheck />
                            <span>Attendance</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <!-- Tests & Exams Section -->
        <SidebarGroup>
          <SidebarGroupLabel>TESTS & EXAMS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible v-model:open="isTestsOpen" class="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton>
                      <span>Mock and Practice Tests</span>
                      <ChevronRight
                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          as-child
                          :is-active="$route.path === '/dashboard/test-builder'"
                        >
                          <NuxtLink to="/dashboard/test-builder">
                            <FileEdit />
                            <span>Test Builder</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          as-child
                          :is-active="
                            $route.path.includes('/dashboard/reading/tests')
                          "
                        >
                          <NuxtLink to="/dashboard/reading/tests">
                            <BookOpen />
                            <span>Reading</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          as-child
                          :is-active="
                            $route.path.includes('/dashboard/listening/tests')
                          "
                        >
                          <NuxtLink to="/dashboard/listening/tests">
                            <Headphones />
                            <span>Listening</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          as-child
                          :is-active="
                            $route.path.includes('/dashboard/writing/tests')
                          "
                        >
                          <NuxtLink to="/dashboard/writing/tests">
                            <PenTool />
                            <span>Writing</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <!-- Finance Section -->
        <SidebarGroup>
          <SidebarGroupLabel>FINANCE MANAGEMENT</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                v-model:open="isFinanceOpen"
                class="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton>
                      <span>Finance</span>
                      <ChevronRight
                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          as-child
                          :is-active="$route.path === '/dashboard/payments'"
                        >
                          <NuxtLink to="/dashboard/payments">
                            <CreditCard />
                            <span>Payments</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          as-child
                          :is-active="$route.path === '/dashboard/expenses'"
                        >
                          <NuxtLink to="/dashboard/expenses">
                            <Receipt />
                            <span>Expenses</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          as-child
                          :is-active="$route.path === '/dashboard/salaries'"
                        >
                          <NuxtLink to="/dashboard/salaries">
                            <Wallet />
                            <span>Salaries</span>
                          </NuxtLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <!-- Permissions & Roles Section -->
        <SidebarGroup>
          <SidebarGroupLabel>ROLES & PERMISSIONS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  as-child
                  :is-active="$route.path === '/dashboard/permissions'"
                >
                  <NuxtLink to="/dashboard/permissions">
                    <Shield />
                    <span>Add New Staff</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <!-- Analytics Section -->
        <SidebarGroup>
          <SidebarGroupLabel>ANALYTICS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  as-child
                  :is-active="$route.path === '/dashboard/analytics'"
                >
                  <NuxtLink to="/dashboard/analytics">
                    <TrendingUp />
                    <span>Performance</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  as-child
                  :is-active="$route.path === '/dashboard/reports'"
                >
                  <NuxtLink to="/dashboard/reports">
                    <PieChart />
                    <span>Reports</span>
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
            <SidebarMenuButton
              as-child
              :is-active="$route.path === '/dashboard/settings'"
            >
              <NuxtLink to="/dashboard/settings">
                <Settings />
                <span>Settings</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              as-child
              :is-active="$route.path === '/dashboard/support'"
            >
              <a
                href="https://t.me/javlon_developer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HelpCircle />
                <span>Support</span>
              </a>
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
                    <AvatarImage
                      v-if="user?.avatar"
                      :src="user.avatar"
                      :alt="user?.name"
                    />
                    <AvatarFallback class="rounded-lg">
                      {{ user?.name?.charAt(0) || "U" }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{
                      user?.name || "User"
                    }}</span>
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
                  <div
                    class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                  >
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage
                        v-if="user?.avatar"
                        :src="user.avatar"
                        :alt="user?.name"
                      />
                      <AvatarFallback class="rounded-lg">
                        {{ user?.name?.charAt(0) || "U" }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{
                        user?.name || "User"
                      }}</span>
                      <span class="truncate text-xs">{{ user?.email }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  @click="navigateTo('/dashboard/subscriptions')"
                >
                  <Sparkles />
                  Upgrade to Pro
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
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />

          <!-- Breadcrumbs -->
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator
                v-if="breadcrumbs.length > 1"
                class="hidden md:block"
              />
              <BreadcrumbItem
                v-for="(crumb, index) in breadcrumbs.slice(1)"
                :key="index"
              >
                <BreadcrumbLink
                  v-if="index < breadcrumbs.length - 2"
                  :href="crumb.href"
                  class="hidden md:block"
                >
                  {{ crumb.label }}
                </BreadcrumbLink>
                <BreadcrumbPage v-else>{{ crumb.label }}</BreadcrumbPage>
                <BreadcrumbSeparator
                  v-if="index < breadcrumbs.length - 2"
                  class="hidden md:block"
                />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div class="ml-auto flex items-center gap-2 px-4">
          <!-- Dark Mode Toggle -->
          <ClientOnly>
            <Button
              variant="outline"
              size="icon"
              class="h-8 w-8"
              @click="toggleTheme"
            >
              <Sun v-if="colorMode.preference === 'light'" class="h-4 w-4" />
              <Moon v-else class="h-4 w-4" />
              <span class="sr-only">Toggle theme</span>
            </Button>
          </ClientOnly>

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

<style scoped>
[data-active="true"] {
  background-color: rgb(24 24 27) !important; /* zinc-900 */
  color: white !important;
  font-weight: 500;
}

.dark [data-active="true"] {
  background-color: rgb(24 24 27) !important; /* zinc-900 */
  color: white !important;
}


</style>

<script setup>
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UsersRound,
  FileEdit,
  BookOpen,
  Headphones,
  PenTool,
  TrendingUp,
  PieChart,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Bell,
  ChevronsUpDown,
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  Monitor,
  UserPlus,
  ClipboardCheck,
  CalendarCheck,
  CreditCard,
  Receipt,
  Wallet,
  Shield,
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const { user, logout } = useAuth();
const route = useRoute();
const colorMode = useColorMode();

// Mobile device detection
const isMobileDevice = ref(false);

// Detect mobile device
onMounted(() => {
  const checkMobile = () => {
    isMobileDevice.value = window.innerWidth < 768; // Tailwind's md breakpoint
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);

  onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
  });
});

// Collapsible menu state
const isTestsOpen = ref(true);
const isCRMOpen = ref(true);
const isLMSOpen = ref(true);
const isFinanceOpen = ref(true);
const sidebarOpen = ref(true);

// Handle sidebar state change
const handleSidebarChange = (open) => {
  sidebarOpen.value = open;
};

// Close sidebar on mobile when route changes
watch(
  () => route.path,
  () => {
    // On mobile, the sidebar auto-closes on navigation
    // This is handled by the SidebarProvider's default behavior
  }
);

// Toggle theme function
const toggleTheme = () => {
  colorMode.preference = colorMode.preference === "light" ? "dark" : "light";
};

// Breadcrumbs
const breadcrumbs = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  const crumbs = [{ label: "Dashboard", href: "/dashboard" }];

  let path = "";
  for (let i = 1; i < segments.length; i++) {
    path += "/" + segments[i];
    crumbs.push({
      label:
        segments[i].charAt(0).toUpperCase() +
        segments[i].slice(1).replace(/-/g, " "),
      href: path,
    });
  }

  return crumbs;
});

// Handle logout
const handleLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.error("Logout error:", error);
  }
};
</script>
