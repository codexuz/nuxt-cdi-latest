<template>
  <div class="container mx-auto px-4 py-8">
    <Toaster position="top-center" richColors theme="system" />

    <!-- Header -->
    <div class="w-full mb-8">
        <div class="flex items-center w-full justify-between gap-2 mb-4">
          <Button variant="ghost" @click="$router.back()">
            <ArrowLeft class="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            @click="notifyStudent"
            :disabled="isNotifying"
            class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Bell class="mr-2 h-4 w-4" />
            <span v-if="isNotifying">Sending...</span>
            <span v-else>Notify Student</span>
          </Button>
        </div>
        <h1 class="text-3xl font-bold">Check Answers</h1>
        <p class="text-muted-foreground">Review student test submission</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <!-- Assignment Details -->
    <div v-else-if="assignment" class="space-y-6">
      <!-- Student & Test Info Card -->
      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted-foreground">Student</p>
              <p class="font-medium">{{ assignment.student?.name || "N/A" }}</p>
              <p class="text-sm text-muted-foreground">
                {{ assignment.student?.email || "" }}
              </p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Test</p>
              <p class="font-medium">{{ assignment.test?.title || "N/A" }}</p>
              <Badge variant="outline" class="mt-1">
                {{ formatTestType(assignment.test?.test_type) }}
              </Badge>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Candidate ID</p>
              <p class="font-medium">{{ assignment.candidate_id || "N/A" }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Status</p>
              <Badge :variant="getStatusVariant(assignment.status)">
                {{ assignment.status || "Pending" }}
              </Badge>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Start Time</p>
              <p class="font-medium">
                {{ formatDateTime(assignment.test_start_time) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">End Time</p>
              <p class="font-medium">
                {{ formatDateTime(assignment.test_end_time) }}
              </p>
            </div>
            <div v-if="assignment.notes" class="md:col-span-2">
              <p class="text-sm text-muted-foreground">Notes</p>
              <p class="font-medium">{{ assignment.notes }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Auto Grade Button -->
      <Card>
        <CardHeader>
          <CardTitle>Auto Grading</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">
            Automatically grade Listening and Reading sections based on answer
            keys
          </p>
          <Button
            @click="autoGrade"
            :disabled="isAutoGrading"
            class="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <CheckCircle class="mr-2 h-4 w-4" />
            <span v-if="isAutoGrading">Auto Grading...</span>
            <span v-else>Auto Grade</span>
          </Button>

          <!-- Grading Results -->
          <div
            v-if="assignment.listening_final || assignment.reading_final"
            class="space-y-4 pt-4 border-t"
          >
            <h4 class="font-semibold text-sm">Grading Results</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Listening Results -->
              <div
                v-if="assignment.listening_final"
                class="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg space-y-2"
              >
                <div class="flex items-center justify-between">
                  <h5 class="font-semibold text-blue-700 dark:text-blue-400">
                    Listening
                  </h5>
                  <Badge variant="default" class="bg-blue-600">
                    Band {{ assignment.listening_final.score }}
                  </Badge>
                </div>
                <div class="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p class="text-muted-foreground">Correct</p>
                    <p class="font-semibold text-green-600">
                      {{ assignment.listening_final.correct }}
                    </p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Incorrect</p>
                    <p class="font-semibold text-red-600">
                      {{ assignment.listening_final.incorrect }}
                    </p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Total</p>
                    <p class="font-semibold">
                      {{ assignment.listening_final.totalQuestions }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Reading Results -->
              <div
                v-if="assignment.reading_final"
                class="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg space-y-2"
              >
                <div class="flex items-center justify-between">
                  <h5
                    class="font-semibold text-purple-700 dark:text-purple-400"
                  >
                    Reading
                  </h5>
                  <Badge variant="default" class="bg-purple-600">
                    Band {{ assignment.reading_final.score }}
                  </Badge>
                </div>
                <div class="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p class="text-muted-foreground">Correct</p>
                    <p class="font-semibold text-green-600">
                      {{ assignment.reading_final.correct }}
                    </p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Incorrect</p>
                    <p class="font-semibold text-red-600">
                      {{ assignment.reading_final.incorrect }}
                    </p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Total</p>
                    <p class="font-semibold">
                      {{ assignment.reading_final.totalQuestions }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Writing Answers Section -->
      <Card v-if="writingAnswers && writingAnswers.length > 0">
        <CardHeader>
          <CardTitle>Writing Answers</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Task 1 -->
          <div v-if="writingAnswers[0]" class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Task 2</h3>
              <Badge variant="outline">
                Word Count: {{ writingAnswers[0].word_count || 0 }}
              </Badge>
            </div>
            <div class="bg-muted/50 p-4 rounded-lg">
              <p class="whitespace-pre-wrap">
                {{ writingAnswers[0].task_1_answer || "No answer provided" }}
              </p>
            </div>
            <div class="space-y-2">
              <Label for="task1Score">Task 2 Score</Label>
              <Input
                id="task1Score"
                v-model.number="writingScores.task1Score"
                type="number"
                min="0"
                max="9"
                step="0.5"
                placeholder="Enter score (0-9)"
              />
            </div>
          </div>

          <Separator />

          <!-- Task 2 -->
          <div v-if="writingAnswers[1]" class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Task 1</h3>
              <Badge variant="outline">
                Word Count: {{ writingAnswers[1].word_count || 0 }}
              </Badge>
            </div>
            <div class="bg-muted/50 p-4 rounded-lg">
              <p class="whitespace-pre-wrap">
                {{ writingAnswers[1].task_2_answer || "No answer provided" }}
              </p>
            </div>
            <div class="space-y-2">
              <Label for="task2Score">Task 1 Score</Label>
              <Input
                id="task2Score"
                v-model.number="writingScores.task2Score"
                type="number"
                min="0"
                max="9"
                step="0.5"
                placeholder="Enter score (0-9)"
              />
            </div>
          </div>

          <Separator />

          <!-- Feedback -->
          <div class="space-y-2">
            <Label for="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              v-model="writingScores.feedback"
              placeholder="Provide detailed feedback for the student..."
              rows="5"
            />
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <Button
              @click="submitWritingScores"
              :disabled="isSubmittingWriting"
              class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <span v-if="isSubmittingWriting">Submitting...</span>
              <span v-else>Submit Writing Scores</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- No Writing Answers -->
      <Card v-else>
        <CardHeader>
          <CardTitle>Writing Answers</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground">No writing answers submitted yet</p>
        </CardContent>
      </Card>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <p class="text-lg text-muted-foreground">Assignment not found</p>
      <Button @click="$router.back()" class="mt-4">Go Back</Button>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, CheckCircle, Bell } from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

definePageMeta({
  layout: "teacher",
  middleware: ["auth"],
});

useHead({
  title: "Check Answers - Mockmee LMS",
});

const route = useRoute();
const assignmentId = route.params.id;

const assignment = ref(null);
const isLoading = ref(true);
const isAutoGrading = ref(false);
const isSubmittingWriting = ref(false);
const isNotifying = ref(false);

const writingScores = ref({
  task1Score: null,
  task2Score: null,
  feedback: "",
});

const writingAnswers = computed(() => {
  return assignment.value?.test_results?.writing?.answers || [];
});

// Fetch assignment details
const fetchAssignment = async () => {
  try {
    isLoading.value = true;
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    if (!authStore.user?.center_id) {
      toast.error("No center found for user");
      return;
    }

    const response = await $fetch(
      `${baseURL}/student-tests/centers/${authStore.user.center_id}/assignments/${assignmentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    assignment.value = response;

    // Populate writing scores if already checked
    if (response.writing_final) {
      writingScores.value = {
        task1Score: response.writing_final.task1Score || null,
        task2Score: response.writing_final.task2Score || null,
        feedback: response.writing_final.feedback || "",
      };
    }
  } catch (error) {
    console.error("Failed to fetch assignment:", error);
    toast.error("Failed to load assignment details");
  } finally {
    isLoading.value = false;
  }
};

// Format helpers
const formatTestType = (testType) => {
  const typeMap = {
    ielts_practice: "IELTS Practice",
    ielts_mock: "IELTS Mock",
    cefr_practice: "CEFR Practice",
    cefr_mock: "CEFR Mock",
  };
  return typeMap[testType] || testType;
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "-";
  const date = new Date(dateTimeString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusVariant = (status) => {
  const statusMap = {
    pending: "secondary",
    in_progress: "default",
    completed: "success",
    expired: "destructive",
  };
  return statusMap[status?.toLowerCase()] || "secondary";
};

// Auto grade listening and reading
const autoGrade = async () => {
  try {
    isAutoGrading.value = true;
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    if (!authStore.user?.center_id || !assignment.value?.candidate_id) {
      toast.error("Missing required information");
      return;
    }

    await $fetch(
      `${baseURL}/student-tests/centers/${authStore.user.center_id}/auto-grade/${assignment.value.candidate_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    toast.success("Auto grading completed successfully!");
    // Refresh assignment to get updated scores
    await fetchAssignment();
  } catch (error) {
    console.error("Failed to auto grade:", error);
    toast.error(error.data?.message || "Failed to auto grade");
  } finally {
    isAutoGrading.value = false;
  }
};

// Notify student
const notifyStudent = async () => {
  try {
    isNotifying.value = true;
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    if (!authStore.user?.center_id || !assignment.value?.candidate_id) {
      toast.error("Missing required information");
      return;
    }

    await $fetch(
      `${baseURL}/student-tests/centers/${authStore.user.center_id}/send-results/${assignment.value.candidate_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    toast.success("Student notified successfully!");
  } catch (error) {
    console.error("Failed to notify student:", error);
    toast.error(error.data?.message || "Failed to notify student");
  } finally {
    isNotifying.value = false;
  }
};

// Submit writing scores
const submitWritingScores = async () => {
  if (!writingScores.value.task1Score && !writingScores.value.task2Score) {
    toast.error("Please enter at least one score");
    return;
  }

  try {
    isSubmittingWriting.value = true;
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    if (!authStore.user?.center_id || !assignment.value?.candidate_id) {
      toast.error("Missing required information");
      return;
    }

    const payload = {
      task1Score: writingScores.value.task1Score || undefined,
      task2Score: writingScores.value.task2Score || undefined,
      feedback: writingScores.value.feedback || undefined,
    };

    await $fetch(
      `${baseURL}/student-tests/centers/${authStore.user.center_id}/check-writing/${assignment.value.candidate_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );

    toast.success("Writing scores submitted successfully!");
    // Reset form
    writingScores.value = {
      task1Score: null,
      task2Score: null,
      feedback: "",
    };
    // Refresh assignment
    await fetchAssignment();
  } catch (error) {
    console.error("Failed to submit writing scores:", error);
    toast.error(error.data?.message || "Failed to submit writing scores");
  } finally {
    isSubmittingWriting.value = false;
  }
};

// Load assignment on mount
onMounted(() => {
  fetchAssignment();
});
</script>
