<template>
  <section class="max-w-5xl mx-auto px-4 py-8">
    <Toaster position="top-center" richColors theme="system" />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <NuxtLink to="/"> Home </NuxtLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="py-6 flex items-center justify-between">
      <h1
        class="scroll-m-20 text-xl sm:text-2xl font-bold tracking-tight md:text-3xl"
      >
        My Profile
      </h1>
      <Button
        @click="handleLogout"
        variant="outline"
        class="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut class="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>

    <!-- Profile Header Card -->
    <Card class="mb-6">
      <CardContent class="pt-6">
        <div
          class="flex flex-col md:flex-row items-center md:items-start gap-6"
        >
          <Avatar class="h-24 w-24">
            <AvatarImage
              :src="profileData?.avatar_url"
              :alt="profileData?.name"
            />
            <AvatarFallback class="text-2xl">{{
              getInitials(profileData?.name)
            }}</AvatarFallback>
          </Avatar>
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl font-bold">{{ profileData?.name }}</h2>
            <p class="text-muted-foreground">{{ profileData?.email }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Profile Information -->
    <div class="grid gap-6 md:grid-cols-2">
      <!-- Personal Information Card -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Full Name</Label>
            <Input
              id="name"
              v-model="formData.name"
              placeholder="Enter your full name"
            />
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="Enter your email"
              disabled
              class="bg-muted"
            />
            <p class="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div class="space-y-2">
            <Label for="phone">Phone Number</Label>
            <Input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="+1234567890"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button @click="updateProfile" :disabled="isSaving" class="w-full">
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save Changes</span>
          </Button>
        </CardFooter>
      </Card>

      <!-- Account Information Card -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Settings class="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>View your account details</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label>User ID</Label>
            <div class="flex items-center gap-2">
              <Input
                :value="profileData?.id"
                disabled
                class="bg-muted font-mono text-sm"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Provider</Label>
            <div class="flex items-center gap-2">
              <Badge variant="outline" class="text-sm">
                {{ profileData?.provider || "Email" }}
              </Badge>
            </div>
          </div>

          <div class="space-y-2" v-if="profileData?.center_id">
            <Label>Center ID</Label>
            <Input :value="profileData.center_id" disabled class="bg-muted" />
          </div>

          <div class="space-y-2" v-else>
            <Label>Center ID</Label>
            <p class="text-sm text-muted-foreground">
              Not assigned to any center
            </p>
          </div>

          <div class="space-y-2" v-if="profileData?.balance !== undefined">
            <Label>Account Balance</Label>
            <div class="text-2xl font-bold">
              ${{ profileData.balance?.toFixed(2) || "0.00" }}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Security Card -->
    <Card class="mt-6">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Shield class="h-5 w-5" />
          Security
        </CardTitle>
        <CardDescription
          >Manage your password and security settings</CardDescription
        >
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="current-password">Current Password</Label>
            <Input
              id="current-password"
              v-model="passwordForm.currentPassword"
              type="password"
              placeholder="Enter current password"
            />
          </div>
          <div></div>
          <div class="space-y-2">
            <Label for="new-password">New Password</Label>
            <Input
              id="new-password"
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="Enter new password"
            />
          </div>
          <div class="space-y-2">
            <Label for="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          @click="updatePassword"
          :disabled="!isPasswordFormValid || isUpdatingPassword"
          variant="secondary"
        >
          <span v-if="isUpdatingPassword">Updating...</span>
          <span v-else>Update Password</span>
        </Button>
      </CardFooter>
    </Card>
  </section>
</template>

<script setup>
import { User, Settings, Shield, LogOut } from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "Profile - Testify",
});

const { user, logout, getProfile } = useAuth();

const profileData = ref(null);
const isSaving = ref(false);
const isUpdatingPassword = ref(false);

const formData = ref({
  name: "",
  email: "",
  phone: "",
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.currentPassword &&
    passwordForm.value.newPassword &&
    passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword.length >= 6
  );
});

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const loadProfile = async () => {
  try {
    const data = await getProfile();
    profileData.value = data;

    // Populate form with current data
    formData.value = {
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
    };
  } catch (error) {
    console.error("Failed to load profile:", error);
    toast.error("Failed to load profile data");
  }
};

const updateProfile = async () => {
  try {
    isSaving.value = true;

    const token = useCookie("access_token");
    const userId = profileData.value?.id;

    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    const response = await $fetch(`https://edumoacademy.uz/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: {
        name: formData.value.name,
        phone: formData.value.phone,
      },
    });

    profileData.value = { ...profileData.value, ...response };

    // Update global user state
    const userState = useState("auth.user");
    userState.value = { ...userState.value, ...response };

    toast.success("Profile updated successfully!");
  } catch (error) {
    console.error("Failed to update profile:", error);
    toast.error("Failed to update profile. Please try again.");
  } finally {
    isSaving.value = false;
  }
};

const updatePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error("Passwords do not match!");
    return;
  }

  if (passwordForm.value.newPassword.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return;
  }

  try {
    isUpdatingPassword.value = true;

    const token = useCookie("access_token");
    const userId = profileData.value?.id;

    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    await $fetch(`https://edumoacademy.uz/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      },
    });

    // Clear password form
    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    toast.success("Password updated successfully!");
  } catch (error) {
    console.error("Failed to update password:", error);
    toast.error(
      "Failed to update password. Please check your current password."
    );
  } finally {
    isUpdatingPassword.value = false;
  }
};

const handleLogout = async () => {
  await logout();
};

// Load profile on mount
onMounted(() => {
  loadProfile();
});

definePageMeta({
  middleware: "auth",
});
</script>
