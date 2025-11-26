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
          <div class="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              @click="$router.back()"
              class="shrink-0 hover:bg-muted"
            >
              <ArrowLeft class="h-5 w-5" />
            </Button>
            <div>
              <h1 class="text-3xl font-bold tracking-tight">
                Course Management
              </h1>
              <p class="text-sm text-muted-foreground mt-1">
                Create and manage your courses
              </p>
            </div>
          </div>
          <Button @click="openCreateDialog" class="gap-2">
            <Plus class="h-4 w-4" />
            Create Course
          </Button>
        </div>
      </motion.div>

      <!-- Courses Grid -->
      <motion.div
        v-if="isLoading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.2 }"
      >
        <Card v-for="i in 6" :key="i" class="overflow-hidden">
          <Skeleton class="h-48 w-full" />
          <CardContent class="p-4">
            <Skeleton class="h-6 w-3/4 mb-2" />
            <Skeleton class="h-4 w-full mb-4" />
            <Skeleton class="h-9 w-full" />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        v-else-if="courses.length === 0"
        class="text-center py-20"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.2 }"
      >
        <div class="text-muted-foreground">
          <BookOpen class="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 class="text-xl font-semibold mb-2">No courses yet</h3>
          <p class="mb-4">Create your first course to get started</p>
          <Button @click="openCreateDialog">
            <Plus class="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>
      </motion.div>

      <motion.div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.2 }"
      >
        <Card
          v-for="course in courses"
          :key="course.id"
          class="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="relative h-48 bg-muted">
            <img
              v-if="course.thumbnail"
              :src="course.thumbnail"
              :alt="course.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <BookOpen class="h-16 w-16 text-muted-foreground" />
            </div>
            <Badge
              :variant="course.status === 'published' ? 'default' : 'secondary'"
              class="absolute top-2 right-2"
            >
              {{ course.status }}
            </Badge>
          </div>
          <CardContent class="p-4">
            <h3 class="font-semibold text-lg mb-2 line-clamp-1">
              {{ course.title }}
            </h3>
            <p class="text-sm text-muted-foreground mb-4 line-clamp-2">
              {{ course.description || "No description" }}
            </p>
            <div class="flex gap-2">
              <Button
                variant="default"
                size="sm"
                class="flex-1"
                @click="$router.push(`/teacher/course/${course.id}`)"
              >
                <BookOpen class="h-3 w-3 mr-1" />
                Build
              </Button>
              <Button
                variant="outline"
                size="sm"
                @click="openEditDialog(course)"
              >
                <Pencil class="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                @click="confirmDelete(course)"
              >
                <Trash2 class="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{
            isEditing ? "Edit Course" : "Create Course"
          }}</DialogTitle>
          <DialogDescription>
            {{
              isEditing
                ? "Update course details"
                : "Add a new course to your collection"
            }}
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="title">Title *</Label>
            <Input
              id="title"
              v-model="formData.title"
              placeholder="Enter course title"
            />
          </div>
          <div class="space-y-2">
            <Label for="description">Description</Label>
            <Textarea
              id="description"
              v-model="formData.description"
              placeholder="Enter course description"
              rows="4"
            />
          </div>
          <div class="space-y-2">
            <Label for="thumbnail">Thumbnail URL</Label>
            <div class="flex gap-2">
              <Input
                id="thumbnail"
                v-model="formData.thumbnail"
                placeholder="Enter image URL"
              />
              <Button variant="outline" @click="openMediaPicker" type="button">
                <ImageIcon class="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div class="space-y-2">
            <Label for="status">Status</Label>
            <Select v-model="formData.status">
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="dialogOpen = false">Cancel</Button>
          <Button @click="saveCourse" :disabled="!formData.title || isSaving">
            <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
            {{ isEditing ? "Update" : "Create" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete "{{ courseToDelete?.title }}". This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="deleteCourse"
            class="bg-destructive text-white hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Media Picker Modal -->
    <MediaPickerModal
      v-model:open="showMediaPicker"
      @selected="handleMediaSelect"
      media-type="image"
    />
  </motion.div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { motion } from "motion-v";
import {
  ArrowLeft,
  Plus,
  BookOpen,
  Pencil,
  Trash2,
  Loader2,
  ImageIcon,
} from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MediaPickerModal from "@/components/MediaPickerModal.vue";

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  status: "draft" | "published";
  created_at?: string;
  updated_at?: string;
}

interface CourseFormData {
  title: string;
  description: string;
  thumbnail: string;
  status: "draft" | "published";
}

const config = useRuntimeConfig();
const API_BASE_URL = config.public.baseURL as string;
const authStore = useAuthStore();

const courses = ref<Course[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const dialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const showMediaPicker = ref(false);
const isEditing = ref(false);
const editingCourseId = ref<string | null>(null);
const courseToDelete = ref<Course | null>(null);

const formData = ref<CourseFormData>({
  title: "",
  description: "",
  thumbnail: "",
  status: "draft",
});

const getAuthHeaders = () => ({
  Authorization: `Bearer ${authStore.token}`,
  "Content-Type": "application/json",
});

// Fetch all courses
const fetchCourses = async () => {
  try {
    isLoading.value = true;
    const response = await $fetch<Course[]>(`${API_BASE_URL}/lms/courses`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    courses.value = response;
  } catch (error: any) {
    console.error("Failed to fetch courses:", error);
    toast.error("Failed to load courses");
  } finally {
    isLoading.value = false;
  }
};

// Open create dialog
const openCreateDialog = () => {
  isEditing.value = false;
  editingCourseId.value = null;
  formData.value = {
    title: "",
    description: "",
    thumbnail: "",
    status: "draft",
  };
  dialogOpen.value = true;
};

// Open edit dialog
const openEditDialog = (course: Course) => {
  isEditing.value = true;
  editingCourseId.value = course.id;
  formData.value = {
    title: course.title,
    description: course.description || "",
    thumbnail: course.thumbnail || "",
    status: course.status,
  };
  dialogOpen.value = true;
};

// Save course (create or update)
const saveCourse = async () => {
  if (!formData.value.title) {
    toast.error("Please enter a course title");
    return;
  }

  try {
    isSaving.value = true;
    const payload = {
      title: formData.value.title,
      description: formData.value.description,
      thumbnail: formData.value.thumbnail,
      status: formData.value.status,
    };

    if (isEditing.value && editingCourseId.value) {
      // Update existing course
      await $fetch(`${API_BASE_URL}/lms/courses/${editingCourseId.value}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: payload,
      });
      toast.success("Course updated successfully");
    } else {
      // Create new course
      await $fetch(`${API_BASE_URL}/lms/courses`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: payload,
      });
      toast.success("Course created successfully");
    }

    dialogOpen.value = false;
    await fetchCourses();
  } catch (error: any) {
    console.error("Failed to save course:", error);
    toast.error(error.data?.message || "Failed to save course");
  } finally {
    isSaving.value = false;
  }
};

// Confirm delete
const confirmDelete = (course: Course) => {
  courseToDelete.value = course;
  deleteDialogOpen.value = true;
};

// Delete course
const deleteCourse = async () => {
  if (!courseToDelete.value) return;

  try {
    await $fetch(`${API_BASE_URL}/lms/courses/${courseToDelete.value.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    toast.success("Course deleted successfully");
    deleteDialogOpen.value = false;
    await fetchCourses();
  } catch (error: any) {
    console.error("Failed to delete course:", error);
    toast.error(error.data?.message || "Failed to delete course");
  }
};

// Media picker
const openMediaPicker = () => {
  showMediaPicker.value = true;
};

const handleMediaSelect = (media: any) => {
  formData.value.thumbnail = media.url;
  showMediaPicker.value = false;
};

onMounted(() => {
  fetchCourses();
});

useHead({
  title: "Course Management - LMS",
});

definePageMeta({
  layout: "teacher",
  middleware: "auth",
});
</script>
