<template>
  <motion.div
    class="container mx-auto px-4 py-8"
    :initial="{ opacity: 0, y: 20 }"
    :transition="{ duration: 0.6, ease: 'easeOut' }"
    :animate="{ opacity: 1, y: 0 }"
  >
    <Toaster position="top-center" richColors theme="system" />

    <!-- Header -->
    <motion.div
      class="flex items-center justify-between mb-8"
      :initial="{ opacity: 0, y: -10 }"
      :transition="{ duration: 0.5, delay: 0.1 }"
      :animate="{ opacity: 1, y: 0 }"
    >
      <div>
        <h1 class="text-3xl font-bold">Assign Tests</h1>
        <p class="text-muted-foreground">Manage student test assignments</p>
      </div>
      <Button @click="openAssignDialog">
        <Plus class="mr-2 h-4 w-4" />
        Assign Test
      </Button>
    </motion.div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <!-- Assignments Table -->
    <motion.div
      v-else
      class="bg-white dark:bg-zinc-900 rounded-lg border"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }"
    >
      <!-- Search and Filters -->
      <div class="p-4 border-b space-y-4">
        <div class="flex gap-4 flex-col md:flex-row">
          <!-- Search by Student/Candidate ID -->
          <div class="flex-1 relative">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              type="text"
              placeholder="Search by student name, email, or candidate ID..."
              class="pl-9"
            />
          </div>

          <!-- Test Filter -->
          <Select v-model="selectedTestFilter">
            <SelectTrigger class="w-full md:w-48">
              <SelectValue placeholder="All Tests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tests</SelectItem>
              <SelectItem v-for="test in tests" :key="test.id" :value="test.id">
                {{ test.title }}
              </SelectItem>
            </SelectContent>
          </Select>

          <!-- Status Filter -->
          <Select v-model="selectedStatusFilter">
            <SelectTrigger class="w-full md:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredAssignments.length === 0" class="text-center py-12">
        <FileQuestion class="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 class="text-lg font-semibold mb-2">No assignments yet</h3>
        <p class="text-muted-foreground mb-4">
          Start assigning tests to your students
        </p>
        <Button @click="openAssignDialog">
          <Plus class="mr-2 h-4 w-4" />
          Assign Test
        </Button>
      </div>

      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <p class="text-sm text-muted-foreground px-4 py-2">
          Showing {{ paginatedAssignments.length }} of
          {{ filteredAssignments.length }} assignments
        </p>
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 text-sm font-medium">
                Candidate ID
              </th>
              <th class="text-left py-3 px-4 text-sm font-medium">Student</th>
              <th class="text-left py-3 px-4 text-sm font-medium">Test</th>
              <th class="text-left py-3 px-4 text-sm font-medium">
                Start Time
              </th>
              <th class="text-left py-3 px-4 text-sm font-medium">End Time</th>
              <th class="text-left py-3 px-4 text-sm font-medium">Status</th>
              <th class="text-center py-3 px-4 text-sm font-medium">Scoring</th>
              <th class="text-left py-3 px-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="assignment in paginatedAssignments"
              :key="assignment.id"
              class="hover:bg-gray-50 dark:hover:bg-zinc-950"
            >
              <td class="py-4 px-4">
                <button
                  v-if="assignment.candidate_id"
                  @click="copyCandidateId(assignment.candidate_id)"
                  class="font-medium text-sm text-primary hover:underline cursor-pointer flex items-center gap-2 transition-colors"
                  :title="'Click to copy: ' + assignment.candidate_id"
                >
                  <span>{{ assignment.candidate_id }}</span>
                  <Copy class="h-3 w-3" />
                </button>
                <span v-else class="font-medium text-sm text-muted-foreground"
                  >-</span
                >
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center space-x-3">
                  <Avatar class="h-8 w-8">
                    <AvatarFallback class="text-xs">
                      {{ getInitials(assignment.student?.name) }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="font-medium text-sm">
                      {{ assignment.student?.name || "N/A" }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ assignment.student?.email || "" }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4">
                <p class="font-medium text-sm">
                  {{ assignment.test?.title || "N/A" }}
                </p>
                <Badge variant="outline" class="text-xs mt-1">
                  {{ formatTestType(assignment.test?.test_type) }}
                </Badge>
              </td>
              <td class="py-4 px-4 text-sm">
                {{ formatDateTime(assignment.test_start_time) }}
              </td>
              <td class="py-4 px-4 text-sm">
                {{ formatDateTime(assignment.test_end_time) }}
              </td>
              <td class="py-4 px-4">
                <Badge :variant="getStatusVariant(assignment.status)">
                  {{ assignment.status || "Pending" }}
                </Badge>
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center justify-center">
                  <CheckCircle
                    v-if="isScoringComplete(assignment)"
                    class="h-5 w-5 text-green-600 dark:text-green-400"
                    title="Scoring completed"
                  />
                  <Hourglass
                    v-else
                    class="h-5 w-5 text-amber-500 dark:text-amber-400"
                    title="Waiting for scoring"
                  />
                </div>
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="
                      $router.push(`/teacher/check-answers/${assignment.id}`)
                    "
                    class="h-8 w-8"
                    title="Check Answers"
                  >
                    <Eye class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="editAssignment(assignment)"
                    class="h-8 w-8"
                    title="Edit Assignment"
                  >
                    <Edit class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="deleteAssignment(assignment.id)"
                    class="h-8 w-8"
                    title="Delete Assignment"
                  >
                    <Trash2 class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>

    <!-- Pagination -->
    <Pagination
      v-slot="{ page }"
      :total="filteredTotalAssignments"
      :sibling-count="1"
      :default-page="currentPage"
      :items-per-page="itemsPerPage"
      show-edges
      @update:page="handlePageChange"
      class="flex justify-center mt-8"
    >
      <PaginationContent v-slot="{ items }">
        <PaginationFirst />
        <PaginationPrevious />
        <template v-for="(item, index) in items" :key="index">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === page"
          >
            {{ item.value }}
          </PaginationItem>
          <PaginationEllipsis v-else :index="index" />
        </template>
        <PaginationNext />
        <PaginationLast />
      </PaginationContent>
    </Pagination>

    <!-- Assign Test Dialog -->
    <Dialog v-model:open="showAssignDialog">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Test to Student</DialogTitle>
          <DialogDescription>
            Select a student and test, then set the test schedule
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="student">Student</Label>
            <Input
              id="student"
              v-model="studentSearchQuery"
              placeholder="Search student by name or email..."
              class="mb-2"
            />
            <Select v-model="newAssignment.student_id">
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="student in filteredStudents"
                  :key="student.id"
                  :value="student.id"
                >
                  {{ student.name }} ({{ student.email }})
                </SelectItem>
              </SelectContent>
            </Select>
            <p
              v-if="filteredStudents.length === 0"
              class="text-xs text-muted-foreground mt-1"
            >
              No students found
            </p>
          </div>

          <div class="space-y-2">
            <Label for="test">Test</Label>
            <Input
              id="test"
              v-model="testSearchQuery"
              placeholder="Search test by title..."
              class="mb-2"
            />
            <Select v-model="newAssignment.test_id">
              <SelectTrigger>
                <SelectValue placeholder="Select test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="test in filteredTests"
                  :key="test.id"
                  :value="test.id"
                >
                  {{ test.title }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p
              v-if="filteredTests.length === 0"
              class="text-xs text-muted-foreground mt-1"
            >
              No tests found
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="start_time">Start Time</Label>
              <Input
                id="start_time"
                v-model="newAssignment.test_start_time"
                type="datetime-local"
              />
            </div>
            <div class="space-y-2">
              <Label for="end_time">End Time</Label>
              <Input
                id="end_time"
                v-model="newAssignment.test_end_time"
                type="datetime-local"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              v-model="newAssignment.notes"
              placeholder="Any special instructions or notes..."
              rows="3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showAssignDialog = false">
            Cancel
          </Button>
          <Button
            @click="assignTest"
            :disabled="!isAssignmentValid || isAssigning"
          >
            <span v-if="isAssigning">Assigning...</span>
            <span v-else>Assign Test</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit Assignment Dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>
            Update test schedule and notes
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Student</Label>
            <Input
              :value="editingAssignment.student?.name || 'N/A'"
              disabled
              class="bg-muted"
            />
          </div>

          <div class="space-y-2">
            <Label>Test</Label>
            <Input
              :value="editingAssignment.test?.title || 'N/A'"
              disabled
              class="bg-muted"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit_start_time">Start Time</Label>
              <Input
                id="edit_start_time"
                v-model="editingAssignment.test_start_time"
                type="datetime-local"
              />
            </div>
            <div class="space-y-2">
              <Label for="edit_end_time">End Time</Label>
              <Input
                id="edit_end_time"
                v-model="editingAssignment.test_end_time"
                type="datetime-local"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="edit_status">Status</Label>
            <Select v-model="editingAssignment.status">
              <SelectTrigger id="edit_status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="edit_notes">Notes (Optional)</Label>
            <Textarea
              id="edit_notes"
              v-model="editingAssignment.notes"
              placeholder="Any special instructions or notes..."
              rows="3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showEditDialog = false">
            Cancel
          </Button>
          <Button
            @click="updateAssignment"
            :disabled="!isEditValid || isUpdating"
          >
            <span v-if="isUpdating">Updating...</span>
            <span v-else>Update Assignment</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";
import {
  Plus,
  Trash2,
  FileQuestion,
  Edit,
  Copy,
  Eye,
  Search,
  X,
  ChevronDown,
  CheckCircle,
  Hourglass,
} from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

useHead({
  title: "Assign Tests - Mockmee LMS",
});

const showAssignDialog = ref(false);
const showEditDialog = ref(false);
const assignments = ref([]);
const students = ref([]);
const tests = ref([]);
const isLoading = ref(false);
const isAssigning = ref(false);
const isUpdating = ref(false);

// Search and filter state
const searchQuery = ref("");
const selectedTestFilter = ref("");
const selectedStatusFilter = ref("");

// Modal search state
const studentSearchQuery = ref("");
const testSearchQuery = ref("");

const editingAssignment = ref({
  id: "",
  student: null,
  test: null,
  test_start_time: "",
  test_end_time: "",
  status: "",
  notes: "",
});

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalAssignments = computed(() => assignments.value.length);
const totalPages = computed(() =>
  Math.ceil(totalAssignments.value / itemsPerPage.value)
);

// Filtered assignments
const filteredAssignments = computed(() => {
  let filtered = assignments.value;

  // Filter by search query (student name, email, or candidate ID)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((assignment) => {
      const candidateId = assignment.candidate_id?.toLowerCase() || "";
      const studentName = assignment.student?.name?.toLowerCase() || "";
      const studentEmail = assignment.student?.email?.toLowerCase() || "";
      return (
        candidateId.includes(query) ||
        studentName.includes(query) ||
        studentEmail.includes(query)
      );
    });
  }

  // Filter by test
  if (selectedTestFilter.value && selectedTestFilter.value !== "all") {
    filtered = filtered.filter(
      (assignment) => assignment.test?.id === selectedTestFilter.value
    );
  }

  // Filter by status
  if (selectedStatusFilter.value && selectedStatusFilter.value !== "all") {
    filtered = filtered.filter(
      (assignment) =>
        assignment.status?.toLowerCase() ===
        selectedStatusFilter.value.toLowerCase()
    );
  }

  return filtered;
});

const filteredTotalAssignments = computed(
  () => filteredAssignments.value.length
);

// Computed property for paginated assignments
const paginatedAssignments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredAssignments.value.slice(start, end);
});

// Filtered students for modal search
const filteredStudents = computed(() => {
  if (!studentSearchQuery.value) {
    return students.value;
  }
  const query = studentSearchQuery.value.toLowerCase();
  return students.value.filter((student) => {
    const name = student.name?.toLowerCase() || "";
    const email = student.email?.toLowerCase() || "";
    return name.includes(query) || email.includes(query);
  });
});

// Filtered tests for modal search
const filteredTests = computed(() => {
  if (!testSearchQuery.value) {
    return tests.value;
  }
  const query = testSearchQuery.value.toLowerCase();
  return tests.value.filter((test) => {
    const title = test.title?.toLowerCase() || "";
    return title.includes(query);
  });
});

// Handle page change
const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const newAssignment = ref({
  student_id: "",
  test_id: "",
  test_start_time: "",
  test_end_time: "",
  notes: "",
});

// Computed validation
const isAssignmentValid = computed(() => {
  return (
    newAssignment.value.student_id &&
    newAssignment.value.test_id &&
    newAssignment.value.test_start_time &&
    newAssignment.value.test_end_time
  );
});

const isEditValid = computed(() => {
  return (
    editingAssignment.value.id &&
    editingAssignment.value.test_start_time &&
    editingAssignment.value.test_end_time
  );
});

// Copy candidate ID to clipboard
const copyCandidateId = async (candidateId) => {
  try {
    await navigator.clipboard.writeText(candidateId);
    toast.success(`Candidate ID copied: ${candidateId}`);
  } catch (error) {
    console.error("Failed to copy:", error);
    toast.error("Failed to copy candidate ID");
  }
};

// Format helpers
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

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

// Check if scoring is complete
const isScoringComplete = (assignment) => {
  const hasWritingScore =
    assignment.writing_final &&
    (assignment.writing_final.task1Score !== undefined ||
      assignment.writing_final.task2Score !== undefined ||
      assignment.writing_final.averageScore !== undefined ||
      assignment.writing_final.feedback);

  const hasSpeakingScore =
    assignment.speaking_final &&
    (assignment.speaking_final.overall !== undefined ||
      assignment.speaking_final.fluencyCoherence !== undefined ||
      assignment.speaking_final.lexicalResource !== undefined ||
      assignment.speaking_final.grammaticalRange !== undefined ||
      assignment.speaking_final.pronunciation !== undefined ||
      assignment.speaking_final.feedback);

  return hasWritingScore && hasSpeakingScore;
};
const fetchAssignments = async () => {
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
      `${baseURL}/student-tests/centers/${authStore.user.center_id}/assignments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    assignments.value = response;
  } catch (error) {
    console.error("Failed to fetch assignments:", error);
    toast.error("Failed to load assignments");
  } finally {
    isLoading.value = false;
  }
};

// Fetch students
const fetchStudents = async () => {
  try {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    if (!authStore.user?.center_id) return;

    const response = await $fetch(
      `${baseURL}/users/students?centerId=${authStore.user.center_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    students.value = response;
  } catch (error) {
    console.error("Failed to fetch students:", error);
  }
};

// Fetch tests
const fetchTests = async () => {
  try {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    if (!authStore.user?.center_id) return;

    const response = await $fetch(
      `${baseURL}/ielts/centers/${authStore.user.center_id}/tests`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    tests.value = response;
  } catch (error) {
    console.error("Failed to fetch tests:", error);
  }
};

// Open assign dialog
const openAssignDialog = () => {
  showAssignDialog.value = true;
  studentSearchQuery.value = "";
  testSearchQuery.value = "";
  if (students.value.length === 0) fetchStudents();
  if (tests.value.length === 0) fetchTests();
};

// Assign test to student
const assignTest = async () => {
  try {
    isAssigning.value = true;
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    if (!authStore.user?.center_id) {
      toast.error("No center found for user");
      return;
    }

    const payload = {
      student_id: newAssignment.value.student_id,
      test_id: newAssignment.value.test_id,
      assigned_by: authStore.user.id,
      test_start_time: new Date(
        newAssignment.value.test_start_time
      ).toISOString(),
      test_end_time: new Date(newAssignment.value.test_end_time).toISOString(),
      notes: newAssignment.value.notes || undefined,
    };

    await $fetch(
      `${baseURL}/student-tests/centers/${authStore.user.center_id}/assign`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );

    toast.success("Test assigned successfully!");
    showAssignDialog.value = false;

    // Reset form
    newAssignment.value = {
      student_id: "",
      test_id: "",
      test_start_time: "",
      test_end_time: "",
      notes: "",
    };

    // Refresh assignments
    await fetchAssignments();
  } catch (error) {
    console.error("Failed to assign test:", error);
    toast.error(error.data?.message || "Failed to assign test");
  } finally {
    isAssigning.value = false;
  }
};

// Edit assignment
const editAssignment = (assignment) => {
  // Convert ISO datetime to datetime-local format
  const formatForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  editingAssignment.value = {
    id: assignment.id,
    student: assignment.student,
    test: assignment.test,
    test_start_time: formatForInput(assignment.test_start_time),
    test_end_time: formatForInput(assignment.test_end_time),
    status: assignment.status || "pending",
    notes: assignment.notes || "",
  };
  showEditDialog.value = true;
};

// Update assignment
const updateAssignment = async () => {
  try {
    isUpdating.value = true;
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    if (!authStore.user?.center_id) {
      toast.error("No center found for user");
      return;
    }

    const payload = {
      test_start_time: new Date(
        editingAssignment.value.test_start_time
      ).toISOString(),
      test_end_time: new Date(
        editingAssignment.value.test_end_time
      ).toISOString(),
      status: editingAssignment.value.status,
      notes: editingAssignment.value.notes || undefined,
    };

    await $fetch(
      `${baseURL}/student-tests/centers/${authStore.user.center_id}/assignments/${editingAssignment.value.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );

    toast.success("Assignment updated successfully!");
    showEditDialog.value = false;

    // Reset form
    editingAssignment.value = {
      id: "",
      student: null,
      test: null,
      test_start_time: "",
      test_end_time: "",
      status: "",
      notes: "",
    };

    // Refresh assignments
    await fetchAssignments();
  } catch (error) {
    console.error("Failed to update assignment:", error);
    toast.error(error.data?.message || "Failed to update assignment");
  } finally {
    isUpdating.value = false;
  }
};

// Delete assignment
const deleteAssignment = async (assignmentId) => {
  if (!confirm("Are you sure you want to delete this assignment?")) {
    return;
  }

  try {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    if (!authStore.user?.center_id) {
      toast.error("No center found for user");
      return;
    }

    await $fetch(
      `${baseURL}/student-tests/centers/${authStore.user.center_id}/assignments/${assignmentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    toast.success("Assignment deleted successfully!");
    await fetchAssignments();
  } catch (error) {
    console.error("Failed to delete assignment:", error);
    toast.error(error.data?.message || "Failed to delete assignment");
  }
};

// Load assignments on mount
onMounted(() => {
  fetchAssignments();
  fetchTests();
});

definePageMeta({
  layout: "teacher",
  middleware: ["auth"],
});
</script>
