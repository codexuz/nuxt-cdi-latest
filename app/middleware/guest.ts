// middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Check for authentication token
  const tokenCookie = useCookie<string | null>('access_token', { default: () => null })
  
  // If token exists, redirect to home (user is already authenticated)
  if (tokenCookie.value) {
    return navigateTo('/')
  }
})