<template>
  <div
    class="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900"
  >
    <Toaster position="top-center" richColors theme="system" />

    <!-- Left Side - Registration Form -->
    <div class="flex-1 flex items-center justify-center px-8 py-12">
      <div class="w-full max-w-xl">
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

        <!-- Form Card -->
        <div
          class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800"
        >
          <!-- Form Header -->
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Account
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Start your journey with Mockmee today
            </p>
          </div>

          <!-- Registration Form -->
          <form @submit.prevent="register" class="space-y-5">
            <!-- Full Name -->
            <div class="space-y-2">
              <Label
                for="register-name"
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </Label>
              <Input
                id="register-name"
                type="text"
                v-model="registerForm.name"
                placeholder="John Doe"
                required
                class="h-11 px-4 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
              />
            </div>

            <!-- Email and Phone - Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label
                  for="register-email"
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  v-model="registerForm.email"
                  placeholder="you@example.com"
                  required
                  class="h-11 px-4 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
                />
              </div>

              <div class="space-y-2">
                <Label
                  for="register-phone"
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number
                </Label>
                <Input
                  id="register-phone"
                  type="tel"
                  v-model="registerForm.phone"
                  placeholder="+1 234 567 890"
                  required
                  class="h-11 px-4 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <!-- Password and Confirm Password - Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label
                  for="register-password"
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                <div class="relative">
                  <Input
                    id="register-password"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="registerForm.password"
                    placeholder="Create password"
                    required
                    class="h-11 px-4 pr-11 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
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

              <div class="space-y-2">
                <Label
                  for="register-confirm-password"
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </Label>
                <div class="relative">
                  <Input
                    id="register-confirm-password"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    v-model="registerForm.confirmPassword"
                    placeholder="Confirm password"
                    required
                    class="h-11 px-4 pr-11 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
                    :class="{
                      'border-red-500 focus:border-red-500 focus:ring-red-500':
                        passwordMismatch,
                    }"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <EyeOff v-if="showConfirmPassword" class="h-5 w-5" />
                    <Eye v-else class="h-5 w-5" />
                  </button>
                </div>
                <p v-if="passwordMismatch" class="text-xs text-red-500 mt-1">
                  Passwords do not match
                </p>
              </div>
            </div>

            <!-- Role Selection -->
            <div class="space-y-2">
              <Label
                for="register-role"
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                I am a
              </Label>
              <Select v-model="registerForm.role">
                <SelectTrigger
                  id="register-role"
                  class="h-11 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                >
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Learning Center Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Create Account Button -->
            <Button
              type="submit"
              :disabled="
                !isRegisterFormValid || isRegistering || passwordMismatch
              "
              class="w-full h-12 bg-gradient-to-r from-[#2563EB] to-[#1A73E8] hover:from-[#1A73E8] hover:to-[#1557B0] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              <span
                v-if="isRegistering"
                class="flex items-center justify-center gap-2"
              >
                <span
                  class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></span>
                Creating account...
              </span>
              <span v-else>Create Account</span>
            </Button>

            <!-- Login Link -->
            <div class="text-center pt-4">
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >Already have an account?</span
              >
              <NuxtLink
                to="/login"
                class="text-sm font-medium text-[#2563EB] hover:text-[#1A73E8] ml-1 transition-colors"
              >
                Log in
              </NuxtLink>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Right Side - Illustration -->
    <div
      class="hidden lg:flex flex-1 bg-gradient-to-br from-[#1A73E8] via-[#2563EB] to-[#3B82F6] dark:from-[#0F4C81] dark:via-[#1A4D8F] dark:to-[#1E40AF] relative overflow-hidden"
    >
      <!-- Abstract Shapes -->
      <div class="absolute inset-0">
        <div
          class="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute bottom-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-2xl"
        ></div>
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
        <div class="max-w-lg space-y-8">
          <!-- Dashboard Preview Illustration -->
          <div class="flex justify-center mb-8">
            <div class="relative">
              <!-- Main Dashboard Card -->
              <div
                class="bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-80 border border-white/30"
              >
                <!-- Header -->
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-white/30 rounded-lg"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-3 bg-white/30 rounded w-3/4"></div>
                    <div class="h-2 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-3 mb-4">
                  <div class="bg-white/10 rounded-xl p-3 space-y-2">
                    <div class="h-2 bg-white/30 rounded w-2/3"></div>
                    <div class="h-4 bg-white/40 rounded w-1/2"></div>
                  </div>
                  <div class="bg-white/10 rounded-xl p-3 space-y-2">
                    <div class="h-2 bg-white/30 rounded w-2/3"></div>
                    <div class="h-4 bg-white/40 rounded w-1/2"></div>
                  </div>
                </div>

                <!-- Progress Bars -->
                <div class="space-y-3">
                  <div class="space-y-1">
                    <div class="h-2 bg-white/20 rounded w-full"></div>
                    <div class="h-2 bg-white/40 rounded w-3/4"></div>
                  </div>
                  <div class="space-y-1">
                    <div class="h-2 bg-white/20 rounded w-full"></div>
                    <div class="h-2 bg-white/40 rounded w-2/3"></div>
                  </div>
                </div>
              </div>

              <!-- Floating Elements -->
              <div
                class="absolute -top-4 -right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl shadow-xl"
              ></div>
              <div
                class="absolute -bottom-4 -left-4 w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl shadow-xl"
              ></div>
            </div>
          </div>

          <!-- Welcome Message -->
          <div class="text-center space-y-4">
            <h2 class="text-4xl font-bold leading-tight">Welcome to Mockmee</h2>
            <p class="text-xl text-white/90 leading-relaxed">
              Join thousands of educators and students transforming IELTS
              preparation
            </p>
          </div>

          <!-- Features -->
          <div class="flex flex-col gap-4">
            <div class="flex items-start gap-3">
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
              <div>
                <p class="font-medium text-lg">Quick Setup</p>
                <p class="text-white/80 text-sm">
                  Get started in minutes with our intuitive onboarding
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
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
              <div>
                <p class="font-medium text-lg">Powerful Tools</p>
                <p class="text-white/80 text-sm">
                  Everything you need to manage your center effectively
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
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
              <div>
                <p class="font-medium text-lg">24/7 Support</p>
                <p class="text-white/80 text-sm">
                  Our team is always here to help you succeed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative Bottom Gradient -->
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
  title: "Create Your Account - Mockmee LMS + CD IELTS",
  meta: [
    {
      name: "description",
      content:
        "Create your Mockmee account and start managing your IELTS preparation center today.",
    },
  ],
});

const { register: registerUser } = useAuth();

const isRegistering = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const registerForm = ref({
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "owner",
  center_id: "",
});

const passwordMismatch = computed(() => {
  return (
    registerForm.value.confirmPassword &&
    registerForm.value.password !== registerForm.value.confirmPassword
  );
});

const isRegisterFormValid = computed(() => {
  return (
    registerForm.value.name &&
    registerForm.value.email &&
    registerForm.value.phone &&
    registerForm.value.password &&
    registerForm.value.confirmPassword &&
    registerForm.value.password === registerForm.value.confirmPassword &&
    registerForm.value.role
  );
});

async function register() {
  try {
    isRegistering.value = true;
    const payload = {
      name: registerForm.value.name,
      email: registerForm.value.email,
      phone: registerForm.value.phone,
      password: registerForm.value.password,
      role: registerForm.value.role,
    };

    await registerUser(payload);

    toast.success("Registration successful! Please check your email for OTP.");

    // Navigate to OTP verification page with email
    await navigateTo({
      path: "/verify-otp",
      query: { email: registerForm.value.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    toast.error(
      error.message || "Registration unsuccessful! Please try again."
    );
  } finally {
    isRegistering.value = false;
  }
}

definePageMeta({
  layout: "default",
  middleware: "guest",
});
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(37, 99, 235, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(37, 99, 235, 0.5);
}
</style>
