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
                Writing Test Builder
              </h1>
              <p class="text-xs sm:text-sm text-muted-foreground mt-1">
                Design and configure writing test tasks
              </p>
            </div>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <Button
              @click="createWritingTest"
              :disabled="!isFormValid || isLoading"
              class="flex-1 sm:flex-none"
              size="default"
            >
              <Save v-if="!isLoading" class="mr-2 h-4 w-4" />
              <div
                v-else
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
              ></div>
              <span class="hidden sm:inline">{{
                isLoading ? "Saving..." : "Save Test"
              }}</span>
              <span class="sm:hidden">{{
                isLoading ? "Saving..." : "Save"
              }}</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Writing Test Form -->
      <Card class="mb-6 sm:mb-8 shadow-sm border-2">
        <CardHeader class="bg-muted/50">
          <CardTitle class="text-lg flex items-center gap-2">
            <div class="h-2 w-2 rounded-full bg-primary"></div>
            Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent class="pt-6">
          <!-- Loading State -->
          <div v-if="isFetching" class="flex justify-center py-12">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
            ></div>
          </div>

          <div v-else class="space-y-6">
            <!-- Basic Info -->
            <div class="space-y-4">
              <h3 class="font-semibold text-lg">Basic Information</h3>
              <div class="space-y-2">
                <Label for="title">Test Title</Label>
                <Input
                  id="title"
                  v-model="newWritingTest.title"
                  placeholder="e.g., IELTS Writing Test - Academic Module"
                />
              </div>
              <div class="space-y-2">
                <Label for="description">Description</Label>
                <Textarea
                  id="description"
                  v-model="newWritingTest.description"
                  placeholder="A comprehensive writing test with Task 1 and Task 2..."
                  rows="3"
                />
              </div>
            </div>

            <!-- Task 1 -->
            <div class="space-y-4 border-t pt-6">
              <h3 class="font-semibold text-lg">Task 1</h3>
              <div class="space-y-2">
                <Label for="task1_type">Task Type</Label>
                <Select v-model="newWritingTest.tasks[0].task_type">
                  <SelectTrigger id="task1_type">
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic_task_1"
                      >Academic Task 1</SelectItem
                    >
                    <SelectItem value="general_task_1"
                      >General Task 1</SelectItem
                    >
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="task1_prompt">Prompt</Label>
                <Textarea
                  id="task1_prompt"
                  v-model="newWritingTest.tasks[0].prompt"
                  placeholder="The chart shows the percentage of households..."
                  rows="4"
                />
              </div>
              <div class="space-y-2">
                <Label for="task1_visual">Visual URL (Optional)</Label>
                <Input
                  id="task1_visual"
                  v-model="newWritingTest.tasks[0].visual_url"
                  placeholder="https://example.com/images/chart.png"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="task1_min_words">Minimum Words</Label>
                  <Input
                    id="task1_min_words"
                    v-model.number="newWritingTest.tasks[0].min_words"
                    type="number"
                    placeholder="150"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="task1_time">Time (minutes)</Label>
                  <Input
                    id="task1_time"
                    v-model.number="newWritingTest.tasks[0].time_minutes"
                    type="number"
                    placeholder="20"
                  />
                </div>
              </div>
            </div>

            <!-- Task 2 -->
            <div class="space-y-4 border-t pt-6">
              <h3 class="font-semibold text-lg">Task 2</h3>
              <div class="space-y-2">
                <Label for="task2_prompt">Prompt</Label>
                <Textarea
                  id="task2_prompt"
                  v-model="newWritingTest.tasks[1].prompt"
                  placeholder="Some people believe that technology has made our lives more complicated..."
                  rows="4"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="task2_min_words">Minimum Words</Label>
                  <Input
                    id="task2_min_words"
                    v-model.number="newWritingTest.tasks[1].min_words"
                    type="number"
                    placeholder="250"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="task2_time">Time (minutes)</Label>
                  <Input
                    id="task2_time"
                    v-model.number="newWritingTest.tasks[1].time_minutes"
                    type="number"
                    placeholder="40"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { Save, ArrowLeft } from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "Writing Test Builder - Testify",
});

const route = useRoute();
const testId = computed(() => route.query.test_id);

const newWritingTest = ref({
  title: "",
  description: "",
  test_id: testId.value || "",
  tasks: [
    {
      task: "TASK_1",
      task_type: "academic_task_1",
      prompt: "",
      visual_url: "",
      min_words: 150,
      time_minutes: 20,
    },
    {
      task: "TASK_2",
      task_type: "task_2",
      prompt: "",
      min_words: 250,
      time_minutes: 40,
    },
  ],
});

const isLoading = ref(false);
const isFetching = ref(false);

// Fetch existing writing test
const fetchWritingTest = async () => {
  if (!testId.value) return;

  try {
    isFetching.value = true;
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
      `${baseURL}/ielts/centers/${activeCenter.value.id}/tests/${testId.value}/writing`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    // If writing test exists, populate the form
    if (response && response.tasks) {
      newWritingTest.value = {
        title: response.title || "",
        description: response.description || "",
        test_id: testId.value,
        tasks: response.tasks.map((task) => ({
          task: task.task,
          task_type: task.task_type,
          prompt: task.prompt || "",
          visual_url: task.visual_url || "",
          min_words: task.min_words || (task.task === "TASK_1" ? 150 : 250),
          time_minutes: task.time_minutes || (task.task === "TASK_1" ? 20 : 40),
        })),
      };
    }
  } catch (error) {
    // If 404, it means no writing test exists yet, which is fine
    if (error.status !== 404) {
      console.error("Failed to fetch writing test:", error);
      toast.error("Failed to load writing test");
    }
  } finally {
    isFetching.value = false;
  }
};

// Load writing test on mount if testId exists
onMounted(() => {
  if (testId.value) {
    fetchWritingTest();
  }
});

const isFormValid = computed(() => {
  return (
    newWritingTest.value.title &&
    newWritingTest.value.tasks[0].prompt &&
    newWritingTest.value.tasks[1].prompt
  );
});

const createWritingTest = async () => {
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

    const payload = {
      title: newWritingTest.value.title,
      description: newWritingTest.value.description,
      for_cdi: false,
      test_id: testId.value || newWritingTest.value.test_id,
      tasks: newWritingTest.value.tasks.map((task) => ({
        task: task.task,
        task_type: task.task_type,
        prompt: task.prompt,
        visual_url: task.visual_url || undefined,
        min_words: task.min_words,
        time_minutes: task.time_minutes,
      })),
    };

    const response = await $fetch(
      `${baseURL}/ielts/centers/${activeCenter.value.id}/writing`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );

    console.log("Writing test created:", response);

    toast.success("Writing test created successfully!");

    // Navigate back to test builder after success
    setTimeout(() => {
      navigateTo("/dashboard/test-builder");
    }, 1500);
  } catch (error) {
    console.error("Failed to create writing test:", error);
    toast.error(error.data?.message || "Failed to create writing test");
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>
