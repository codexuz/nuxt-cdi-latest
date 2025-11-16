// plugins/auth-init.client.ts
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
  // Initialize authentication state from localStorage on client side
  const authStore = useAuthStore();
  authStore.initializeAuth();
});