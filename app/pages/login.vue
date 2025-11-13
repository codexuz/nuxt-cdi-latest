<template>
  <div
    class="flex bg-[#f3f4f6] dark:bg-linear-to-t dark:from-slate-900 dark:to-gray-800 flex-col items-center justify-center min-h-screen py-2"
  >
    <Toaster position="top-center" richColors theme="system" />
    <Card class="w-[420px] sm:max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl"> Welcome </CardTitle>
        <CardDescription>
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs default-value="login" class="w-full">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" class="space-y-4 mt-4">
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
                  :type="showLoginPassword ? 'text' : 'password'"
                  v-model="loginForm.password"
                  placeholder="Enter your password"
                  required
                  class="pr-10"
                />
                <button
                  type="button"
                  @click="showLoginPassword = !showLoginPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    v-if="showLoginPassword"
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
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t" />
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button @click="handleGoogleLogin" variant="outline" class="w-full">
              <svg
                class="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Google
            </Button>
          </TabsContent>

          <TabsContent value="register" class="space-y-4 mt-4">
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
                  :type="showRegisterPassword ? 'text' : 'password'"
                  v-model="registerForm.password"
                  placeholder="Create a password"
                  required
                  class="pr-10"
                />
                <button
                  type="button"
                  @click="showRegisterPassword = !showRegisterPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    v-if="showRegisterPassword"
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</template>
<script setup>
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "Login - Testify",
});

const { login: loginUser, register: registerUser, loginWithGoogle } = useAuth();

const isLoggingIn = ref(false);
const isRegistering = ref(false);

// Password visibility states
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);

const loginForm = ref({
  email: "",
  password: "",
});

const registerForm = ref({
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "student",
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

async function login() {
  try {
    isLoggingIn.value = true;
    const res = await loginUser({
      email: loginForm.value.email,
      password: loginForm.value.password,
    });
    console.log(res);
    showToast("success", "Login successful!");
    await navigateTo("/");
  } catch (error) {
    console.error("Login error:", error);
    showToast("error", "Login unsuccessful! Please check your credentials.");
  } finally {
    isLoggingIn.value = false;
  }
}

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
    const res = await registerUser(payload);
    console.log(res);
    showToast("success", "Account created successfully!");
    await navigateTo("/");
  } catch (error) {
    console.error("Registration error:", error);
    showToast("error", error.message || "Registration unsuccessful! Please try again.");
  } finally {
    isRegistering.value = false;
  }
}

function handleGoogleLogin() {
  loginWithGoogle();
}

const showToast = (state, message) => {
  if (state === "success") {
    toast.success(message);
  } else if (state === "error") {
    toast.error(message);
  }
};

definePageMeta({
  layout: false,
  middleware: "guest",
});
</script>
