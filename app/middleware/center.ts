// middleware/center.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip this middleware if already on the create center page
  if (to.path === "/auth/companies/create") {
    return;
  }

  // Check for authentication token
  const tokenCookie = useCookie<string | null>("access_token", {
    default: () => null,
  });

  if (!tokenCookie.value) {
    return navigateTo("/login");
  }

  // Get user state
  const userState = useState<any>("auth.user");

  // If user data is not loaded yet, try to fetch it
  if (!userState.value) {
    try {
      const { getProfile } = useAuth();
      await getProfile();
    } catch (error) {
      console.error("Failed to get profile:", error);
      return navigateTo("/login");
    }
  }

  // Check if user has any centers
  try {
    const { getActiveCenter } = useCenters();
    const center = await getActiveCenter();

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
});
