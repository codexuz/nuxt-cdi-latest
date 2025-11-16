<template>
  <div class="container mx-auto px-4 py-8">
    <Toaster position="top-center" richColors theme="system" />

    <div class="mb-8">
      <h1 class="text-3xl font-bold">My Centers</h1>
      <p class="text-muted-foreground">Manage your IELTS learning centers</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <!-- Centers List -->
    <div
      v-else-if="centers.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <Card
        v-for="center in centers"
        :key="center.id"
        :class="[
          'hover:shadow-lg transition-shadow',
          center.id === activeCenter?.id && 'ring-2 ring-primary',
        ]"
      >
        <CardHeader>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <CardTitle class="flex items-center gap-2">
                <Building2 class="h-5 w-5" />
                {{ center.name }}
              </CardTitle>
              <CardDescription class="mt-2">
                {{ center.subdomain }}.mockmee.uz
              </CardDescription>
            </div>
            <Badge :variant="center.is_active ? 'default' : 'secondary'">
              {{ center.is_active ? "Active" : "Inactive" }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div v-if="center.description" class="text-sm text-muted-foreground">
            {{ center.description }}
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-muted-foreground">
              <MapPin class="h-4 w-4" />
              <span>{{ center.address }}</span>
            </div>
            <div class="flex items-center gap-2 text-muted-foreground">
              <Phone class="h-4 w-4" />
              <span>{{ center.phone }}</span>
            </div>
            <div class="flex items-center gap-2 text-muted-foreground">
              <Mail class="h-4 w-4" />
              <span>{{ center.email }}</span>
            </div>
          </div>

          <div class="pt-3 border-t">
            <Button
              v-if="center.id !== activeCenter?.id"
              variant="outline"
              size="sm"
              @click="setAsActive(center)"
            >
              Set as Active
            </Button>
            <div v-else class="flex items-center gap-2 text-sm text-primary">
              <CheckCircle class="h-4 w-4" />
              <span>Active Center</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <Card v-else class="text-center py-12">
      <CardContent>
        <Building2 class="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 class="text-lg font-semibold mb-2">No centers found</h3>
        <p class="text-muted-foreground mb-4">
          You haven't created any centers yet
        </p>
        <Button @click="navigateTo('/auth/companies/create')">
          <Plus class="mr-2 h-4 w-4" />
          Create Center
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Plus,
  CheckCircle,
} from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "My Centers - Mockmee LMS",
});

const { centers, activeCenter, fetchMyCenters, setActiveCenter } = useCenters();
const isLoading = ref(true);

onMounted(async () => {
  try {
    await fetchMyCenters();
  } catch (error) {
    console.error("Failed to load centers:", error);
    toast.error("Failed to load centers");
  } finally {
    isLoading.value = false;
  }
});

const setAsActive = (center) => {
  setActiveCenter(center);
  toast.success(`${center.name} is now your active center`);
};

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
