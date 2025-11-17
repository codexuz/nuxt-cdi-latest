<template>
  <div class="min-h-screen bg-gradient-to-b from-muted/30 to-background">
    <div class="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
      <Toaster position="top-center" richColors theme="system" />

      <!-- Header -->
      <div class="bg-card border rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div class="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              @click="$router.back()"
              class="shrink-0 hover:bg-muted"
            >
              <ArrowLeft class="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div>
              <h1
                class="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight"
              >
                Listening Tests
              </h1>
              <p class="text-xs sm:text-sm text-muted-foreground mt-1">
                Browse and manage listening tests
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        ></div>
      </div>

      <!-- Listening Tests List -->
      <div v-else class="grid grid-cols-1 gap-4">
        <Card
          v-for="listeningTest in listeningTests"
          :key="listeningTest.id"
          class="hover:shadow-lg transition-shadow"
        >
          <CardHeader>
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <CardTitle>{{ listeningTest.title }}</CardTitle>
                <CardDescription v-if="listeningTest.description" class="mt-2">
                  {{ listeningTest.description }}
                </CardDescription>
              </div>
              <Badge v-if="listeningTest.for_cdi" variant="default">CDI</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <!-- Stats -->
              <div
                class="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-muted-foreground"
              >
                <div class="flex items-center gap-2">
                  <Headphones class="h-4 w-4" />
                  <span>{{ listeningTest.parts?.length || 0 }} Parts</span>
                </div>
                <div
                  v-if="listeningTest.total_questions"
                  class="flex items-center gap-2"
                >
                  <FileQuestion class="h-4 w-4" />
                  <span>{{ listeningTest.total_questions }} Questions</span>
                </div>
                <div
                  v-if="listeningTest.audio_url"
                  class="flex items-center gap-2"
                >
                  <Volume2 class="h-4 w-4" />
                  <span>Audio Available</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  @click="
                    navigateTo(
                      `/dashboard/test-builder/listening?test_id=${listeningTest.test_id}`
                    )
                  "
                >
                  <Edit class="mr-2 h-3 w-3" />
                  <span class="hidden sm:inline">Edit Listening Test</span>
                  <span class="sm:hidden">Edit</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  @click="deleteListeningTest(listeningTest.id)"
                  class="text-destructive"
                >
                  <Trash2 class="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Empty State -->
        <Card v-if="listeningTests.length === 0" class="text-center py-12">
          <CardContent>
            <Headphones class="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 class="text-lg font-semibold mb-2">No listening tests found</h3>
            <p class="text-muted-foreground mb-4">
              Create your first listening test to get started
            </p>
            <Button @click="$router.back()">
              <ArrowLeft class="mr-2 h-4 w-4" />
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowLeft,
  Headphones,
  Edit,
  Trash2,
  FileQuestion,
  Volume2,
} from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "Listening Tests - Testify",
});

const listeningTests = ref([]);
const isLoading = ref(false);

// Fetch listening tests from API
const fetchListeningTests = async () => {
  try {
    isLoading.value = true;
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    // Get active center
    const { activeCenter } = useCenters();

    if (!activeCenter.value?.id) {
      toast.error("No active center found");
      return;
    }

    const response = await $fetch(
      `${baseURL}/ielts/centers/${activeCenter.value.id}/listening`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    listeningTests.value = response;
  } catch (error) {
    console.error("Failed to fetch listening tests:", error);
    toast.error("Failed to load listening tests");
  } finally {
    isLoading.value = false;
  }
};

// Delete listening test
const deleteListeningTest = async (listeningTestId) => {
  if (
    !confirm(
      "Are you sure you want to delete this listening test? This action cannot be undone."
    )
  ) {
    return;
  }

  try {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    // Get active center
    const { activeCenter } = useCenters();

    if (!activeCenter.value?.id) {
      toast.error("No active center found");
      return;
    }

    await $fetch(
      `${baseURL}/ielts/centers/${activeCenter.value.id}/listening/${listeningTestId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    console.log("Listening test deleted:", listeningTestId);

    listeningTests.value = listeningTests.value.filter(
      (t) => t.id !== listeningTestId
    );

    toast.success("Listening test deleted successfully!");
  } catch (error) {
    console.error("Failed to delete listening test:", error);
    toast.error(error.data?.message || "Failed to delete listening test");
  }
};

// Load listening tests on mount
onMounted(() => {
  fetchListeningTests();
});

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>
