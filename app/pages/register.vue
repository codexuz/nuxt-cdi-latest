<template>
  <div
    class="flex bg-[#f3f4f6] dark:bg-linear-to-t dark:from-slate-900 dark:to-gray-800 flex-col items-center justify-center min-h-screen py-2"
  >
    <Toaster position="top-center" richColors theme="system" />
    <Card class="w-[420px] sm:max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Enter your information to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="grid gap-2">
            <Label for="register-name">Full Name</Label>
            <Input
              id="register-name"
              type="text"
              v-model="registerForm.name"
              placeholder="John Doe"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              v-model="registerForm.email"
              placeholder="user@example.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="register-phone">Phone</Label>
            <Input
              id="register-phone"
              type="tel"
              v-model="registerForm.phone"
              placeholder="+1234567890"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="register-password">Password</Label>
            <div class="relative">
              <Input
                id="register-password"
                :type="showPassword ? 'text' : 'password'"
                v-model="registerForm.password"
                placeholder="Create a password"
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
          <div class="grid gap-2">
            <Label for="register-role">Role</Label>
            <Select v-model="registerForm.role">
              <SelectTrigger id="register-role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Learning Center Owner</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            :disabled="!isRegisterFormValid || isRegistering"
            @click="register"
            class="w-full"
          >
            <span v-if="isRegistering">Creating account...</span>
            <span v-else>Create account</span>
          </Button>

          <div class="text-center text-sm">
            Already have an account?
            <NuxtLink
              to="/login"
              class="text-primary hover:underline font-medium"
            >
              Sign in
            </NuxtLink>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "Register - Testify",
});

const { register: registerUser } = useAuth();

const isRegistering = ref(false);
const showPassword = ref(false);

const registerForm = ref({
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "owner",
  center_id: "",
});

const isRegisterFormValid = computed(() => {
  return (
    registerForm.value.name &&
    registerForm.value.email &&
    registerForm.value.phone &&
    registerForm.value.password &&
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
      ...(registerForm.value.center_id && {
        center_id: registerForm.value.center_id,
      }),
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
  layout: false,
  middleware: "guest",
});
</script>
