export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth();

  // If not authenticated, redirect to login
  if (!user.value) {
    return navigateTo("/login");
  }

  const userRole = user.value.role || "owner"; // Default to owner for now
  const path = to.path;

  // Define role-based access rules
  const roleRoutes = {
    owner: ["/dashboard", "/admin", "/teacher"],
    admin: ["/admin"],
    teacher: ["/teacher"],
  };

  // Check if user has access to the requested route
  const hasAccess = roleRoutes[userRole]?.some((route) =>
    path.startsWith(route)
  );

  if (!hasAccess) {
    // Redirect to appropriate dashboard based on role
    const dashboardMap = {
      owner: "/dashboard",
      admin: "/admin/dashboard",
      teacher: "/teacher/dashboard",
    };

    return navigateTo(dashboardMap[userRole] || "/dashboard");
  }
});
