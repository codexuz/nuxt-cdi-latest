import { useAuth } from "~/composables/useAuth";
import { useAuthStore } from "~/stores/auth";

// middleware/center.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip on server-side as localStorage is not available
  if (process.server) {
    return;
  }
  
  // Skip this middleware if already on the create center page
  if (to.path === "/auth/companies/create") {
    return;
  }

  // Check for authentication token from store
  const authStore = useAuthStore();
  
  // Initialize auth from localStorage if not already done
  if (!authStore.token) {
    authStore.initializeAuth();
  }
  
  if (!authStore.token) {
    return navigateTo("/login");
  }

  // If user data is not loaded yet, try to fetch it
  if (!authStore.user) {
    try {
      const { getProfile } = useAuth();
      await getProfile();
    } catch (error) {
      console.error("Failed to get profile:", error);
      return navigateTo("/login");
    }
  }

  // Check if user role is owner
  const userRole = authStore.user?.roles?.[0]?.role_name || authStore.user?.role;
  
  if (userRole === "owner") {
    // Check if user has any centers
    try {
      const config = useRuntimeConfig();
      const API_BASE_URL = config.public.baseURL as string;

      const centers = await $fetch<any[]>(`${API_BASE_URL}/centers/my-centers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });

      // Find active center or use first one
      const center = centers.find((c) => c.is_active) || centers[0] || null;

      // If no center found, redirect to create page
      if (!center) {
        return navigateTo("/auth/companies/create");
      }

      // Store center info in state for use in the app
      const activeCenterState = useState("user.activeCenter");
      activeCenterState.value = center;
    } catch (error) {
      console.error("Failed to check centers:", error);
      // If API fails, redirect to create page
      return navigateTo("/auth/companies/create");
    }
  }
});
