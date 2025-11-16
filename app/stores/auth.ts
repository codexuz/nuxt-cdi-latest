// stores/auth.ts
import { defineStore } from 'pinia';

interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  center_id?: string;
  first_name?: string;
  balance?: number;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
    isAuthenticated: false,
  }),

  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated && !!state.token,
  },

  actions: {
    setToken(token: string | null) {
      this.token = token;
      this.isAuthenticated = !!token;
      
      if (process.client) {
        if (token) {
          localStorage.setItem('access_token', token);
        } else {
          localStorage.removeItem('access_token');
        }
      }
    },

    setUser(user: User | null) {
      this.user = user;
      
      if (process.client) {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }
    },

    initializeAuth() {
      if (process.client) {
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');
        
        if (token) {
          this.token = token;
          this.isAuthenticated = true;
        }
        
        if (userStr) {
          try {
            this.user = JSON.parse(userStr);
          } catch (error) {
            console.error('Failed to parse user from localStorage:', error);
            localStorage.removeItem('user');
          }
        }
      }
    },

    clearAuth() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      
      if (process.client) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    },
  },
});
