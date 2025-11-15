<template>
  <div class="container mx-auto px-4 py-8">
    <Toaster position="top-center" richColors theme="system" />

    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold">IELTS Test Builder</h1>
        <p class="text-muted-foreground">Create and manage IELTS tests</p>
      </div>
      <Button @click="showCreateDialog = true">
        <Plus class="mr-2 h-4 w-4" />
        Create New Test
      </Button>
    </div>

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

    <!-- Tests List -->
    <div class="grid grid-cols-1 gap-4">
      <Card
        v-for="test in tests"
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
            class="flex items-center gap-6 text-sm text-muted-foreground mb-4"
          >
            <div class="flex items-center gap-2">
              <Headphones class="h-4 w-4" />
              <span>{{ test.listening_count || 0 }} Listening Parts</span>
            </div>
            <div class="flex items-center gap-2">
              <BookOpen class="h-4 w-4" />
              <span>{{ test.reading_count || 0 }} Reading Parts</span>
            </div>
            <div class="flex items-center gap-2">
              <FileQuestion class="h-4 w-4" />
              <span>{{ test.total_questions || 0 }} Questions</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Button size="sm" @click="editTest(test)">
              <Edit class="mr-2 h-3 w-3" />
              Edit Test Info
            </Button>
            <Button
              size="sm"
              variant="outline"
              @click="
                navigateTo(
                  `/dashboard/test-builder/listening?test_id=${test.id}`
                )
              "
            >
              <Headphones class="mr-2 h-3 w-3" />
              Add Listening
            </Button>
            <Button
              size="sm"
              variant="outline"
              @click="
                navigateTo(`/dashboard/test-builder/reading?test_id=${test.id}`)
              "
            >
              <BookOpen class="mr-2 h-3 w-3" />
              Add Reading
            </Button>
            <Button size="sm" variant="ghost" @click="deleteTest(test.id)">
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
    </div>

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
} from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

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

const testsStorageKey = "ielts-tests-list";

// Load tests from localStorage or use mock data
const loadTests = () => {
  if (process.client) {
    const saved = localStorage.getItem(testsStorageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved tests:", e);
      }
    }
  }
  // Default mock data
  return [
    {
      id: "1",
      title: "IELTS Academic Test - Practice Set 1",
      description:
        "This is a comprehensive IELTS Academic test designed for intermediate to advanced students preparing for their IELTS examination.",
      test_type: "practice",
      listening_count: 4,
      reading_count: 3,
      total_questions: 40,
    },
    {
      id: "2",
      title: "IELTS General Training Mock Test",
      description:
        "Full-length mock test for General Training module to simulate exam conditions.",
      test_type: "mock",
      listening_count: 4,
      reading_count: 3,
      total_questions: 40,
    },
  ];
};

const tests = ref(loadTests());

// Auto-save tests to localStorage whenever they change
watch(
  tests,
  (newTests) => {
    if (process.client) {
      localStorage.setItem(testsStorageKey, JSON.stringify(newTests));
    }
  },
  { deep: true }
);

const createTest = async () => {
  try {
    const payload = {
      ...newTest.value,
    };

    // TODO: Replace with actual API call
    console.log("Creating test:", payload);

    // Mock response
    const mockTest = {
      id: `test-${Date.now()}`,
      ...payload,
      listening_count: 0,
      reading_count: 0,
      total_questions: 0,
    };

    tests.value.unshift(mockTest);
    // Note: localStorage auto-save happens via watcher

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
    toast.error("Failed to create test");
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
    const payload = {
      ...editingTest.value,
    };

    // TODO: Replace with actual API call
    console.log("Updating test:", payload);

    // Update in list
    const index = tests.value.findIndex((t) => t.id === editingTest.value.id);
    if (index !== -1) {
      tests.value[index] = {
        ...tests.value[index],
        ...payload,
      };
    }
    // Note: localStorage auto-save happens via watcher

    toast.success("Test updated successfully!");
    showEditDialog.value = false;
  } catch (error) {
    console.error("Failed to update test:", error);
    toast.error("Failed to update test");
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
    // TODO: Replace with actual API call
    console.log("Deleting test:", testId);

    tests.value = tests.value.filter((t) => t.id !== testId);
    // Note: localStorage auto-save happens via watcher

    toast.success("Test deleted successfully!");
  } catch (error) {
    console.error("Failed to delete test:", error);
    toast.error("Failed to delete test");
  }
};

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>
