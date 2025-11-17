<template>
  <div
    class="flex bg-[#f3f4f6] dark:bg-linear-to-t dark:from-slate-900 dark:to-gray-800 flex-col items-center justify-center min-h-screen py-2"
  >
    <Toaster position="top-center" richColors theme="system" />
    <motion.div
      :initial="{ opacity: 0, scale: 0.95, y: 20 }"
      :animate="{ opacity: 1, scale: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
    >
      <Card class="w-[420px] sm:max-w-md">
        <CardHeader>
          <CardTitle class="text-2xl">Verify Login OTP</CardTitle>
          <CardDescription>
            Enter the verification code sent to {{ email }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="grid gap-2">
              <Label for="otp">Verification Code</Label>
              <Input
                id="otp"
                v-model="otp"
                placeholder="Enter 6-digit code"
                maxlength="6"
                required
                class="text-center text-2xl tracking-widest"
              />
            </div>

            <Button
              :disabled="otp.length !== 6 || isVerifying"
              @click="verifyOtp"
              class="w-full"
            >
              <span v-if="isVerifying">Verifying...</span>
              <span v-else>Verify & Sign In</span>
            </Button>

            <div class="text-center text-sm space-y-2">
              <p class="text-muted-foreground">
                Didn't receive the code?
                <button
                  @click="resendOtp"
                  :disabled="isResending"
                  class="text-primary hover:underline font-medium"
                >
                  {{ isResending ? "Sending..." : "Resend" }}
                </button>
              </p>
              <NuxtLink
                to="/login"
                class="text-primary hover:underline font-medium block"
              >
                Back to Login
              </NuxtLink>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
</template>

<script setup>
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import { motion } from "motion-v";

useHead({
  title: "Verify Login - Testify",
});

const route = useRoute();
const email = ref(route.query.email || "");
const otp = ref("");
const isVerifying = ref(false);
const isResending = ref(false);

// Redirect if no email in query
onMounted(() => {
  if (!email.value) {
    toast.error("Email not found. Please login again.");
    navigateTo("/login");
  }
});

async function verifyOtp() {
  try {
    isVerifying.value = true;

    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    const response = await $fetch(`${baseURL}/auth/verify-login-otp`, {
      method: "POST",
      body: {
        email: email.value,
        otp: otp.value,
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
    otp.value = ""; // Clear OTP input
  } finally {
    isVerifying.value = false;
  }
}

async function resendOtp() {
  try {
    isResending.value = true;

    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    await $fetch(`${baseURL}/auth/login`, {
      method: "POST",
      body: {
        email: email.value,
        // Note: Backend should handle resend without requiring password
      },
    });

    toast.success("OTP resent to your email!");
  } catch (error) {
    console.error("Resend error:", error);
    toast.error(
      error.data?.message || "Failed to resend OTP. Please try again."
    );
  } finally {
    isResending.value = false;
  }
}

async function checkUserSetupAndRedirect() {
  try {
    const { user } = useAuth();

    navigateTo("/dashboard");
  } catch (error) {
    console.error("Error checking user setup:", error);
    await navigateTo("/dashboard");
  }
}

definePageMeta({
  layout: false,
  middleware: "guest",
});
</script>
