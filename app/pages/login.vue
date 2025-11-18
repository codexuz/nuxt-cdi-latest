<template>
  <div class="flex min-h-screen">
    <Toaster position="top-center" richColors theme="system" />

    <!-- Left Side - Login Form -->
    <div
      class="flex-1 flex items-center justify-center px-8 py-12 bg-white dark:bg-gray-950"
    >
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="mb-8">
          <NuxtLink to="/" class="inline-block">
            <img src="/logo2.png" alt="Mockmee Logo" class="h-12 dark:hidden" />
            <img
              src="/logo2_dark.png"
              alt="Mockmee Logo"
              class="h-12 hidden dark:block"
            />
          </NuxtLink>
        </div>

        <!-- Form Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sign in to Mockmee
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="login" class="space-y-5">
          <!-- Email Input -->
          <div class="space-y-2">
            <Label
              for="login-email"
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </Label>
            <Input
              id="login-email"
              type="email"
              v-model="loginForm.email"
              placeholder="you@example.com"
              required
              class="h-11 px-4 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
            />
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label
                for="login-password"
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <NuxtLink
                to="/forgot-password"
                class="text-sm font-medium text-[#2563EB] hover:text-[#1A73E8] transition-colors"
              >
                Forgot password?
              </NuxtLink>
            </div>
            <div class="relative">
              <Input
                id="login-password"
                :type="showPassword ? 'text' : 'password'"
                v-model="loginForm.password"
                placeholder="Enter your password"
                required
                class="h-11 px-4 pr-11 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <EyeOff v-if="showPassword" class="h-5 w-5" />
                <Eye v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <Button
            type="submit"
            :disabled="!loginForm.email || !loginForm.password || isLoggingIn"
            class="w-full h-11 bg-[#2563EB] hover:bg-[#1A73E8] text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              v-if="isLoggingIn"
              class="flex items-center justify-center gap-2"
            >
              <span
                class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              Signing in...
            </span>
            <span v-else>Log In</span>
          </Button>

          <!-- Sign Up Link -->
          <div class="text-center pt-4">
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >Don't have an account?</span
            >
            <NuxtLink
              to="/register"
              class="text-sm font-medium text-[#2563EB] hover:text-[#1A73E8] ml-1 transition-colors"
            >
              Create one
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>

    <!-- Right Side - Blue Gradient Background -->
    <div
      class="hidden lg:flex flex-1 bg-gradient-to-br from-[#1A73E8] via-[#2563EB] to-[#3B82F6] dark:from-[#0F4C81] dark:via-[#1A4D8F] dark:to-[#1E40AF] relative overflow-hidden"
    >
      <!-- Abstract Shapes -->
      <div class="absolute inset-0">
        <!-- Large Circle -->
        <div
          class="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        ></div>
        <!-- Medium Circle -->
        <div
          class="absolute bottom-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-2xl"
        ></div>
        <!-- Small Circles -->
        <div
          class="absolute top-1/2 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-xl"
        ></div>
        <div
          class="absolute bottom-1/3 right-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl"
        ></div>
      </div>

      <!-- Content -->
      <div
        class="relative z-10 flex flex-col items-center justify-center px-12 text-white"
      >
        <div class="max-w-2xl space-y-8">
          <!-- Illustration Icon -->
          <div class="flex justify-center items-center mb-8">
            <div
              class="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl"
            >
              <svg
                class="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>

          <!-- Main Heading -->
          <h2 class="text-4xl font-bold leading-tight text-center">
            Empower Your IELTS Journey
          </h2>

          <!-- Description -->
          <p class="text-xl text-white/90 leading-relaxed text-center">
            Comprehensive learning management system designed for IELTS
            preparation centers and students.
          </p>

          <!-- Features List -->
          <div class="flex flex-col gap-4 mt-8">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mt-0.5"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <span class="text-lg leading-relaxed"
                >Complete test builder for all IELTS sections</span
              >
            </div>
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mt-0.5"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <span class="text-lg leading-relaxed"
                >Student progress tracking & analytics</span
              >
            </div>
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mt-0.5"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <span class="text-lg leading-relaxed"
                >Comprehensive center management tools</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div
        class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent"
      ></div>
    </div>
  </div>
</template>
<script setup>
import { toast, Toaster } from "vue-sonner";
import { Eye, EyeOff } from "lucide-vue-next";
import "vue-sonner/style.css";

useHead({
  title: "Sign in to Mockmee - LMS + CD IELTS",
  meta: [
    {
      name: "description",
      content:
        "Sign in to Mockmee, the comprehensive learning management system for IELTS preparation.",
    },
  ],
});

const { login: loginUser } = useAuth();

const isLoggingIn = ref(false);
const showPassword = ref(false);

const loginForm = ref({
  email: "",
  password: "",
});

async function login() {
  try {
    isLoggingIn.value = true;

    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    // Send login credentials
    await $fetch(`${baseURL}/auth/login`, {
      method: "POST",
      body: {
        email: loginForm.value.email,
        password: loginForm.value.password,
      },
    });

    toast.success("OTP sent to your email!");

    // Redirect to OTP verification page
    await navigateTo({
      path: "/auth/verify-login-otp",
      query: { email: loginForm.value.email },
    });
  } catch (error) {
    console.error("Login error:", error);

    // Check if it's an email verification error
    if (
      error.statusCode === 401 &&
      error.data?.message?.includes("Email not verified")
    ) {
      toast.error("Email not verified. Please verify your email first.");
    } else {
      toast.error(
        error.data?.message ||
          "Login unsuccessful! Please check your credentials."
      );
    }
  } finally {
    isLoggingIn.value = false;
  }
}

definePageMeta({
  layout: "default",
  middleware: "guest",
});
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
