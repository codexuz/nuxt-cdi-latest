<template>
  <div
    class="flex items-center justify-center min-h-screen bg-[#f3f4f6] dark:bg-linear-to-t dark:from-slate-900 dark:to-gray-800"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"
      ></div>
      <h1 class="text-xl font-semibold">Authenticating...</h1>
      <p class="text-sm text-muted-foreground mt-2">
        Please wait while we log you in
      </p>
    </div>
  </div>
</template>

<script setup>
import { motion } from "motion-v";

const route = useRoute();
const router = useRouter();

// Extract token and user from URL params
const token = route.query.token;
const userParam = route.query.user;
const type = route.query.type;

onMounted(async () => {
  try {
    if (!token) {
      console.error("No token found in callback");
      await router.push("/login");
      return;
    }

    // Parse user data from URL param
    let userData = null;
    if (userParam) {
      try {
        userData =
          typeof userParam === "string" ? JSON.parse(userParam) : userParam;
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }

    // Save token to cookie
    const tokenCookie = useCookie("access_token", {
      default: () => null,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    tokenCookie.value = token;

    // Update authentication state
    const isAuthenticated = useState("auth.isAuthenticated");
    const user = useState("auth.user");

    isAuthenticated.value = true;
    if (userData) {
      user.value = userData;
    }

    // Redirect to home page
    await router.push("/auth/companies/create");
  } catch (error) {
    console.error("Authentication callback error:", error);
    await router.push("/login");
  }
});

definePageMeta({
  layout: false,
  middleware: "guest",
});
</script>
