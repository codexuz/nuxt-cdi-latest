<template>
  <div
    class="flex bg-[#f3f4f6] dark:bg-linear-to-t dark:from-slate-900 dark:to-gray-800 flex-col items-center justify-center min-h-screen py-2"
  >
    <Toaster position="top-center" richColors theme="system" />
    <div>
      <Card class="w-[420px] sm:max-w-md">
        <CardHeader>
          <CardTitle class="text-2xl">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {{ email }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="grid gap-2">
              <Label for="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                v-model="otp"
                placeholder="123456"
                maxlength="6"
                required
                class="text-center text-2xl tracking-widest"
                @input="handleOtpInput"
              />
            </div>

            <Button
              :disabled="!isOtpValid || isVerifying"
              @click="verifyOtp"
              class="w-full"
            >
              <span v-if="isVerifying">Verifying...</span>
              <span v-else>Verify & Continue</span>
            </Button>

            <div
              class="text-center text-sm flex items-center justify-center gap-x-2"
            >
              <p class="text-muted-foreground">Didn't receive the code?</p>
              <Button
                variant="link"
                :disabled="isResending || countdown > 0"
                @click="resendOtp"
                class="p-0 h-auto font-medium cursor-pointer"
              >
                <span v-if="countdown > 0">Resend in {{ countdown }}s</span>
                <span v-else-if="isResending">Resending...</span>
                <span v-else>Resend OTP</span>
              </Button>
            </div>

            <div class="text-center text-sm">
              <NuxtLink
                to="/login"
                class="text-primary hover:underline font-medium"
              >
                Back to Login
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
  title: "Verify OTP - Mockmee",
});

const route = useRoute();
const { verifyOtp: verifyOtpAuth, resendOtp: resendOtpAuth } = useAuth();

const email = ref(route.query.email || "");
const otp = ref("");
const isVerifying = ref(false);
const isResending = ref(false);
const countdown = ref(0);

// Redirect to register if no email
onMounted(() => {
  if (!email.value) {
    toast.error("Email is required for OTP verification");
    navigateTo("/register");
  }
});

const isOtpValid = computed(() => {
  return otp.value.length === 6 && /^\d{6}$/.test(otp.value);
});

function handleOtpInput(event) {
  // Only allow digits
  otp.value = event.target.value.replace(/\D/g, "");
}

async function verifyOtp() {
  try {
    isVerifying.value = true;

    await verifyOtpAuth({
      email: email.value,
      otp: otp.value,
    });

    toast.success("Account verified successfully!");

    // Redirect to company creation for new users
    await navigateTo("/auth/companies/create");
  } catch (error) {
    console.error("OTP verification error:", error);
    toast.error("Invalid OTP code. Please try again.");
    otp.value = ""; // Clear OTP on error
  } finally {
    isVerifying.value = false;
  }
}

async function resendOtp() {
  try {
    isResending.value = true;

    await resendOtpAuth(email.value);

    toast.success("OTP sent! Please check your email.");

    // Start countdown timer
    startCountdown();
  } catch (error) {
    console.error("Resend OTP error:", error);
    toast.error(error.message || "Failed to resend OTP. Please try again.");
  } finally {
    isResending.value = false;
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

// Auto-submit when 6 digits are entered (optional)
watch(otp, (newValue) => {
  if (newValue.length === 6 && /^\d{6}$/.test(newValue)) {
    // Optional: Auto-submit after a short delay
    // setTimeout(() => verifyOtp(), 500);
  }
});

definePageMeta({
  layout: "default",
  middleware: "guest",
});
</script>
