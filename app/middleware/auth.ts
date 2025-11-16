// middleware/auth.ts
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
  
  // If no token exists after initialization, redirect to login
  if (!authStore.token) {
    return navigateTo('/login');
  }
});