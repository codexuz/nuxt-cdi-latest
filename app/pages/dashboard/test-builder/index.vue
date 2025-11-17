<template>
  <div class="container mx-auto px-4 py-8">
    <Toaster position="top-center" richColors theme="system" />

    <!-- Header -->
    <motion.div
      :initial="{ opacity: 0, y: -20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.3 }"
      class="flex items-center justify-between mb-8"
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
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="mock">Mock</SelectItem>
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
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 0.4, delay: 0.1 }"
      class="grid grid-cols-1 gap-4"
    >
      <Card
        v-for="(test, index) in tests"
        :key="test.id"
        class="hover:shadow-lg transition-shadow"
      >
        <CardHeader>
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <CardTitle>{{ test.title }}</CardTitle>
              <CardDescription class="mt-2">{{
                test.description
              }}</CardDescription>
            </div>
            <Badge
              :variant="test.test_type === 'mock' ? 'default' : 'secondary'"
            >
              {{ test.test_type === "practice" ? "Practice" : "Mock" }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div
            class="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-muted-foreground mb-4"
          >
            <div class="flex items-center gap-2">
              <Headphones class="h-4 w-4" />
              <span class="hidden sm:inline"
                >{{ test.listening_count || 0 }} Listening Parts</span
              >
              <span class="sm:hidden"
                >{{ test.listening_count || 0 }} Listening</span
              >
            </div>
            <div class="flex items-center gap-2">
              <BookOpen class="h-4 w-4" />
              <span class="hidden sm:inline"
                >{{ test.reading_count || 0 }} Reading Parts</span
              >
              <span class="sm:hidden"
                >{{ test.reading_count || 0 }} Reading</span
              >
            </div>
            <div class="flex items-center gap-2">
              <FileQuestion class="h-4 w-4" />
              <span class="hidden sm:inline"
                >{{ test.total_questions || 0 }} Questions</span
              >
              <span class="sm:hidden">{{ test.total_questions || 0 }} Q</span>
            </div>
          </div>
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
                  `/dashboard/test-builder/listening?test_id=${test.id}`
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
                navigateTo(`/dashboard/test-builder/reading?test_id=${test.id}`)
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
                navigateTo(`/dashboard/test-builder/writing?test_id=${test.id}`)
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

      <!-- Empty State -->
      <Card v-if="tests.length === 0" class="text-center py-12">
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
    </motion.div>

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
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="mock">Mock</SelectItem>
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
  </div>
</template>

<script setup>
import {
  Plus,
  Trash2,
  Edit,
  Headphones,
  BookOpen,
  FileQuestion,
  PenTool,
} from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import { motion } from "motion-v";

useHead({
  title: "IELTS Test Builder - Testify",
});

const showCreateDialog = ref(false);
const showEditDialog = ref(false);

const newTest = ref({
  title: "",
  description: "",
  test_type: "practice",
});

const editingTest = ref({
  id: "",
  title: "",
  description: "",
  test_type: "practice",
});

const tests = ref([]);
const isLoading = ref(false);

// Fetch tests from API
const fetchTests = async () => {
  console.log("Fetching tests...");
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
      `${baseURL}/ielts/centers/${activeCenter.value.id}/tests`,
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

    // Get active center
    const { activeCenter } = useCenters();

    if (!activeCenter.value?.id) {
      toast.error("No active center found");
      return;
    }

    const payload = {
      title: newTest.value.title,
      description: newTest.value.description,
      test_type: newTest.value.test_type,
    };

    const response = await $fetch(
      `${baseURL}/ielts/centers/${activeCenter.value.id}/tests`,
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
      test_type: "practice",
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
    test_type: test.test_type || "practice",
  };
  showEditDialog.value = true;
};

const updateTest = async () => {
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

    const payload = {
      title: editingTest.value.title,
      description: editingTest.value.description,
      test_type: editingTest.value.test_type,
    };

    const response = await $fetch(
      `${baseURL}/ielts/centers/${activeCenter.value.id}/tests/${editingTest.value.id}`,
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

    // Get active center
    const { activeCenter } = useCenters();

    if (!activeCenter.value?.id) {
      toast.error("No active center found");
      return;
    }

    await $fetch(
      `${baseURL}/ielts/centers/${activeCenter.value.id}/tests/${testId}`,
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
  layout: "dashboard",
  middleware: "auth",
});
</script>
