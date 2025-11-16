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
  
  // If token exists, redirect to dashboard (user is already authenticated)
  if (authStore.token) {
    return navigateTo('/dashboard');
  }
});