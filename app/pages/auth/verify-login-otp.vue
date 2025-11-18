<template>
  <div
    class="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 items-center justify-center px-4 py-12"
  >
    <Toaster position="top-center" richColors theme="system" />

    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <img src="/logo2.png" alt="Mockmee Logo" class="h-12 dark:hidden" />
          <img
            src="/logo2_dark.png"
            alt="Mockmee Logo"
            class="h-12 hidden dark:block"
          />
        </NuxtLink>
      </div>

      <!-- Main Card -->
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800"
      >
        <!-- Illustration -->
        <div class="flex justify-center mb-8">
          <div
            class="w-24 h-24 bg-gradient-to-br from-[#1A73E8]/10 to-[#2563EB]/10 rounded-2xl flex items-center justify-center"
          >
            <svg
              class="w-12 h-12 text-[#2563EB]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
        </div>

        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Verify Your Account
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Enter the 6-digit code sent to
          </p>
          <p class="text-[#2563EB] font-medium mt-1">
            {{ email }}
          </p>
        </div>

        <!-- OTP Input Boxes -->
        <div class="mb-8">
          <div class="flex gap-2 justify-center mb-2">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :ref="(el) => (otpInputs[index] = el)"
              v-model="otpDigits[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              @input="handleOtpInput(index, $event)"
              @keydown="handleKeyDown(index, $event)"
              @paste="handlePaste"
              class="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
              :class="{ 'border-red-500 focus:border-red-500': showError }"
            />
          </div>
          <p v-if="showError" class="text-red-500 text-sm text-center mt-2">
            Invalid code. Please try again.
          </p>
        </div>

        <!-- Verify Button -->
        <Button
          @click="verifyOtp"
          :disabled="!isOtpComplete || isVerifying"
          class="w-full h-12 bg-gradient-to-r from-[#2563EB] to-[#1A73E8] hover:from-[#1A73E8] hover:to-[#1557B0] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <span
            v-if="isVerifying"
            class="flex items-center justify-center gap-2"
          >
            <span
              class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            Verifying...
          </span>
          <span v-else>Verify & Sign In</span>
        </Button>


        <!-- Back to Login -->
        <div
          class="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800"
        >
          <NuxtLink
            to="/login"
            class="text-sm text-gray-600 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-[#2563EB] transition-colors inline-flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Login
          </NuxtLink>
        </div>
      </div>

      <!-- Security Note -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          🔒 Your information is secure and encrypted
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "Verify Login - Mockmee",
  meta: [
    {
      name: "description",
      content: "Enter your verification code to sign in to Mockmee.",
    },
  ],
});

const route = useRoute();
const email = ref(route.query.email || "");
const otpDigits = ref(["", "", "", "", "", ""]);
const otpInputs = ref([]);
const isVerifying = ref(false);
const isResending = ref(false);
const countdown = ref(0);
const showError = ref(false);

// Redirect if no email in query
onMounted(() => {
  if (!email.value) {
    toast.error("Email not found. Please login again.");
    navigateTo("/login");
  }
  // Focus first input
  nextTick(() => {
    otpInputs.value[0]?.focus();
  });
});

const isOtpComplete = computed(() => {
  return otpDigits.value.every((digit) => digit !== "");
});

const otpCode = computed(() => {
  return otpDigits.value.join("");
});

function handleOtpInput(index, event) {
  const value = event.target.value;

  // Only allow single digit
  if (value.length > 1) {
    otpDigits.value[index] = value.slice(-1);
  } else if (/^\d$/.test(value)) {
    otpDigits.value[index] = value;
    // Move to next input
    if (index < 5) {
      otpInputs.value[index + 1]?.focus();
    }
  } else if (value === "") {
    otpDigits.value[index] = "";
  } else {
    // Clear invalid input
    event.target.value = "";
    otpDigits.value[index] = "";
  }

  showError.value = false;
}

function handleKeyDown(index, event) {
  // Handle backspace
  if (event.key === "Backspace") {
    if (otpDigits.value[index] === "" && index > 0) {
      otpInputs.value[index - 1]?.focus();
    }
  }
  // Handle arrow keys
  else if (event.key === "ArrowLeft" && index > 0) {
    otpInputs.value[index - 1]?.focus();
  } else if (event.key === "ArrowRight" && index < 5) {
    otpInputs.value[index + 1]?.focus();
  }
}

function handlePaste(event) {
  event.preventDefault();
  const pastedData = event.clipboardData.getData("text").trim();

  if (/^\d{6}$/.test(pastedData)) {
    otpDigits.value = pastedData.split("");
    otpInputs.value[5]?.focus();
  }
}

async function verifyOtp() {
  try {
    isVerifying.value = true;
    showError.value = false;

    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    const response = await $fetch(`${baseURL}/auth/verify-login-otp`, {
      method: "POST",
      body: {
        email: email.value,
        otp: otpCode.value,
      },
    });

    // Store access token
    const authStore = useAuthStore();
    authStore.setToken(response.access_token);

    // Update auth state
    const { getProfile } = useAuth();
    await getProfile();

    toast.success("Login successful!");

    // Check user setup status and redirect accordingly
    await checkUserSetupAndRedirect();
  } catch (error) {
    console.error("Verification error:", error);
    toast.error(error.data?.message || "Invalid OTP. Please try again.");
    showError.value = true;
    // Clear OTP
    otpDigits.value = ["", "", "", "", "", ""];
    otpInputs.value[0]?.focus();
  } finally {
    isVerifying.value = false;
  }
}

function startCountdown() {
  countdown.value = 60; // 60 seconds countdown
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}

// Auto-verify when all digits are entered
watch(otpCode, (newValue) => {
  if (newValue.length === 6 && /^\d{6}$/.test(newValue)) {
    // Auto-submit after a short delay
    setTimeout(() => {
      if (isOtpComplete.value && !isVerifying.value) {
        verifyOtp();
      }
    }, 300);
  }
});

async function checkUserSetupAndRedirect() {
  try {
    const { user, getRoleBasedRedirect } = useAuth();

    // Get redirect path based on user role
    const redirectPath = getRoleBasedRedirect(user.value?.role);

    // Check if owner and needs to create company
    const hasCompany = user.value?.center_id;
    if (user.value?.role === "owner" && !hasCompany) {
      await navigateTo("/auth/companies/create");
    } else {
      await navigateTo(redirectPath);
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

<style scoped>
/* Remove spinner arrows from number input */
input[type="text"]::-webkit-outer-spin-button,
input[type="text"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="text"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

/* Smooth focus transition */
input {
  transition: all 0.2s ease;
}
</style>
