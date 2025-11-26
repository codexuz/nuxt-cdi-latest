<template>
  <motion.div
    class="min-h-screen bg-gradient-to-b from-muted/30 to-background"
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.4 }"
  >
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <Toaster position="top-center" richColors theme="system" />

      <!-- Header -->
      <motion.div
        class="bg-card border rounded-lg p-6 mb-8 shadow-sm"
        :initial="{ opacity: 0, y: -10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }"
      >
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-3xl font-bold tracking-tight flex items-center gap-2"
            >
              <Folder class="h-8 w-8" />
              Group Management
            </h1>
            <p class="text-sm text-muted-foreground mt-1">
              Manage student groups and class schedules
            </p>
          </div>
          <Button @click="openCreateDialog" class="gap-2">
            <Plus class="h-4 w-4" />
            Create Group
          </Button>
        </div>
      </motion.div>

      <!-- Groups Grid -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <Card v-for="i in 6" :key="i" class="overflow-hidden">
          <CardHeader>
            <Skeleton class="h-6 w-3/4 mb-2" />
            <Skeleton class="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-20 w-full" />
          </CardContent>
        </Card>
      </div>

      <div v-else-if="groups.length === 0" class="text-center py-20">
        <div class="text-muted-foreground">
          <Folder class="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 class="text-xl font-semibold mb-2">No groups yet</h3>
          <p class="mb-4">Create your first group to get started</p>
          <Button @click="openCreateDialog">
            <Plus class="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </div>
      </div>

      <motion.div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.2 }"
      >
        <Card
          v-for="group in groups"
          :key="group.id"
          class="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <CardHeader>
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <CardTitle class="flex items-center gap-2">
                  <Folder class="h-5 w-5" />
                  {{ group.group_name }}
                </CardTitle>
                <CardDescription class="mt-1">
                  {{ group.description }}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <MoreVertical class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="openEditDialog(group)">
                    <Pencil class="h-4 w-4 mr-2" />
                    Edit Group
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="openManageStudentsDialog(group)">
                    <Users class="h-4 w-4 mr-2" />
                    Manage Students
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="confirmDelete(group)"
                    class="text-destructive"
                  >
                    <Trash2 class="h-4 w-4 mr-2" />
                    Delete Group
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-sm flex-wrap">
                <Badge :variant="getLevelVariant(group.level)">
                  {{ group.level }}
                </Badge>
                <Badge variant="outline">
                  <Clock class="h-3 w-3 mr-1" />
                  {{ group.class_time }}
                </Badge>
              </div>
              <div class="space-y-2">
                <div
                  class="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <GraduationCap class="h-4 w-4" />
                  <span>{{
                    group.teacher?.name || "No teacher assigned"
                  }}</span>
                </div>
                <div
                  class="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Users class="h-4 w-4" />
                  <span
                    >{{ group.students?.length || 0 }} /
                    {{ group.max_students }} students</span
                  >
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                class="w-full"
                @click="openManageStudentsDialog(group)"
              >
                <UserPlus class="h-4 w-4 mr-2" />
                Manage Students
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>

    <!-- Create/Edit Group Dialog -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{
            isEditing ? "Edit Group" : "Create Group"
          }}</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Group Name *</Label>
            <Input
              v-model="groupForm.group_name"
              placeholder="e.g., Advanced IELTS Group A"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Level *</Label>
              <Select v-model="groupForm.level">
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="elementary">Elementary</SelectItem>
                  <SelectItem value="pre-intermediate"
                    >Pre-Intermediate</SelectItem
                  >
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="upper-intermediate"
                    >Upper-Intermediate</SelectItem
                  >
                  <SelectItem value="pre-ielts">Pre-IELTS</SelectItem>
                  <SelectItem value="ielts">IELTS</SelectItem>
                  <SelectItem value="cefr">CEFR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Class Time *</Label>
              <Input
                v-model="groupForm.class_time"
                type="time"
                placeholder="09:00"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Teacher *</Label>
            <Select v-model="groupForm.teacher_id">
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="teacher in teachers"
                  :key="teacher.id"
                  :value="teacher.id"
                >
                  {{ teacher.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Max Students *</Label>
            <Input
              v-model.number="groupForm.max_students"
              type="number"
              placeholder="15"
              min="1"
              max="50"
            />
          </div>

          <div class="space-y-2">
            <Label>Description</Label>
            <Textarea
              v-model="groupForm.description"
              placeholder="Brief description of the group..."
              rows="3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="dialogOpen = false">Cancel</Button>
          <Button @click="saveGroup">
            {{ isEditing ? "Update" : "Create" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Manage Students Dialog -->
    <Dialog v-model:open="studentsDialogOpen">
      <DialogContent class="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle
            >Manage Students - {{ currentGroup?.group_name }}</DialogTitle
          >
          <DialogDescription>
            {{ currentGroup?.students?.length || 0 }} /
            {{ currentGroup?.max_students }} students enrolled
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
          <!-- Search Students -->
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="studentSearch"
              placeholder="Search students..."
              class="pl-10"
            />
          </div>

          <!-- Available Students -->
          <div class="space-y-2">
            <Label>Available Students</Label>
            <div
              class="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2"
            >
              <div
                v-for="student in filteredAvailableStudents"
                :key="student.id"
                class="flex items-center justify-between p-2 hover:bg-muted rounded-md"
              >
                <div class="flex items-center gap-3">
                  <Avatar class="h-8 w-8">
                    <AvatarFallback>{{
                      getInitials(student.name)
                    }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="text-sm font-medium">{{ student.name }}</p>
                    <p class="text-xs text-muted-foreground">
                      {{ student.email }}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  @click="addStudentToGroup(student.id)"
                  :disabled="isGroupFull"
                >
                  <Plus class="h-4 w-4" />
                </Button>
              </div>
              <div
                v-if="filteredAvailableStudents.length === 0"
                class="text-center py-4 text-muted-foreground"
              >
                No available students
              </div>
            </div>
          </div>

          <!-- Enrolled Students -->
          <div class="space-y-2">
            <Label>Enrolled Students</Label>
            <div
              class="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2"
            >
              <div
                v-for="student in currentGroup?.students"
                :key="student.id"
                class="flex items-center justify-between p-2 hover:bg-muted rounded-md"
              >
                <div class="flex items-center gap-3">
                  <Avatar class="h-8 w-8">
                    <AvatarFallback>{{
                      getInitials(student.name)
                    }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="text-sm font-medium">
                      {{ student.name }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ student.email }}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  @click="removeStudentFromGroup(student.id)"
                >
                  <X class="h-4 w-4" />
                </Button>
              </div>
              <div
                v-if="!currentGroup?.students?.length"
                class="text-center py-4 text-muted-foreground"
              >
                No enrolled students
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button @click="studentsDialogOpen = false">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the group "{{
              groupToDelete?.group_name
            }}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="deleteGroup"
            class="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </motion.div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { motion } from "motion-v";
import {
  Folder,
  Plus,
  Users,
  Clock,
  Pencil,
  Trash2,
  MoreVertical,
  UserPlus,
  Search,
  X,
  GraduationCap,
} from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const config = useRuntimeConfig();
const API_BASE_URL = config.public.baseURL as string;
const authStore = useAuthStore();
const { activeCenter } = useCenters();

const groups = ref<any[]>([]);
const allStudents = ref<any[]>([]);
const teachers = ref<any[]>([]);
const isLoading = ref(false);
const dialogOpen = ref(false);
const studentsDialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const isEditing = ref(false);
const groupToDelete = ref<any>(null);
const currentGroup = ref<any>(null);
const studentSearch = ref("");

const groupForm = ref({
  group_name: "",
  level: "",
  teacher_id: "",
  description: "",
  class_time: "",
  max_students: 15,
});

const getAuthHeaders = () => ({
  Authorization: `Bearer ${authStore.token}`,
  "Content-Type": "application/json",
});

// Computed
const filteredAvailableStudents = computed(() => {
  if (!allStudents.value.length) return [];

  const enrolledIds = currentGroup.value?.students?.map((s: any) => s.id) || [];
  const available = allStudents.value.filter(
    (student) => !enrolledIds.includes(student.id)
  );

  if (!studentSearch.value) return available;

  return available.filter(
    (student) =>
      student.name?.toLowerCase().includes(studentSearch.value.toLowerCase()) ||
      student.email?.toLowerCase().includes(studentSearch.value.toLowerCase())
  );
});

const isGroupFull = computed(() => {
  if (!currentGroup.value) return false;
  return (
    (currentGroup.value.students?.length || 0) >=
    currentGroup.value.max_students
  );
});

// Helper functions
const getLevelVariant = (level: string) => {
  switch (level) {
    case "beginner":
      return "secondary";
    case "elementary":
      return "secondary";
    case "pre-intermediate":
      return "outline";
    case "intermediate":
      return "default";
    case "upper-intermediate":
      return "default";
    case "pre-ielts":
      return "destructive";
    case "ielts":
      return "destructive";
    case "cefr":
      return "destructive";
    default:
      return "outline";
  }
};

const getInitials = (name: string) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getStudentName = (studentId: string) => {
  const student = allStudents.value.find((s) => s.id === studentId);
  return student?.name || "Unknown";
};

const getStudentEmail = (studentId: string) => {
  const student = allStudents.value.find((s) => s.id === studentId);
  return student?.email || "";
};

const getStudentInitials = (studentId: string) => {
  return getInitials(getStudentName(studentId));
};

// Fetch groups
const fetchGroups = async () => {
  try {
    isLoading.value = true;
    const centerId = activeCenter.value?.id;
    if (!centerId) {
      toast.error("No active center selected");
      return;
    }
    const response = await $fetch(
      `${API_BASE_URL}/groups?centerId=${centerId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    groups.value = response;
  } catch (error: any) {
    console.error("Failed to fetch groups:", error);
    toast.error("Failed to load groups");
  } finally {
    isLoading.value = false;
  }
};

// Fetch all students
const fetchStudents = async () => {
  try {
    const centerId = activeCenter.value?.id;
    if (!centerId) {
      return;
    }
    const response = await $fetch(
      `${API_BASE_URL}/users/students?centerId=${centerId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    allStudents.value = response;
  } catch (error: any) {
    console.error("Failed to fetch students:", error);
  }
};

// Fetch teachers
const fetchTeachers = async () => {
  try {
    const centerId = activeCenter.value?.id;
    if (!centerId) {
      return;
    }
    const response = await $fetch(
      `${API_BASE_URL}/users/teachers?centerId=${centerId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    teachers.value = response;
  } catch (error: any) {
    console.error("Failed to fetch teachers:", error);
  }
};

// Dialog handlers
const openCreateDialog = () => {
  isEditing.value = false;
  groupForm.value = {
    group_name: "",
    level: "",
    teacher_id: "",
    description: "",
    class_time: "",
    max_students: 15,
  };
  dialogOpen.value = true;
};

const openEditDialog = (group: any) => {
  isEditing.value = true;
  groupForm.value = {
    group_name: group.group_name,
    level: group.level,
    teacher_id: group.teacher_id,
    description: group.description,
    class_time: group.class_time,
    max_students: group.max_students,
  };
  currentGroup.value = group;
  dialogOpen.value = true;
};

const openManageStudentsDialog = (group: any) => {
  currentGroup.value = group;
  studentSearch.value = "";
  studentsDialogOpen.value = true;
};

// Save group
const saveGroup = async () => {
  try {
    const centerId = activeCenter.value?.id;
    if (!centerId) {
      toast.error("No active center selected");
      return;
    }
    const payload = {
      ...groupForm.value,
      center_id: centerId,
    };

    if (isEditing.value) {
      await $fetch(`${API_BASE_URL}/groups/${currentGroup.value.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: payload,
      });
      toast.success("Group updated successfully");
    } else {
      await $fetch(`${API_BASE_URL}/groups`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: payload,
      });
      toast.success("Group created successfully");
    }

    dialogOpen.value = false;
    await fetchGroups();
  } catch (error: any) {
    console.error("Failed to save group:", error);
    toast.error(error.data?.message || "Failed to save group");
  }
};

// Delete group
const confirmDelete = (group: any) => {
  groupToDelete.value = group;
  deleteDialogOpen.value = true;
};

const deleteGroup = async () => {
  if (!groupToDelete.value) return;

  try {
    await $fetch(`${API_BASE_URL}/groups/${groupToDelete.value.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    toast.success("Group deleted successfully");
    deleteDialogOpen.value = false;
    await fetchGroups();
  } catch (error: any) {
    console.error("Failed to delete group:", error);
    toast.error(error.data?.message || "Failed to delete group");
  }
};

// Add student to group
const addStudentToGroup = async (studentId: string) => {
  if (!currentGroup.value) return;

  try {
    await $fetch(
      `${API_BASE_URL}/groups/${currentGroup.value.id}/add-students`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: { student_ids: [studentId] },
      }
    );

    toast.success("Student added to group");
    await fetchGroups();
    // Update currentGroup with fresh data
    currentGroup.value = groups.value.find(
      (g) => g.id === currentGroup.value.id
    );
  } catch (error: any) {
    console.error("Failed to add student:", error);
    toast.error(error.data?.message || "Failed to add student");
  }
};

// Remove student from group
const removeStudentFromGroup = async (studentId: string) => {
  if (!currentGroup.value) return;

  try {
    await $fetch(
      `${API_BASE_URL}/groups/${currentGroup.value.id}/remove-students`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: { student_ids: [studentId] },
      }
    );

    toast.success("Student removed from group");
    await fetchGroups();
    // Update currentGroup with fresh data
    currentGroup.value = groups.value.find(
      (g) => g.id === currentGroup.value.id
    );
  } catch (error: any) {
    console.error("Failed to remove student:", error);
    toast.error(error.data?.message || "Failed to remove student");
  }
};

onMounted(() => {
  fetchGroups();
  fetchStudents();
  fetchTeachers();
});

useHead({
  title: "Group Management - LMS",
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "center"],
});
</script>
