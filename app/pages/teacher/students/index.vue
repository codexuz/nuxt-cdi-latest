<template>
  <motion.div
    class="space-y-4"
    :initial="{ opacity: 0, y: 20 }"
    :transition="{ duration: 0.6, ease: 'easeOut' }"
    :animate="{ opacity: 1, y: 0 }"
  >
    <!-- Filters and Search -->
    <motion.div
      class="flex flex-col sm:flex-row gap-4 items-center justify-between"
      :initial="{ opacity: 0, y: -10 }"
      :transition="{ duration: 0.5, delay: 0.1 }"
      :animate="{ opacity: 1, y: 0 }"
    >
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
        <!-----
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
       ---->
        <Button @click="openAddStudentModal" class="whitespace-nowrap">
          <Plus class="h-4 w-4 mr-2" />
          Add student
        </Button>
      </div>
    </motion.div>

    <!-- Students Table -->
    <motion.div
      class="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
      :animate="{ opacity: 1, y: 0 }"
    >
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
                Phone
              </th>
              <th
                class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </th>
              <th
                class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Status
              </th>
              <th
                class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status
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
              v-for="(student, index) in paginatedStudents"
              :key="student.id"
              class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <td class="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
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
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                {{ student.phone || "-" }}
              </td>
              <td class="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                {{ student.email || "-" }}
              </td>
              <td class="py-4 px-4">
                <Badge
                  :variant="student.email_verified ? 'default' : 'secondary'"
                  class="text-xs"
                >
                  {{ student.email_verified ? "Verified" : "Unverified" }}
                </Badge>
              </td>
              <td class="py-4 px-4">
                <Badge
                  :variant="student.is_active ? 'default' : 'destructive'"
                  class="text-xs"
                >
                  {{ student.is_active ? "Active" : "Inactive" }}
                </Badge>
              </td>
              <td class="py-4 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="editStudent(student)">
                      <Edit class="mr-2 h-4 w-4" />
                      Edit Details
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
      <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between mb-4">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing
            {{
              paginatedStudents.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0
            }}–{{ Math.min(currentPage * itemsPerPage, totalStudents) }} of
            {{ totalStudents }} students
          </div>
        </div>

        <Pagination
          v-slot="{ page }"
          :total="totalStudents"
          :sibling-count="1"
          :default-page="currentPage"
          :items-per-page="itemsPerPage"
          show-edges
          @update:page="handlePageChange"
          class="justify-center"
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
      </div>
    </motion.div>

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

    <!-- Edit Student Modal -->
    <Dialog v-model:open="isEditStudentModalOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription> Update student information. </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="updateStudent" class="space-y-4">
          <div class="space-y-2">
            <Label for="edit-name">Full Name</Label>
            <Input
              id="edit-name"
              v-model="editingStudent.name"
              placeholder="John Doe"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-email">Email</Label>
            <Input
              id="edit-email"
              v-model="editingStudent.email"
              type="email"
              placeholder="student@example.com"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              v-model="editingStudent.phone"
              type="tel"
              placeholder="+998901234567"
              required
            />
          </div>

          <DialogFooter class="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              @click="closeEditStudentModal"
              :disabled="isUpdating"
            >
              Cancel
            </Button>
            <Button type="submit" :disabled="isUpdating">
              <span v-if="isUpdating" class="flex items-center">
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                ></div>
                Updating...
              </span>
              <span v-else>Update Student</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </motion.div>
</template>

<script setup>
import { motion } from "motion-v";
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
  title: "Students - Mockmee",
});

const searchQuery = ref("");
const selectedGroup = ref("all");
const students = ref([]);
const isLoading = ref(false);
const isAddStudentModalOpen = ref(false);
const isCreating = ref(false);
const isEditStudentModalOpen = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalStudents = computed(() => filteredStudents.value.length);
const totalPages = computed(() =>
  Math.ceil(totalStudents.value / itemsPerPage.value)
);

// Computed property for paginated students
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredStudents.value.slice(start, end);
});

// Handle page change
const handlePageChange = (page) => {
  currentPage.value = page;
  // Scroll to top of students list
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Get runtime config
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;

// New student form data
const newStudent = ref({
  name: "",
  email: "",
  phone: "",
  password: "",
});

// Edit student form data
const editingStudent = ref({
  id: "",
  name: "",
  email: "",
  phone: "",
});

// Fetch students from API
const fetchStudents = async () => {
  const authStore = useAuthStore();

  if (!authStore.user?.center_id) {
    toast.error("No center found for user");
    return;
  }

  isLoading.value = true;
  try {
    const token = authStore.token;

    const response = await fetch(
      `${baseURL}/users/students?centerId=${authStore.user.center_id}`,
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
  const authStore = useAuthStore();

  if (!authStore.user?.center_id) {
    toast.error("No center found for user");
    return;
  }

  isCreating.value = true;
  try {
    const token = authStore.token;

    const response = await fetch(`${baseURL}/auth/register-student`, {
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
        center_id: authStore.user.center_id,
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

const closeEditStudentModal = () => {
  isEditStudentModalOpen.value = false;
  // Reset form
  editingStudent.value = {
    id: "",
    name: "",
    email: "",
    phone: "",
  };
};

// Update student
const updateStudent = async () => {
  if (!editingStudent.value.id) {
    toast.error("No student selected");
    return;
  }

  isUpdating.value = true;
  try {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(
      `${baseURL}/users/${editingStudent.value.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingStudent.value.name,
          email: editingStudent.value.email,
          phone: editingStudent.value.phone,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update student");
    }

    toast.success("Student updated successfully");
    closeEditStudentModal();
    await fetchStudents(); // Refresh the list
  } catch (error) {
    console.error("Error updating student:", error);
    toast.error(error.message || "Failed to update student");
  } finally {
    isUpdating.value = false;
  }
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

// Watch for search query changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1;
});

const viewStudent = (student) => {
  console.log("View student:", student);
  // TODO: Navigate to student profile
};

const editStudent = (student) => {
  editingStudent.value = {
    id: student.id,
    name: student.name || "",
    email: student.email || "",
    phone: student.phone || "",
  };
  isEditStudentModalOpen.value = true;
};

const viewProgress = (student) => {
  console.log("View progress:", student);
  // TODO: Navigate to progress page
};

const deleteStudent = async (student) => {
  if (
    !confirm(
      `Are you sure you want to remove ${student.name}? This action cannot be undone.`
    )
  ) {
    return;
  }

  isDeleting.value = true;
  try {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(`${baseURL}/users/${student.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete student");
    }

    toast.success("Student removed successfully");
    await fetchStudents(); // Refresh the list
  } catch (error) {
    console.error("Error deleting student:", error);
    toast.error(error.message || "Failed to delete student");
  } finally {
    isDeleting.value = false;
  }
};

// Fetch students on mount
onMounted(() => {
  fetchStudents();
});

definePageMeta({
  layout: "teacher",
  middleware: ["auth"],
});
</script>
