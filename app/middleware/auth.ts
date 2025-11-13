// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Check for authentication token
  const tokenCookie = useCookie<string | null>('access_token', { default: () => null })
  
  // If no token exists, redirect to login
  if (!tokenCookie.value) {
    return navigateTo('/login')
  }
})