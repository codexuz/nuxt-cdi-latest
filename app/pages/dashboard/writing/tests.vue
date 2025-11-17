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
                Writing Tests
              </h1>
              <p class="text-xs sm:text-sm text-muted-foreground mt-1">
                Browse and manage writing tests
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

      <!-- Writing Tests List -->
      <div v-else class="grid grid-cols-1 gap-4">
        <Card
          v-for="writingTest in writingTests"
          :key="writingTest.id"
          class="hover:shadow-lg transition-shadow"
        >
          <CardHeader>
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <CardTitle>{{ writingTest.title }}</CardTitle>
                <CardDescription v-if="writingTest.description" class="mt-2">
                  {{ writingTest.description }}
                </CardDescription>
              </div>
              <Badge v-if="writingTest.for_cdi" variant="default">CDI</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <!-- Stats -->
              <div
                class="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-muted-foreground"
              >
                <div class="flex items-center gap-2">
                  <PenTool class="h-4 w-4" />
                  <span>{{ writingTest.tasks?.length || 0 }} Tasks</span>
                </div>
                <div
                  v-if="calculateTotalTime(writingTest.tasks)"
                  class="flex items-center gap-2"
                >
                  <Clock class="h-4 w-4" />
                  <span
                    >{{ calculateTotalTime(writingTest.tasks) }} minutes</span
                  >
                </div>
                <div
                  v-if="calculateTotalWords(writingTest.tasks)"
                  class="flex items-center gap-2"
                >
                  <FileText class="h-4 w-4" />
                  <span
                    >{{ calculateTotalWords(writingTest.tasks) }} words
                    min</span
                  >
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  @click="
                    navigateTo(
                      `/dashboard/test-builder/writing?test_id=${writingTest.test_id}`
                    )
                  "
                >
                  <Edit class="mr-2 h-3 w-3" />
                  <span class="hidden sm:inline">Edit Writing Test</span>
                  <span class="sm:hidden">Edit</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  @click="deleteWritingTest(writingTest.id)"
                  class="text-destructive"
                >
                  <Trash2 class="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Empty State -->
        <Card v-if="writingTests.length === 0" class="text-center py-12">
          <CardContent>
            <PenTool class="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 class="text-lg font-semibold mb-2">No writing tests found</h3>
            <p class="text-muted-foreground mb-4">
              Create your first writing test to get started
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
  PenTool,
  Edit,
  Trash2,
  Clock,
  FileText,
} from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "Writing Tests - Testify",
});

const writingTests = ref([]);
const isLoading = ref(false);

// Calculate total time for tasks
const calculateTotalTime = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  return tasks.reduce((total, task) => total + (task.time_minutes || 0), 0);
};

// Calculate total words for tasks
const calculateTotalWords = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  return tasks.reduce((total, task) => total + (task.min_words || 0), 0);
};

// Fetch writing tests from API
const fetchWritingTests = async () => {
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
      `${baseURL}/ielts/centers/${activeCenter.value.id}/writing`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    writingTests.value = response;
  } catch (error) {
    console.error("Failed to fetch writing tests:", error);
    toast.error("Failed to load writing tests");
  } finally {
    isLoading.value = false;
  }
};

// Delete writing test
const deleteWritingTest = async (writingTestId) => {
  if (
    !confirm(
      "Are you sure you want to delete this writing test? This action cannot be undone."
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
      `${baseURL}/ielts/centers/${activeCenter.value.id}/writing/${writingTestId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    console.log("Writing test deleted:", writingTestId);

    writingTests.value = writingTests.value.filter(
      (t) => t.id !== writingTestId
    );

    toast.success("Writing test deleted successfully!");
  } catch (error) {
    console.error("Failed to delete writing test:", error);
    toast.error(error.data?.message || "Failed to delete writing test");
  }
};

// Load writing tests on mount
onMounted(() => {
  fetchWritingTests();
});

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>
