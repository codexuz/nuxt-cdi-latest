// plugins/auth-init.client.ts
export default defineNuxtPlugin(() => {
  // Initialize authentication state on client side only
  initializeAuth()
})