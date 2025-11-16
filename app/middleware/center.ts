// middleware/center.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip this middleware if already on the create center page
  if (to.path === '/auth/companies/create') {
    return;
  }

  // Check for authentication token
  const tokenCookie = useCookie<string | null>('access_token', { default: () => null });
  
  if (!tokenCookie.value) {
    return navigateTo('/login');
  }

  // Get user state
  const userState = useState<any>('auth.user');
  
  // If user data is not loaded yet, try to fetch it
  if (!userState.value) {
    try {
      const { getProfile } = useAuth();
      await getProfile();
    } catch (error) {
      console.error('Failed to get profile:', error);
      return navigateTo('/login');
    }
  }

  // Check if user has center_id
  if (!userState.value?.center_id) {
    return navigateTo('/auth/companies/create');
  }
});
