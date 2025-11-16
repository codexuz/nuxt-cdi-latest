<template>
  <div
    class="flex bg-[#f3f4f6] dark:bg-linear-to-t dark:from-slate-900 dark:to-gray-800 flex-col items-center justify-center min-h-screen py-8 px-4"
  >
    <Toaster position="top-center" richColors theme="system" />

    <Card class="w-full max-w-2xl">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-2xl">Create Your Center</CardTitle>
            <CardDescription class="mt-2">
              Set up your IELTS learning center to get started
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" @click="goBack">
            <X class="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent class="space-y-6">
        <div class="space-y-4">
          <!-- Center Name -->
          <div class="space-y-2">
            <Label for="name" class="flex items-center gap-2">
              <Building2 class="h-4 w-4" />
              Center Name
              <span class="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              v-model="formData.name"
              placeholder="IELTS Learning Center"
              required
            />
            <p class="text-xs text-muted-foreground">
              This will be displayed as your center's official name
            </p>
          </div>

          <!-- Subdomain -->
          <div class="space-y-2">
            <Label for="subdomain" class="flex items-center gap-2">
              <Globe class="h-4 w-4" />
              Subdomain
              <span class="text-red-500">*</span>
            </Label>
            <div class="flex items-center gap-2">
              <Input
                id="subdomain"
                v-model="formData.subdomain"
                placeholder="ielts-center"
                required
                class="flex-1"
              />
              <span class="text-sm text-muted-foreground whitespace-nowrap">
                .edumoacademy.uz
              </span>
            </div>
            <p class="text-xs text-muted-foreground">
              Choose a unique subdomain for your center's URL
            </p>
          </div>

          <!-- Address -->
          <div class="space-y-2">
            <Label for="address" class="flex items-center gap-2">
              <MapPin class="h-4 w-4" />
              Address
              <span class="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              v-model="formData.address"
              placeholder="123 Main Street, City"
              rows="2"
              required
            />
          </div>

          <!-- Phone -->
          <div class="space-y-2">
            <Label for="phone" class="flex items-center gap-2">
              <Phone class="h-4 w-4" />
              Phone Number
              <span class="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="+1234567890"
              required
            />
          </div>

          <!-- Email (Auto-filled) -->
          <div class="space-y-2">
            <Label for="email" class="flex items-center gap-2">
              <Mail class="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              disabled
              class="bg-muted"
            />
            <p class="text-xs text-muted-foreground">
              Using your account email
            </p>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <Label for="description" class="flex items-center gap-2">
              <FileText class="h-4 w-4" />
              Description
            </Label>
            <Textarea
              id="description"
              v-model="formData.description"
              placeholder="Premier IELTS training center with experienced instructors..."
              rows="4"
            />
            <p class="text-xs text-muted-foreground">
              Describe your center's mission and services
            </p>
          </div>
        </div>

        <!-- Info Alert -->
        <Alert>
          <Info class="h-4 w-4" />
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription>
            Once created, you will be set as the owner of this center. Some
            information like the subdomain cannot be changed later.
          </AlertDescription>
        </Alert>
      </CardContent>

      <CardFooter class="flex gap-3">
        <Button variant="outline" @click="goBack" class="flex-1">
          Cancel
        </Button>
        <Button
          @click="createCenter"
          :disabled="!isFormValid || isCreating"
          class="flex-1"
        >
          <span v-if="isCreating">Creating...</span>
          <span v-else>Create Center</span>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Mail,
  FileText,
  X,
  Info,
} from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "Create Center - Testify",
});

const { user } = useAuth();
const router = useRouter();

const isCreating = ref(false);

const formData = ref({
  name: "",
  subdomain: "",
  address: "",
  phone: "",
  email: "",
  description: "",
});

const isFormValid = computed(() => {
  return (
    formData.value.name &&
    formData.value.subdomain &&
    formData.value.address &&
    formData.value.phone &&
    formData.value.email
  );
});

// Auto-fill email from user data
onMounted(() => {
  if (user.value?.email) {
    formData.value.email = user.value.email;
  }
});

// Watch user changes
watch(user, (newUser) => {
  if (newUser?.email && !formData.value.email) {
    formData.value.email = newUser.email;
  }
});

const createCenter = async () => {
  if (!user.value?.id) {
    toast.error("User not authenticated. Please login again.");
    await router.push("/login");
    return;
  }

  try {
    isCreating.value = true;

    const token = useCookie("access_token");
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    const payload = {
      name: formData.value.name,
      subdomain: formData.value.subdomain,
      address: formData.value.address,
      phone: formData.value.phone,
      email: formData.value.email,
      description: formData.value.description || undefined,
    };

    const response = await $fetch(`${baseURL}/auth/register-center`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    console.log("Center created:", response);
    toast.success("Center created successfully!");

    // Redirect to subscription plans
    await router.push("/subscriptions");
  } catch (error) {
    console.error("Failed to create center:", error);

    if (error.statusCode === 409) {
      toast.error(
        "This subdomain is already taken. Please choose a different one."
      );
    } else if (error.statusCode === 400) {
      toast.error("Invalid data provided. Please check all fields.");
    } else {
      toast.error("Failed to create center. Please try again.");
    }
  } finally {
    isCreating.value = false;
  }
};

const goBack = () => {
  router.back();
};

definePageMeta({
  middleware: "auth",
  layout: false,
});
</script>
