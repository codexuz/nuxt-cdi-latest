// composables/useAuth.ts
import { createError } from "h3";
import { useAuthStore } from "~/stores/auth";

interface LoginResponse {
  access_token: string;
  user?: User;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "student" | "teacher" | "admin";
  center_id?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface Role {
  id: string;
  role_name: string;
  description: string;
}

interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  center_id?: string;
  first_name?: string;
  balance?: number;
  roles?: Role[];
}

// Initialize authentication state from localStorage
export const initializeAuth = () => {
  if (process.client) {
    const authStore = useAuthStore();
    authStore.initializeAuth();
  }
};

export async function registerUser(registerData: RegisterData) {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.baseURL as string;
  const { data, error } = await useFetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    body: registerData,
  });

  if (error.value) {
    throw createError({
      statusCode: error.value.statusCode || 400,
      statusMessage: error.value.message || "Registration failed",
    });
  }

  // Registration now requires OTP verification
  // No auto-login, user must verify OTP first
  return data.value;
}

export async function verifyOtp(otpData: { email: string; otp: string }) {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.baseURL as string;
  const authStore = useAuthStore();

  const { data, error } = await useFetch<LoginResponse>(
    `${API_BASE_URL}/auth/verify-otp`,
    {
      method: "POST",
      body: otpData,
    }
  );

  if (error.value) {
    throw createError({
      statusCode: error.value.statusCode || 400,
      statusMessage: error.value.message || "OTP verification failed",
    });
  }

  // Auto-login after successful OTP verification
  const accessToken = data.value?.access_token;
  if (accessToken) {
    authStore.setToken(accessToken);

    // Set user data if available
    if (data.value?.user) {
      authStore.setUser(data.value.user);
    }
  }

  return data.value;
}

export async function resendOtp(email: string) {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.baseURL as string;
  const { data, error } = await useFetch(`${API_BASE_URL}/auth/resend-otp`, {
    method: "POST",
    body: { email },
  });

  if (error.value) {
    throw createError({
      statusCode: error.value.statusCode || 400,
      statusMessage: error.value.message || "Failed to resend OTP",
    });
  }

  return data.value;
}

export async function loginUser(loginData: LoginData) {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.baseURL as string;
  const authStore = useAuthStore();

  const { data, error } = await useFetch<LoginResponse>(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      body: loginData,
    }
  );

  if (error.value) {
    // Extract error details from response
    const errorData = error.value.data as any;
    throw createError({
      statusCode: error.value.statusCode || 401,
      statusMessage:
        errorData?.message ||
        error.value.message ||
        "Invalid login credentials",
      data: errorData,
    });
  }

  const accessToken = data.value?.access_token;
  if (accessToken) {
    authStore.setToken(accessToken);

    // Set user data if available
    if (data.value?.user) {
      authStore.setUser(data.value.user);
    }
  }

  return data.value;
}

export async function logout() {
  const authStore = useAuthStore();
  const token = authStore.token;

  // Call backend logout endpoint if token exists
  if (token) {
    try {
      const config = useRuntimeConfig();
      const API_BASE_URL = config.public.baseURL as string;
      await $fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with client-side logout even if API call fails
    }
  }

  // Clear auth state
  authStore.clearAuth();

  // Navigate to login page
  await navigateTo("/login");
}

// Get redirect path based on user role
export const getRoleBasedRedirect = (role?: string) => {
  const roleMap: Record<string, string> = {
    owner: "/owner/dashboard",
    admin: "/admin/dashboard",
    teacher: "/teacher/dashboard",
  };

  return roleMap[role || "owner"] || "/owner/dashboard";
};

export const userData = () => {
  return useState("userData", () => null);
};

export async function getProfile() {
  const authStore = useAuthStore();
  const token = authStore.token;

  if (!token) {
    return await logout();
  }

  try {
    const config = useRuntimeConfig();
    const API_BASE_URL = config.public.baseURL as string;
    const data = await $fetch<User>(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Update user state
    authStore.setUser(data);

    return data;
  } catch (error) {
    // If profile fetch fails, user is not authenticated
    await logout();
    throw error;
  }
}

// Convenience function to check if user is authenticated
export const useAuth = () => {
  const authStore = useAuthStore();

  return {
    isAuthenticated: computed(() => authStore.isAuthenticated),
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    register: registerUser,
    login: loginUser,
    logout,
    getProfile,
    initializeAuth,
    verifyOtp,
    resendOtp,
    getRoleBasedRedirect,
  };
};
