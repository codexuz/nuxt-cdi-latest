<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <Toaster position="top-center" richColors theme="system" />

    <!-- Header -->
    <div
      class="bg-gray-50 dark:bg-gray-900 px-8 py-6 border-b dark:border-gray-800"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md"
          >
            <Icon
              name="heroicons:user-group"
              class="w-8 h-8 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {{ group?.name || "Demo" }}
            </h1>
            <p class="text-gray-700 dark:text-gray-300">
              {{ group?.students?.length || 0 }} student{{
                group?.students?.length !== 1 ? "s" : ""
              }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Button
            @click="showCreateStudentModal = true"
            class="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md"
          >
            <Icon name="heroicons:user-plus" class="w-4 h-4 mr-2" />
            Create new student
          </Button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex">
      <!-- Sidebar -->
      <div class="w-48 p-4">
        <nav class="space-y-2">
          <button
            @click="activeTab = 'attendance'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
              activeTab === 'attendance'
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
            ]"
          >
            <Icon name="heroicons:calendar" class="w-5 h-5" />
            <span>Attendance</span>
          </button>
          <button
            @click="activeTab = 'members'"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
              activeTab === 'members'
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
            ]"
          >
            <Icon name="heroicons:users" class="w-5 h-5" />
            <span>Members</span>
          </button>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1 p-8">
        <!-- Attendance Tab -->
        <div
          v-if="activeTab === 'attendance'"
          class="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold dark:text-gray-100">
              Today: {{ formatTodayDate() }}
            </h2>
            <div class="flex gap-2">
              <Button
                @click="saveAttendance"
                :disabled="isSavingAttendance"
                class="bg-green-600 text-white hover:bg-green-700"
              >
                <Icon
                  v-if="!isSavingAttendance"
                  name="heroicons:check"
                  class="w-4 h-4 mr-2"
                />
                <Icon
                  v-else
                  name="heroicons:arrow-path"
                  class="w-4 h-4 mr-2 animate-spin"
                />
                {{ isSavingAttendance ? "Saving..." : "Save Attendance" }}
              </Button>
            </div>
          </div>

          <!-- Attendance Table -->
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <div class="flex items-center gap-2">
              <Icon name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
              <span>Loading attendance...</span>
            </div>
          </div>
          <div
            v-else-if="students.length === 0"
            class="text-center py-12 text-gray-500 dark:text-gray-400"
          >
            No students in this group
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b dark:border-gray-700">
                  <th
                    class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    №
                  </th>
                  <th
                    class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </th>
                  <th
                    class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Phone
                  </th>
                  <th
                    class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Presence
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(student, index) in students"
                  :key="student.id"
                  class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td class="py-4 px-4">{{ index + 1 }}</td>
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-semibold text-orange-600"
                      >
                        {{ getInitials(student.name) }}
                      </div>
                      <div>
                        <div class="font-medium">{{ student.name }}</div>
                        <div class="text-sm text-gray-500">
                          ID: {{ student.id }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-gray-700">{{ student.phone }}</td>
                  <td class="py-4 px-4">
                    <div class="flex gap-4">
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          :name="`presence-${student.id}`"
                          value="absent"
                          v-model="attendance[student.id].presence"
                          class="w-4 h-4 text-red-500"
                        />
                        <span class="text-red-500">Absent</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          :name="`presence-${student.id}`"
                          value="present"
                          v-model="attendance[student.id].presence"
                          class="w-4 h-4 text-green-500"
                        />
                        <span class="text-green-500">Present</span>
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Members Tab -->
        <div
          v-if="activeTab === 'members'"
          class="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="relative w-96">
              <Icon
                name="heroicons:magnifying-glass"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
              />
              <Input
                v-model="searchQuery"
                placeholder="Search..."
                class="pl-10"
              />
            </div>
            <Button
              @click="removeFromGroup"
              variant="outline"
              class="bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              <Icon name="heroicons:trash" class="w-4 h-4 mr-2" />
              Remove from group
            </Button>
          </div>

          <!-- Members Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b dark:border-gray-700">
                  <th
                    class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    №
                  </th>
                  <th
                    class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </th>
                  <th
                    class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Phone
                  </th>
                  <th
                    class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </th>
                  <th
                    class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Email Status
                  </th>
                  <th
                    class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(student, index) in filteredStudents"
                  :key="student.id"
                  class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td class="py-4 px-4">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td class="py-4 px-4">
                    <Checkbox v-model="selectedStudents[student.id]" />
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-semibold text-orange-600"
                      >
                        {{ getInitials(student.name) }}
                      </div>
                      <div>
                        <div class="font-medium">{{ student.name }}</div>
                        <div class="text-sm text-gray-500">
                          ID: {{ student.id }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-gray-700 dark:text-gray-300">
                    {{ student.phone }}
                  </td>
                  <td class="py-4 px-4 text-gray-700 dark:text-gray-300">
                    {{ student.email || "N/A" }}
                  </td>
                  <td class="py-4 px-4">
                    <Badge
                      :variant="
                        student.email_verified ? 'default' : 'secondary'
                      "
                    >
                      {{ student.email_verified ? "Verified" : "Not Verified" }}
                    </Badge>
                  </td>
                  <td class="py-4 px-4">
                    <Badge
                      :variant="student.is_active ? 'default' : 'destructive'"
                    >
                      {{ student.is_active ? "Active" : "Inactive" }}
                    </Badge>
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
                  filteredStudents.length > 0
                    ? (currentPage - 1) * itemsPerPage + 1
                    : 0
                }}–{{
                  Math.min(currentPage * itemsPerPage, filteredStudents.length)
                }}
                of {{ filteredStudents.length }} students
              </div>
            </div>

            <Pagination
              v-slot="{ page }"
              :total="filteredStudents.length"
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
        </div>
      </div>
    </div>

    <!-- Add Student Modal -->
    <Dialog v-model:open="showCreateStudentModal">
      <DialogContent
        class="max-w-8xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>Add Students to Group</DialogTitle>
          <DialogDescription>
            Search and select students to add to
            {{ group?.group_name || "this group" }}
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 flex-1 overflow-hidden flex flex-col">
          <!-- Search Bar -->
          <div class="relative flex-shrink-0">
            <Icon
              name="heroicons:magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
            />
            <Input
              v-model="modalSearchQuery"
              placeholder="Search students by name, email, or phone..."
              class="pl-10"
            />
          </div>

          <!-- Students Table -->
          <div
            class="border rounded-lg dark:border-gray-800 overflow-hidden flex flex-col flex-1"
          >
            <div
              v-if="isLoadingAvailableStudents"
              class="flex items-center justify-center py-12"
            >
              <div class="flex items-center gap-2">
                <Icon
                  name="heroicons:arrow-path"
                  class="w-5 h-5 animate-spin"
                />
                <span>Loading students...</span>
              </div>
            </div>
            <div
              v-else-if="paginatedAvailableStudents.length === 0"
              class="text-center py-12 text-gray-500 dark:text-gray-400"
            >
              {{
                modalSearchQuery
                  ? "No students found matching your search"
                  : "No available students"
              }}
            </div>
            <div v-else class="overflow-auto flex-1">
              <table class="w-full">
                <thead
                  class="sticky top-0 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-800"
                >
                  <tr>
                    <th
                      class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Name
                    </th>
                    <th
                      class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </th>
                    <th
                      class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="student in paginatedAvailableStudents"
                    :key="student.id"
                    class="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td class="py-3 px-4">
                      <Checkbox v-model="selectedNewStudents[student.id]" />
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <div class="font-medium dark:text-gray-200">
                          {{ student.name }}
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {{ student.email || "N/A" }}
                    </td>
                    <td class="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {{ student.phone || "N/A" }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Modal Pagination -->
          <div
            class="flex-shrink-0 py-3 border-t border-gray-200 dark:border-gray-800"
          >
            <Pagination
              v-slot="{ page }"
              :total="filteredAvailableStudents.length"
              :sibling-count="1"
              :default-page="modalCurrentPage"
              :items-per-page="modalItemsPerPage"
              show-edges
              @update:page="handleModalPageChange"
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

          <!-- Selected Count -->
          <div
            v-if="selectedStudentsCount > 0"
            class="text-sm text-gray-600 dark:text-gray-400 flex-shrink-0"
          >
            {{ selectedStudentsCount }} student{{
              selectedStudentsCount !== 1 ? "s" : ""
            }}
            selected
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="closeAddStudentModal">
            Cancel
          </Button>
          <Button
            @click="addSelectedStudents"
            :disabled="selectedStudentsCount === 0 || isAddingStudents"
          >
            <Icon
              v-if="!isAddingStudents"
              name="heroicons:user-plus"
              class="w-4 h-4 mr-2"
            />
            <Icon
              v-else
              name="heroicons:arrow-path"
              class="w-4 h-4 mr-2 animate-spin"
            />
            {{
              isAddingStudents
                ? "Adding..."
                : `Add ${
                    selectedStudentsCount > 0 ? selectedStudentsCount : ""
                  } Student${selectedStudentsCount !== 1 ? "s" : ""}`
            }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { toast, Toaster } from "vue-sonner";
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

const route = useRoute();
const groupId = route.params.id as string;
const config = useRuntimeConfig();
const API_BASE_URL = config.public.baseURL as string;
const authStore = useAuthStore();

// State
const activeTab = ref("attendance");
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const showCreateStudentModal = ref(false);
const selectedStudents = reactive<Record<string, boolean>>({});
const isLoading = ref(false);
const isSavingAttendance = ref(false);

// Modal state
const modalSearchQuery = ref("");
const modalCurrentPage = ref(1);
const modalItemsPerPage = 10;
const availableStudents = ref<any[]>([]);
const selectedNewStudents = reactive<Record<string, boolean>>({});
const isLoadingAvailableStudents = ref(false);
const isAddingStudents = ref(false);

// Data
const group = ref<any>(null);
const students = ref<any[]>([]);
const existingAttendance = ref<any[]>([]);

// Initialize attendance tracking
const attendance = reactive<Record<string, { presence: string }>>({});

// Helper to get auth headers
const getAuthHeaders = () => ({
  Authorization: `Bearer ${authStore.token}`,
  "Content-Type": "application/json",
});

// Fetch group data
const fetchGroup = async () => {
  try {
    isLoading.value = true;
    const response = await $fetch(`${API_BASE_URL}/groups/${groupId}`, {
      headers: getAuthHeaders(),
    });
    group.value = response;
    students.value = response.students || [];

    // Initialize attendance for all students
    students.value.forEach((student) => {
      if (!attendance[student.id]) {
        attendance[student.id] = {
          presence: "absent",
        };
      }
    });
  } catch (error: any) {
    console.error("Failed to fetch group:", error);
    toast.error("Failed to load group data");
  } finally {
    isLoading.value = false;
  }
};

// Fetch today's attendance
const fetchTodayAttendance = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await $fetch(
      `${API_BASE_URL}/attendance?centerId=${authStore.user?.center_id}&groupId=${groupId}&startDate=${today}&endDate=${today}`,
      {
        headers: getAuthHeaders(),
      }
    );
    existingAttendance.value = response;

    // Update attendance state with existing data
    response.forEach((record: any) => {
      if (attendance[record.student_id]) {
        attendance[record.student_id].presence = record.status;
      }
    });
  } catch (error: any) {
    console.error("Failed to fetch attendance:", error);
  }
};

// Save attendance
const saveAttendance = async () => {
  try {
    isSavingAttendance.value = true;
    const today = new Date().toISOString().split("T")[0];

    // Group students by their status
    const presentStudents = students.value.filter(
      (student) => attendance[student.id]?.presence === "present"
    );
    const absentStudents = students.value.filter(
      (student) => attendance[student.id]?.presence === "absent"
    );

    // Send bulk attendance for present students
    if (presentStudents.length > 0) {
      await $fetch(`${API_BASE_URL}/attendance/bulk`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: {
          student_ids: presentStudents.map((s) => s.id),
          teacher_id: authStore.user?.id,
          group_id: groupId,
          center_id: authStore.user?.center_id,
          status: "present",
          taken_date: today,
        },
      });
    }

    // Send bulk attendance for absent students
    if (absentStudents.length > 0) {
      await $fetch(`${API_BASE_URL}/attendance/bulk`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: {
          student_ids: absentStudents.map((s) => s.id),
          teacher_id: authStore.user?.id,
          group_id: groupId,
          center_id: authStore.user?.center_id,
          status: "absent",
          taken_date: today,
        },
      });
    }

    toast.success("Attendance saved successfully");
  } catch (error: any) {
    console.error("Failed to save attendance:", error);
    toast.error(error.data?.message || "Failed to save attendance");
  } finally {
    isSavingAttendance.value = false;
  }
};

// Computed
const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value;
  return students.value.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.id?.toString().includes(searchQuery.value) ||
      student.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredAvailableStudents = computed(() => {
  const enrolledIds = students.value.map((s) => s.id);
  const available = availableStudents.value.filter(
    (s) => !enrolledIds.includes(s.id)
  );

  if (!modalSearchQuery.value) return available;

  return available.filter(
    (student) =>
      student.name
        ?.toLowerCase()
        .includes(modalSearchQuery.value.toLowerCase()) ||
      student.email
        ?.toLowerCase()
        .includes(modalSearchQuery.value.toLowerCase()) ||
      student.phone
        ?.toLowerCase()
        .includes(modalSearchQuery.value.toLowerCase())
  );
});

const paginatedAvailableStudents = computed(() => {
  const start = (modalCurrentPage.value - 1) * modalItemsPerPage;
  const end = start + modalItemsPerPage;
  return filteredAvailableStudents.value.slice(start, end);
});

const selectedStudentsCount = computed(() => {
  return Object.values(selectedNewStudents).filter((v) => v).length;
});

const allPageStudentsSelected = computed(() => {
  if (paginatedAvailableStudents.value.length === 0) return false;
  return paginatedAvailableStudents.value.every(
    (s) => selectedNewStudents[s.id]
  );
});

// Methods
const getInitials = (name: string) => {
  if (!name) return "??";
  const parts = name.split(" ");
  return parts
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatTodayDate = () => {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const calculateAge = (birthDate: string) => {
  if (!birthDate) return "N/A";
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const adjustedAge =
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())
      ? age - 1
      : age;
  return `${adjustedAge} y.o. (${birthDate})`;
};

const notifyParents = async () => {
  // Save attendance first
  await saveAttendance();
  toast.success("Parents will be notified");
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleModalPageChange = (page: number) => {
  modalCurrentPage.value = page;
};

const toggleAllPageStudents = (checked: boolean) => {
  paginatedAvailableStudents.value.forEach((student) => {
    selectedNewStudents[student.id] = checked;
  });
};

const fetchAvailableStudents = async () => {
  try {
    isLoadingAvailableStudents.value = true;
    const response = await $fetch(
      `${API_BASE_URL}/users/students?centerId=${authStore.user?.center_id}`,
      {
        headers: getAuthHeaders(),
      }
    );
    availableStudents.value = response;
  } catch (error: any) {
    console.error("Failed to fetch available students:", error);
    toast.error("Failed to load available students");
  } finally {
    isLoadingAvailableStudents.value = false;
  }
};

const closeAddStudentModal = () => {
  showCreateStudentModal.value = false;
  modalSearchQuery.value = "";
  modalCurrentPage.value = 1;
  Object.keys(selectedNewStudents).forEach((key) => {
    delete selectedNewStudents[key];
  });
};

const addSelectedStudents = async () => {
  const selectedIds = Object.entries(selectedNewStudents)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  if (selectedIds.length === 0) {
    toast.warning("Please select students to add");
    return;
  }

  try {
    isAddingStudents.value = true;
    await $fetch(`${API_BASE_URL}/groups/${groupId}/add-students`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: { student_ids: selectedIds },
    });

    toast.success(
      `${selectedIds.length} student${
        selectedIds.length !== 1 ? "s" : ""
      } added to group`
    );
    closeAddStudentModal();
    await fetchGroup();
  } catch (error: any) {
    console.error("Failed to add students:", error);
    toast.error(error.data?.message || "Failed to add students");
  } finally {
    isAddingStudents.value = false;
  }
};

const removeFromGroup = async () => {
  const selectedIds = Object.entries(selectedStudents)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  if (selectedIds.length === 0) {
    toast.warning("Please select students to remove");
    return;
  }

  try {
    await $fetch(`${API_BASE_URL}/groups/${groupId}/remove-students`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: { student_ids: selectedIds },
    });

    toast.success("Students removed from group");

    // Clear selections
    Object.keys(selectedStudents).forEach((key) => {
      selectedStudents[key] = false;
    });

    // Refresh group data
    await fetchGroup();
  } catch (error: any) {
    console.error("Failed to remove students:", error);
    toast.error(error.data?.message || "Failed to remove students");
  }
};

// Lifecycle
onMounted(async () => {
  await fetchGroup();
  await fetchTodayAttendance();
});

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === "attendance") {
    fetchTodayAttendance();
  }
});

// Watch for modal opening
watch(showCreateStudentModal, (isOpen) => {
  if (isOpen) {
    fetchAvailableStudents();
  }
});

useHead({
  title: "My Groups - LMS",
});

definePageMeta({
  layout: "teacher",
  middleware: "auth",
});
</script>

<style scoped>
/* Radio button styling */
input[type="radio"] {
  appearance: none;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
}

input[type="radio"]:checked::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: currentColor;
}
</style>
