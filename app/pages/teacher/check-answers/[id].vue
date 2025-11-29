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
        </CardContent>
      </Card>

      <!-- Test Sections Tabs -->
      <Tabs default-value="listening" class="w-full">
        <TabsList class="grid w-full grid-cols-4">
          <TabsTrigger value="listening" class="flex items-center gap-2">
            <Headphones class="h-4 w-4" />
            <span>Listening</span>
          </TabsTrigger>
          <TabsTrigger value="reading" class="flex items-center gap-2">
            <BookOpen class="h-4 w-4" />
            <span>Reading</span>
          </TabsTrigger>
          <TabsTrigger value="writing" class="flex items-center gap-2">
            <PenTool class="h-4 w-4" />
            <span>Writing</span>
          </TabsTrigger>
          <TabsTrigger value="speaking" class="flex items-center gap-2">
            <Mic class="h-4 w-4" />
            <span>Speaking</span>
          </TabsTrigger>
        </TabsList>

        <!-- Listening Tab -->
        <TabsContent value="listening">
          <ListeningAnswers
            v-if="assignment.answersComparison?.listening"
            :answersComparison="assignment.answersComparison.listening"
            :listeningFinal="assignment.listening_final"
          />
          <Card v-else>
            <CardContent class="py-8">
              <p class="text-center text-muted-foreground">
                No listening answers available
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Reading Tab -->
        <TabsContent value="reading">
          <ReadingAnswers
            v-if="assignment.answersComparison?.reading"
            :answersComparison="assignment.answersComparison.reading"
            :readingFinal="assignment.reading_final"
          />
          <Card v-else>
            <CardContent class="py-8">
              <p class="text-center text-muted-foreground">
                No reading answers available
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Writing Tab -->
        <TabsContent value="writing">
          <WritingChecker
            v-if="assignment.candidate_id && assignment.test_results?.writing"
            :candidateId="assignment.candidate_id"
            :writingResults="assignment.test_results.writing"
            :centerId="centerId"
            :writingFinal="assignment.writing_final || {}"
          />
          <Card v-else>
            <CardContent class="py-8">
              <p class="text-center text-muted-foreground">
                No writing answers available
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Speaking Tab -->
        <TabsContent value="speaking">
          <SpeakingChecker
            v-if="assignment.candidate_id"
            :candidateId="assignment.candidate_id"
            :centerId="centerId"
            :speakingFinal="assignment.speaking_final || {}"
          />
          <Card v-else>
            <CardContent class="py-8">
              <p class="text-center text-muted-foreground">
                No speaking data available
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <p class="text-lg text-muted-foreground">Assignment not found</p>
      <Button @click="$router.back()" class="mt-4">Go Back</Button>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowLeft,
  CheckCircle,
  Bell,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
} from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import ListeningAnswers from "@/components/check-answers/ListeningAnswers.vue";
import ReadingAnswers from "@/components/check-answers/ReadingAnswers.vue";
import WritingChecker from "@/components/check-answers/WritingChecker.vue";
import SpeakingChecker from "@/components/check-answers/SpeakingChecker.vue";

definePageMeta({
  layout: "teacher",
  middleware: ["auth"],
});

useHead({
  title: "Check Answers - Mockmee LMS",
});

const route = useRoute();
const assignmentId = route.params.id;
const authStore = useAuthStore();

const assignment = ref(null);
const isLoading = ref(true);
const isAutoGrading = ref(false);
const isNotifying = ref(false);

const centerId = computed(() => authStore.user?.center_id);

// Fetch assignment details
const fetchAssignment = async () => {
  try {
    isLoading.value = true;
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

// Load assignment on mount
onMounted(() => {
  fetchAssignment();
});
</script>
