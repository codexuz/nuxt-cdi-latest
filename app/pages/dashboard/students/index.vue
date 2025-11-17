<template>
  <div class="space-y-4">
    <!-- Filters and Search -->
    <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <Search
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
        />
        <Input
          placeholder="Search..."
          class="pl-10 bg-white dark:bg-gray-950"
          v-model="searchQuery"
        />
      </div>

      <div class="flex gap-4 w-full sm:w-auto">
        <Select v-model="selectedGroup">
          <SelectTrigger class="w-full sm:w-48 bg-white dark:bg-gray-950">
            <SelectValue placeholder="Select groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            <SelectItem value="demo">Demo</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Button @click="openAddStudentModal" class="whitespace-nowrap">
          <Plus class="h-4 w-4 mr-2" />
          Add student
        </Button>
      </div>
    </div>

    <!-- Students Table -->
    <div class="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
        ></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredStudents.length === 0"
        class="flex flex-col items-center justify-center py-12 text-center"
      >
        <Users class="h-12 w-12 text-muted-foreground mb-4" />
        <h3 class="text-lg font-semibold mb-2">No students found</h3>
        <p class="text-muted-foreground mb-4">
          {{
            searchQuery || selectedGroup !== "all"
              ? "Try adjusting your filters"
              : "Get started by adding your first student"
          }}
        </p>
        <Button
          v-if="!searchQuery && selectedGroup === 'all'"
          @click="openAddStudentModal"
        >
          <Plus class="h-4 w-4 mr-2" />
          Add student
        </Button>
      </div>

      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800">
              <th
                class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                №
              </th>
              <th
                class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </th>
              <th
                class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Contact
              </th>
              <th
                class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Age
              </th>
              <th
                class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Group
              </th>
              <th
                class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Notes
              </th>
              <th
                class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(student, index) in filteredStudents"
              :key="student.id"
              class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <td class="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                {{ index + 1 }}
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center space-x-3">
                  <Avatar class="h-9 w-9">
                    <AvatarImage :src="student.avatar" :alt="student.name" />
                    <AvatarFallback
                      class="bg-primary text-primary-foreground text-sm font-semibold"
                    >
                      {{ getInitials(student.name) }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p
                      class="font-medium text-gray-900 dark:text-white hover:underline cursor-pointer"
                    >
                      {{ student.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ student.email }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                {{ student.phone || "-" }}
              </td>
              <td class="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                {{ student.age }}
              </td>
              <td class="py-4 px-4">
                <div
                  class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <Folder class="h-4 w-4 text-gray-400" />
                  <span>{{ student.group }}</span>
                </div>
              </td>
              <td class="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                {{ student.notes || "-" }}
              </td>
              <td class="py-4 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="viewStudent(student)">
                      <Eye class="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="editStudent(student)">
                      <Edit class="mr-2 h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="viewProgress(student)">
                      <BarChart3 class="mr-2 h-4 w-4" />
                      View Progress
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      @click="deleteStudent(student)"
                      class="text-red-600"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Remove Student
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800"
      >
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Showing {{ filteredStudents.length > 0 ? "1" : "0" }}–{{
            filteredStudents.length
          }}
          of {{ filteredStudents.length }}
        </div>
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft class="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
            <ChevronRight class="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Add Student Modal -->
    <Dialog v-model:open="isAddStudentModalOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Create a new student account. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="createStudent" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Full Name</Label>
            <Input
              id="name"
              v-model="newStudent.name"
              placeholder="John Doe"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="newStudent.email"
              type="email"
              placeholder="student@example.com"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="phone">Phone</Label>
            <Input
              id="phone"
              v-model="newStudent.phone"
              type="tel"
              placeholder="+998901234567"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="newStudent.password"
              type="password"
              placeholder="••••••••"
              required
              minlength="6"
            />
          </div>

          <DialogFooter class="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              @click="closeAddStudentModal"
              :disabled="isCreating"
            >
              Cancel
            </Button>
            <Button type="submit" :disabled="isCreating">
              <span v-if="isCreating" class="flex items-center">
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                ></div>
                Creating...
              </span>
              <span v-else>Create Student</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  BarChart3,
  Trash2,
  Folder,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Students - Mockmee",
});

const searchQuery = ref("");
const selectedGroup = ref("all");
const students = ref([]);
const isLoading = ref(false);
const isAddStudentModalOpen = ref(false);
const isCreating = ref(false);

// Get runtime config
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

// Get active center from composable
const { activeCenter } = useCenters();

// New student form data
const newStudent = ref({
  name: "",
  email: "",
  phone: "",
  password: "",
});

// Fetch students from API
const fetchStudents = async () => {
  if (!activeCenter.value?.id) return;

  isLoading.value = true;
  try {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(
      `${baseURL}/users?centerId=${activeCenter.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }

    const data = await response.json();
    students.value = data;
  } catch (error) {
    console.error("Error fetching students:", error);
    toast.error("Failed to load students");
  } finally {
    isLoading.value = false;
  }
};

// Create new student
const createStudent = async () => {
  if (!activeCenter.value?.id) {
    toast.error("No center selected");
    return;
  }

  isCreating.value = true;
  try {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(`${baseURL}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newStudent.value.name,
        email: newStudent.value.email,
        phone: newStudent.value.phone,
        password: newStudent.value.password,
        center_id: activeCenter.value.id,
        roles: ["student"],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create student");
    }

    toast.success("Student created successfully");
    closeAddStudentModal();
    await fetchStudents(); // Refresh the list
  } catch (error) {
    console.error("Error creating student:", error);
    toast.error(error.message || "Failed to create student");
  } finally {
    isCreating.value = false;
  }
};

// Modal controls
const openAddStudentModal = () => {
  isAddStudentModalOpen.value = true;
};

const closeAddStudentModal = () => {
  isAddStudentModalOpen.value = false;
  // Reset form
  newStudent.value = {
    name: "",
    email: "",
    phone: "",
    password: "",
  };
};

// Get initials from name
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const filteredStudents = computed(() => {
  let filtered = students.value;

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(
      (student) =>
        student.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        student.email
          ?.toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        student.phone?.includes(searchQuery.value)
    );
  }

  // Filter by group
  if (selectedGroup.value !== "all") {
    filtered = filtered.filter(
      (student) =>
        student.group?.toLowerCase() === selectedGroup.value.toLowerCase()
    );
  }

  return filtered;
});

const viewStudent = (student) => {
  console.log("View student:", student);
  // TODO: Navigate to student profile
};

const editStudent = (student) => {
  console.log("Edit student:", student);
  // TODO: Navigate to edit page
};

const viewProgress = (student) => {
  console.log("View progress:", student);
  // TODO: Navigate to progress page
};

const deleteStudent = (student) => {
  console.log("Delete student:", student);
  // TODO: Show confirmation dialog and delete
};

// Fetch students on mount
onMounted(() => {
  fetchStudents();
});

// Watch for center changes
watch(
  () => activeCenter.value?.id,
  () => {
    if (activeCenter.value?.id) {
      fetchStudents();
    }
  }
);

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>
