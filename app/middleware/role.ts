export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth();

  // If not authenticated, redirect to login
  if (!user.value) {
    return navigateTo("/login");
  }

  // Get user role from roles array or fallback to role property
  const userRole = user.value.roles?.[0]?.role_name || user.value.role || "owner";
  const path = to.path;

  // Define role-based access rules
  const roleRoutes: Record<string, string[]> = {
    owner: ["/dashboard", "/admin", "/teacher"],
    admin: ["/admin"],
    teacher: ["/teacher"],
    accountant: ["/dashboard/finance"],
    sales: ["/dashboard/crm"],
    support: ["/dashboard/students"],
  };

  // Get the default dashboard for this role
  const dashboardMap: Record<string, string> = {
    owner: "/dashboard",
    admin: "/admin/dashboard",
    teacher: "/teacher/dashboard",
    accountant: "/dashboard/finance",
    sales: "/dashboard/crm",
    support: "/dashboard/students",
  };

  const defaultDashboard = dashboardMap[userRole] || "/dashboard";

  // Don't redirect if already going to the target dashboard
  if (path === defaultDashboard) {
    return;
  }

  // Check if user has access to the requested route
  const hasAccess = roleRoutes[userRole]?.some((route: string) =>
    path.startsWith(route)
  );

  if (!hasAccess) {
    // Redirect to appropriate dashboard based on role
    return navigateTo(defaultDashboard);
  }
});
