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
        <h1 class="text-3xl font-bold">IELTS Test Builder</h1>
        <p class="text-muted-foreground">Create and manage IELTS tests</p>
      </div>
      <Button @click="showCreateDialog = true">
        <Plus class="mr-2 h-4 w-4" />
        Create New Test
      </Button>
    </motion.div>

    <!-- Filters Section -->
    <motion.div
      class="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 mb-6"
      :initial="{ opacity: 0, y: -10 }"
      :transition="{ duration: 0.5, delay: 0.15 }"
      :animate="{ opacity: 1, y: 0 }"
    >
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search tests by title or description..."
              class="pl-10"
            />
          </div>
        </div>

        <!-- Date Sort -->
        <div class="min-w-[180px]">
          <Select v-model="dateSort">
            <SelectTrigger>
              <Calendar class="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Test Type Filter -->
        <div class="min-w-[180px]">
          <Select v-model="typeFilter">
            <SelectTrigger>
              <Filter class="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ielts_practice">IELTS Practice</SelectItem>
              <SelectItem value="ielts_mock">IELTS Mock</SelectItem>
              <SelectItem value="cefr_practice">CEFR Practice</SelectItem>
              <SelectItem value="cefr_mock">CEFR Mock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Active filters display -->
      <div
        v-if="hasActiveFilters"
        class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
      >
        <Badge v-if="searchQuery" variant="secondary" class="gap-1">
          Search: "{{ searchQuery }}"
        </Badge>
        <Badge v-if="dateSort !== 'newest'" variant="secondary" class="gap-1">
          Sort: {{ dateSort === "oldest" ? "Oldest First" : "Newest First" }}
        </Badge>
        <Badge v-if="typeFilter !== 'all'" variant="secondary" class="gap-1">
          Type: {{ formatTestType(typeFilter) }}
        </Badge>
      </div>
    </motion.div>

    <!-- Create Test Dialog -->
    <Dialog v-model:open="showCreateDialog">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Test</DialogTitle>
          <DialogDescription>
            Enter basic test information. You can add listening and reading
            sections after creation.
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="title">Test Title</Label>
            <Input
              id="title"
              v-model="newTest.title"
              placeholder="e.g., IELTS Academic Test - Practice Set 1"
            />
          </div>
          <div class="space-y-2">
            <Label for="description">Description</Label>
            <Textarea
              id="description"
              v-model="newTest.description"
              placeholder="This is a comprehensive IELTS Academic test designed for intermediate to advanced students..."
              rows="3"
            />
          </div>
          <div class="space-y-2">
            <Label for="test_type">Test Type</Label>
            <Select v-model="newTest.test_type">
              <SelectTrigger id="test_type">
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ielts_practice">IELTS Practice</SelectItem>
                <SelectItem value="ielts_mock">IELTS Mock</SelectItem>
                <SelectItem value="cefr_practice">CEFR Practice</SelectItem>
                <SelectItem value="cefr_mock">CEFR Mock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showCreateDialog = false"
            >Cancel</Button
          >
          <Button @click="createTest" :disabled="!newTest.title"
            >Create Test</Button
          >
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <!-- Tests List -->
    <motion.div
      v-else
      class="grid grid-cols-1 gap-4"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }"
    >
      <motion.div
        v-for="(test, index) in paginatedTests"
        :key="test.id"
        :initial="{ opacity: 0, y: 10 }"
        :transition="{ duration: 0.4, delay: 0.3 + index * 0.05 }"
        :animate="{ opacity: 1, y: 0 }"
      >
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <CardTitle>{{ test.title }}</CardTitle>
              </div>
              <Badge
                :variant="
                  test.test_type?.includes('mock') ? 'default' : 'secondary'
                "
              >
                {{ formatTestType(test.test_type) }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div
              class="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-muted-foreground mb-4"
            ></div>
            <div class="flex flex-wrap items-center gap-2">
              <Button size="sm" @click="editTest(test)" class="flex-shrink-0">
                <Edit class="mr-2 h-3 w-3" />
                <span class="hidden sm:inline">Edit Test Info</span>
                <span class="sm:hidden">Edit</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                @click="
                  navigateTo(
                    `/teacher/test-builder/listening?test_id=${test.id}`
                  )
                "
                class="flex-shrink-0"
              >
                <Headphones class="mr-2 h-3 w-3" />
                <span class="hidden md:inline">Add Listening</span>
                <span class="md:hidden">Listening</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                @click="
                  navigateTo(`/teacher/test-builder/reading?test_id=${test.id}`)
                "
                class="flex-shrink-0"
              >
                <BookOpen class="mr-2 h-3 w-3" />
                <span class="hidden md:inline">Add Reading</span>
                <span class="md:hidden">Reading</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                @click="
                  navigateTo(`/teacher/test-builder/writing?test_id=${test.id}`)
                "
                class="flex-shrink-0"
              >
                <PenTool class="mr-2 h-3 w-3" />
                <span class="hidden md:inline">Add Writing</span>
                <span class="md:hidden">Writing</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                @click="deleteTest(test.id)"
                class="flex-shrink-0"
              >
                <Trash2 class="h-3 w-3 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <!-- Empty State -->
      <Card
        v-if="tests.length === 0 && !hasActiveFilters"
        class="text-center py-12"
      >
        <CardContent>
          <FileQuestion class="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 class="text-lg font-semibold mb-2">No tests created yet</h3>
          <p class="text-muted-foreground mb-4">
            Create your first IELTS test to get started
          </p>
          <Button @click="showCreateDialog = true">
            <Plus class="mr-2 h-4 w-4" />
            Create New Test
          </Button>
        </CardContent>
      </Card>

      <!-- No results found -->
      <Card
        v-if="tests.length > 0 && filteredTests.length === 0"
        class="text-center py-12"
      >
        <CardContent>
          <Search class="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 class="text-lg font-semibold mb-2">No tests found</h3>
          <p class="text-muted-foreground mb-4">
            No tests match your current filters. Try adjusting your search or
            filters.
          </p>
          <Button
            variant="outline"
            @click="
              () => {
                searchQuery = '';
                dateSort = 'newest';
                typeFilter = 'all';
              }
            "
          >
            Clear Filters
          </Button>
        </CardContent>
      </Card>
    </motion.div>

    <Pagination
      v-if="filteredTests.length > itemsPerPage"
      v-slot="{ page }"
      :total="totalTests"
      :sibling-count="1"
      :default-page="currentPage"
      :items-per-page="itemsPerPage"
      show-edges
      @update:page="handlePageChange"
      class="mt-8 justify-center"
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

    <!-- Edit Test Dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Test Information</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="edit-title">Test Title</Label>
            <Input
              id="edit-title"
              v-model="editingTest.title"
              placeholder="e.g., IELTS Academic Test - Practice Set 1"
            />
          </div>
          <div class="space-y-2">
            <Label for="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              v-model="editingTest.description"
              placeholder="This is a comprehensive IELTS Academic test designed for intermediate to advanced students..."
              rows="3"
            />
          </div>
          <div class="space-y-2">
            <Label for="edit-test_type">Test Type</Label>
            <Select v-model="editingTest.test_type">
              <SelectTrigger id="edit-test_type">
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ielts_practice">IELTS Practice</SelectItem>
                <SelectItem value="ielts_mock">IELTS Mock</SelectItem>
                <SelectItem value="cefr_practice">CEFR Practice</SelectItem>
                <SelectItem value="cefr_mock">CEFR Mock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showEditDialog = false"
            >Cancel</Button
          >
          <Button @click="updateTest">Save Changes</Button>
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
  Edit,
  Headphones,
  BookOpen,
  FileQuestion,
  PenTool,
  Search,
  Filter,
  Calendar,
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
  title: "IELTS Test Builder - Mockmee LMS",
});

const showCreateDialog = ref(false);
const showEditDialog = ref(false);

// Filter and search state
const searchQuery = ref("");
const dateSort = ref("newest");
const typeFilter = ref("all");

const newTest = ref({
  title: "",
  description: "",
  test_type: "ielts_practice",
});

const editingTest = ref({
  id: "",
  title: "",
  description: "",
  test_type: "ielts_practice",
});

const tests = ref([]);
const isLoading = ref(false);

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return (
    searchQuery.value ||
    dateSort.value !== "newest" ||
    typeFilter.value !== "all"
  );
});

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);
// Filtered and sorted tests
const filteredTests = computed(() => {
  let filtered = [...tests.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (test) =>
        test.title?.toLowerCase().includes(query) ||
        test.description?.toLowerCase().includes(query)
    );
  }

  // Apply type filter
  if (typeFilter.value !== "all") {
    filtered = filtered.filter((test) => test.test_type === typeFilter.value);
  }

  // Apply date sorting
  filtered.sort((a, b) => {
    const dateA = new Date(a.created_at || a.id);
    const dateB = new Date(b.created_at || b.id);

    if (dateSort.value === "oldest") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  return filtered;
});

const totalTests = computed(() => filteredTests.value.length);
const totalPages = computed(() =>
  Math.ceil(totalTests.value / itemsPerPage.value)
);

// Computed property for paginated tests
const paginatedTests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredTests.value.slice(start, end);
});

// Handle page change
const handlePageChange = (page) => {
  currentPage.value = page;
  // Scroll to top of tests list
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Reset to first page when filters change
watch([searchQuery, dateSort, typeFilter], () => {
  currentPage.value = 1;
});

// Format test type for display
const formatTestType = (testType) => {
  const typeMap = {
    ielts_practice: "IELTS Practice",
    ielts_mock: "IELTS Mock",
    cefr_practice: "CEFR Practice",
    cefr_mock: "CEFR Mock",
  };
  return typeMap[testType] || testType;
};

// Fetch tests from API
const fetchTests = async () => {
  console.log("Fetching tests...");
  try {
    isLoading.value = true;
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    // Get center from user
    if (!authStore.user?.center_id) {
      toast.error("No center found for user");
      return;
    }

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
    toast.error("Failed to load tests");
  } finally {
    isLoading.value = false;
  }
};

// Load tests on mount
onMounted(() => {
  fetchTests();
});

const createTest = async () => {
  try {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    // Get center from user
    if (!authStore.user?.center_id) {
      toast.error("No center found for user");
      return;
    }

    const payload = {
      title: newTest.value.title,
      description: newTest.value.description,
      test_type: newTest.value.test_type,
    };

    const response = await $fetch(
      `${baseURL}/ielts/centers/${authStore.user.center_id}/tests`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );

    console.log("Test created:", response);

    // Add the new test to the list with the response data
    tests.value.unshift({
      id: response.id || `test-${Date.now()}`,
      ...payload,
      listening_count: 0,
      reading_count: 0,
      total_questions: 0,
      ...response,
    });

    toast.success("Test created successfully!");
    showCreateDialog.value = false;

    // Reset form
    newTest.value = {
      title: "",
      description: "",
      test_type: "ielts_practice",
    };
  } catch (error) {
    console.error("Failed to create test:", error);
    toast.error(error.data?.message || "Failed to create test");
  }
};

const editTest = (test) => {
  editingTest.value = {
    id: test.id,
    title: test.title,
    description: test.description,
    test_type: test.test_type || "ielts_practice",
  };
  showEditDialog.value = true;
};

const updateTest = async () => {
  try {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    // Get center from user
    if (!authStore.user?.center_id) {
      toast.error("No center found for user");
      return;
    }

    const payload = {
      title: editingTest.value.title,
      description: editingTest.value.description,
      test_type: editingTest.value.test_type,
    };

    const response = await $fetch(
      `${baseURL}/ielts/centers/${authStore.user.center_id}/tests/${editingTest.value.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );

    console.log("Test updated:", response);

    // Update in list
    const index = tests.value.findIndex((t) => t.id === editingTest.value.id);
    if (index !== -1) {
      tests.value[index] = {
        ...tests.value[index],
        ...payload,
      };
    }

    toast.success("Test updated successfully!");
    showEditDialog.value = false;
  } catch (error) {
    console.error("Failed to update test:", error);
    toast.error(error.data?.message || "Failed to update test");
  }
};

const deleteTest = async (testId) => {
  if (
    !confirm(
      "Are you sure you want to delete this test? This action cannot be undone."
    )
  ) {
    return;
  }

  try {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    // Get center from user
    if (!authStore.user?.center_id) {
      toast.error("No center found for user");
      return;
    }

    await $fetch(
      `${baseURL}/ielts/centers/${authStore.user.center_id}/tests/${testId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    console.log("Test deleted:", testId);

    tests.value = tests.value.filter((t) => t.id !== testId);

    toast.success("Test deleted successfully!");
  } catch (error) {
    console.error("Failed to delete test:", error);
    toast.error(error.data?.message || "Failed to delete test");
  }
};

definePageMeta({
  layout: "teacher",
  middleware: ["auth"],
});
</script>
