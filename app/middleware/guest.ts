// middleware/guest.ts
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip on server-side as localStorage is not available
  if (process.server) {
    return;
  }

  // Check for authentication token from store
  const authStore = useAuthStore();

  // Initialize auth from localStorage if not already done
  if (!authStore.token) {
    authStore.initializeAuth();
  }

  // If token exists, redirect based on user role
  if (authStore.token && authStore.user) {
    const { getRoleBasedRedirect } = useAuth();
    const role = authStore.user.roles?.[0]?.role_name;
    return navigateTo(getRoleBasedRedirect(role));
  }
});
