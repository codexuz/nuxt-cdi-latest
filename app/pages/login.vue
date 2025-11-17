<template>
  <div
    class="flex bg-[#f3f4f6] dark:bg-linear-to-t dark:from-slate-900 dark:to-gray-800 flex-col items-center justify-center min-h-screen py-2"
  >
    <Toaster position="top-center" richColors theme="system" />
    <div>
      <Card class="w-[420px] sm:max-w-md">
        <CardHeader>
          <CardTitle class="text-2xl"> Welcome Back </CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="grid gap-2">
              <Label for="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                v-model="loginForm.email"
                placeholder="user@example.com"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label for="login-password">Password</Label>
              <div class="relative">
                <Input
                  id="login-password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="loginForm.password"
                  placeholder="Enter your password"
                  required
                  class="pr-10"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    v-if="showPassword"
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                  <svg
                    v-else
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <Button
              :disabled="!loginForm.email || !loginForm.password || isLoggingIn"
              @click="login"
              class="w-full"
            >
              <span v-if="isLoggingIn">Signing in...</span>
              <span v-else>Sign in</span>
            </Button>

            <div class="text-center text-sm">
              Don't have an account?
              <NuxtLink
                to="/register"
                class="text-primary hover:underline font-medium"
              >
                Sign up
              </NuxtLink>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
<script setup>
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "Login - Mockmee LM",
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

async function checkUserSetupAndRedirect() {
  try {
    const { user } = useAuth();

    const hasCompany = user.value?.center_id;
    if (!hasCompany) {
      await navigateTo("/auth/companies/create");
    } else {
      await navigateTo("/dashboard");
    }
  } catch (error) {
    console.error("Error checking user setup:", error);
    await navigateTo("/dashboard");
  }
}

definePageMeta({
  layout: "default",
  middleware: "guest",
});
</script>
