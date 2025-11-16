// composables/useAuth.ts
import { useCookie } from "#app";
import { createError } from "h3";

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

// Global authentication state
export const useAuthState = () => {
  // SSR-safe global authentication state
  const isAuthenticated = useState<boolean>(
    "auth.isAuthenticated",
    () => false
  );
  const user = useState<User | null>("auth.user", () => null);

  return {
    isAuthenticated: readonly(isAuthenticated),
    user: readonly(user),
  };
};

// Internal state setters (not exposed)
const setAuthState = () => {
  const isAuthenticated = useState<boolean>("auth.isAuthenticated");
  const user = useState<User | null>("auth.user");

  return {
    setAuthenticated: (value: boolean) => {
      isAuthenticated.value = value;
    },
    setUser: (userData: User | null) => {
      user.value = userData;
    },
  };
};

// Initialize authentication state from cookie
export const initializeAuth = () => {
  // Only run on client side to avoid SSR issues
  if (process.client) {
    const tokenCookie = useCookie<string | null>("access_token", {
      default: () => null,
    });
    const { setAuthenticated } = setAuthState();

    // Set initial authentication state based on token presence
    setAuthenticated(!!tokenCookie.value);
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
    const tokenCookie = useCookie<string | null>("access_token", {
      default: () => null,
    });
    tokenCookie.value = accessToken;

    // Update global authentication state
    const { setAuthenticated, setUser } = setAuthState();
    setAuthenticated(true);

    // Set user data if available
    if (data.value?.user) {
      setUser(data.value.user);
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
    const tokenCookie = useCookie<string | null>("access_token", {
      default: () => null,
    });
    tokenCookie.value = accessToken;

    // Update global authentication state
    const { setAuthenticated, setUser } = setAuthState();
    setAuthenticated(true);

    // Set user data if available
    if (data.value?.user) {
      setUser(data.value.user);
    }
  }

  return data.value;
}

export async function logout() {
  const tokenCookie = useCookie<string | null>("access_token", {
    default: () => null,
  });

  // Call backend logout endpoint if token exists
  if (tokenCookie.value) {
    try {
      const config = useRuntimeConfig();
      const API_BASE_URL = config.public.baseURL as string;
      await $fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenCookie.value}`,
        },
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with client-side logout even if API call fails
    }
  }

  // Clear the token cookie
  tokenCookie.value = null;

  // Clear global authentication state
  const { setAuthenticated, setUser } = setAuthState();
  setAuthenticated(false);
  setUser(null);

  // Navigate to login page
  await navigateTo("/login");
}

export const userData = () => {
  return useState("userData", () => null);
};

export async function getProfile() {
  const token = useCookie<string | null>("access_token", {
    default: () => null,
  });

  if (!token.value) {
    return await logout();
  }

  try {
    const config = useRuntimeConfig();
    const API_BASE_URL = config.public.baseURL as string;
    const data = await $fetch<User>(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    // Update global user state
    const { setAuthenticated, setUser } = setAuthState();
    setAuthenticated(true);
    setUser(data);

    return data;
  } catch (error) {
    // If profile fetch fails, user is not authenticated
    await logout();
    throw error;
  }
}

// Convenience function to check if user is authenticated
export const useAuth = () => {
  const { isAuthenticated, user } = useAuthState();

  return {
    isAuthenticated,
    user,
    register: registerUser,
    login: loginUser,
    logout,
    getProfile,
    initializeAuth,
    verifyOtp,
    resendOtp,
  };
};
