<template>
  <div class="space-y-6">
    <Toaster position="top-center" richColors theme="system" />

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Manage your learning center preferences and configuration
      </p>
    </div>

    <!-- Settings Navigation -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar Navigation -->
      <Card class="lg:col-span-1">
        <CardContent class="p-4">
          <nav class="space-y-2">
            <Button
              v-for="section in settingsSections"
              :key="section.id"
              @click="activeSection = section.id"
              :variant="activeSection === section.id ? 'default' : 'ghost'"
              class="w-full justify-start"
            >
              <component :is="section.icon" class="h-4 w-4 mr-2" />
              {{ section.name }}
            </Button>
          </nav>
        </CardContent>
      </Card>

      <!-- Settings Content -->
      <div class="lg:col-span-3">
        <!-- General Settings -->
        <Card v-if="activeSection === 'general'">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Basic information about your learning center
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Loading State -->
            <div v-if="isLoadingCenter" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="i in 4" :key="i" class="space-y-2">
                  <div
                    class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"
                  ></div>
                  <div
                    class="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  ></div>
                </div>
              </div>
            </div>

            <div v-else class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <Label for="center-name">Center Name</Label>
                  <Input
                    id="center-name"
                    v-model="settings.general.name"
                    placeholder="Your Learning Center Name"
                  />
                </div>

                <div class="space-y-2">
                  <Label for="center-email">Contact Email</Label>
                  <Input
                    id="center-email"
                    type="email"
                    v-model="settings.general.email"
                    placeholder="contact@example.com"
                  />
                </div>

                <div class="space-y-2">
                  <Label for="center-phone">Phone Number</Label>
                  <Input
                    id="center-phone"
                    v-model="settings.general.phone"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <Label for="center-address">Address</Label>
                <Textarea
                  id="center-address"
                  v-model="settings.general.address"
                  placeholder="123 Main Street, City, State, Country"
                  rows="3"
                />
              </div>

              <Button
                @click="saveGeneralSettings"
                :disabled="isLoadingCenter || !activeCenter || isSavingSettings"
              >
                {{ isSavingSettings ? "Saving..." : "Save General Settings" }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Security Settings -->
        <Card v-if="activeSection === 'security'">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your account security and privacy
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  v-model="passwordForm.currentPassword"
                  placeholder="Enter current password"
                />
              </div>

              <div class="space-y-2">
                <Label for="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  v-model="passwordForm.newPassword"
                  placeholder="Enter new password"
                />
              </div>

              <div class="space-y-2">
                <Label for="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  v-model="passwordForm.confirmPassword"
                  placeholder="Confirm new password"
                />
              </div>

              <Button @click="changePassword" :disabled="isChangingPassword">
                {{ isChangingPassword ? "Changing..." : "Change Password" }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Billing Settings -->
        <Card v-if="activeSection === 'billing'">
          <CardHeader>
            <CardTitle>Billing & Subscription</CardTitle>
            <CardDescription>
              Manage your subscription and payment methods
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Loading State -->
            <div
              v-if="isLoadingSubscription"
              class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg animate-pulse"
            >
              <div
                class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"
              ></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>

            <!-- Subscription Data -->
            <div
              v-else-if="subscription"
              class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-blue-900 dark:text-blue-100">
                    {{ subscription.plan?.name || "N/A" }}
                  </h4>
                  <p class="text-sm text-blue-700 dark:text-blue-300">
                    {{ formatSubscriptionPrice() }} •
                    <span
                      v-if="
                        subscription.trial_ends_at &&
                        new Date(subscription.trial_ends_at) > new Date()
                      "
                    >
                      Trial ends {{ formatDate(subscription.trial_ends_at) }}
                    </span>
                    <span v-else>
                      Renews {{ formatDate(subscription.renews_at) }}
                    </span>
                  </p>
                  <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Active from {{ formatDate(subscription.start_date) }} to
                    {{ formatDate(subscription.end_date) }}
                  </p>
                </div>
                <Badge
                  :variant="
                    subscription.status === 'active' ? 'default' : 'secondary'
                  "
                >
                  {{
                    subscription.status.charAt(0).toUpperCase() +
                    subscription.status.slice(1)
                  }}
                </Badge>
              </div>

              <!-- Plan Features -->
              <div
                v-if="subscription.plan?.features"
                class="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800"
              >
                <p
                  class="text-xs font-medium text-blue-900 dark:text-blue-100 mb-2"
                >
                  Plan Features:
                </p>
                <div
                  class="grid grid-cols-2 gap-2 text-xs text-blue-700 dark:text-blue-300"
                >
                  <div v-if="subscription.plan.features.max_students">
                    👥
                    {{
                      subscription.plan.features.max_students >= 10000
                        ? "Unlimited"
                        : subscription.plan.features.max_students
                    }}
                    students
                  </div>
                  <div v-if="subscription.plan.features.max_users">
                    👤
                    {{
                      subscription.plan.features.max_users >= 10000
                        ? "Unlimited"
                        : subscription.plan.features.max_users
                    }}
                    users
                  </div>
                  <div v-if="subscription.plan.features.ielts">
                    ✅ IELTS Builder
                  </div>
                  <div v-if="subscription.plan.features.groups">✅ Groups</div>
                  <div v-if="subscription.plan.features.attendance">
                    ✅ Attendance
                  </div>
                  <div v-if="subscription.plan.features.payments">
                    ✅ Payments
                  </div>
                  <div v-if="subscription.plan.features.salary">✅ Salary</div>
                  <div v-if="subscription.plan.features.leads">✅ Leads</div>
                </div>
              </div>
            </div>

            <!-- No Subscription -->
            <div
              v-else
              class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center"
            >
              <p class="text-gray-600 dark:text-gray-400">
                No active subscription found
              </p>
              <Button
                variant="default"
                class="mt-4"
                @click="navigateTo('/dashboard/subscriptions')"
              >
                Subscribe Now
              </Button>
            </div>

            <div class="space-y-4">
              <Button
                variant="outline"
                @click="navigateTo('/dashboard/subscriptions')"
                :disabled="isLoadingSubscription"
              >
                Change Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Settings as SettingsIcon, Shield, CreditCard } from "lucide-vue-next";

import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import { useAuthStore } from "~/stores/auth";
import { useCenters } from "~/composables/useCenters";

useHead({
  title: "Settings - Testify",
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { activeCenter } = useCenters();

const activeSection = ref("general");
const isLoadingSubscription = ref(false);
const isLoadingCenter = ref(true);
const isSavingSettings = ref(false);
const isChangingPassword = ref(false);
const subscription = ref(null);

const settingsSections = [
  { id: "general", name: "General", icon: SettingsIcon },
  { id: "security", name: "Security", icon: Shield },
  { id: "billing", name: "Billing", icon: CreditCard },
];

const settings = ref({
  general: {
    name: "",
    email: "",
    phone: "",
    address: "",
  },
  security: {
    sessionTimeout: "60",
  },
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Fetch active subscription
async function fetchSubscription() {
  if (!activeCenter.value) {
    console.log("No active center found");
    return;
  }

  try {
    isLoadingSubscription.value = true;
    const response = await fetch(
      `${config.public.baseURL}/subscriptions/center/${activeCenter.value.id}/active`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      subscription.value = await response.json();
    } else if (response.status === 404) {
      subscription.value = null;
      console.log("No active subscription found");
    } else {
      throw new Error("Failed to fetch subscription");
    }
  } catch (error) {
    console.error("Error fetching subscription:", error);
    toast.error("Failed to load subscription data");
    subscription.value = null;
  } finally {
    isLoadingSubscription.value = false;
  }
}

// Format date helper
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format subscription price
function formatSubscriptionPrice() {
  if (!subscription.value?.plan) return "N/A";

  const plan = subscription.value.plan;
  const price = plan.price_month || 0;
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  const formattedPrice = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);

  return `${formattedPrice} ${plan.currency || "UZS"}/month`;
}

// Watch for billing section to fetch subscription
watch(activeSection, (newSection) => {
  if (
    newSection === "billing" &&
    !subscription.value &&
    !isLoadingSubscription.value
  ) {
    fetchSubscription();
  }
});

// Populate settings from activeCenter
function populateSettingsFromCenter() {
  if (activeCenter.value) {
    settings.value.general = {
      name: activeCenter.value.name || "",
      email: activeCenter.value.email || "",
      phone: activeCenter.value.phone || "",
      address: activeCenter.value.address || "",
    };
    isLoadingCenter.value = false;
  }
}

// Watch for activeCenter changes
watch(
  () => activeCenter.value,
  (newCenter) => {
    if (newCenter) {
      populateSettingsFromCenter();
    }
  },
  { immediate: true }
);

// Fetch on mount if billing section is active
onMounted(() => {
  if (activeSection.value === "billing") {
    fetchSubscription();
  }
  if (activeCenter.value) {
    populateSettingsFromCenter();
  }
});

const saveGeneralSettings = async () => {
  if (!activeCenter.value) {
    toast.error("No active center found");
    return;
  }

  try {
    isSavingSettings.value = true;
    const response = await fetch(
      `${config.public.baseURL}/centers/${activeCenter.value.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings.value.general),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to update center");
    }

    const updatedCenter = await response.json();
    toast.success("Center settings saved successfully!");

    // Update activeCenter with new data
    populateSettingsFromCenter();
  } catch (error) {
    console.error("Error updating center:", error);
    toast.error(error.message || "Failed to save settings");
  } finally {
    isSavingSettings.value = false;
  }
};

const changePassword = async () => {
  if (!passwordForm.value.currentPassword) {
    toast.error("Please enter your current password");
    return;
  }

  if (!passwordForm.value.newPassword) {
    toast.error("Please enter a new password");
    return;
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error("Passwords do not match!");
    return;
  }

  if (passwordForm.value.newPassword.length < 6) {
    toast.error("New password must be at least 6 characters long");
    return;
  }

  try {
    isChangingPassword.value = true;

    const response = await fetch(
      `${config.public.baseURL}/users/change-password`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to change password");
    }

    toast.success("Password changed successfully!");

    // Clear form
    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  } catch (error) {
    console.error("Error changing password:", error);
    toast.error(
      error.message ||
        "Failed to change password. Please check your current password."
    );
  } finally {
    isChangingPassword.value = false;
  }
};

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>
