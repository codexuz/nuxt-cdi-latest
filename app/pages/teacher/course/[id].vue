<template>
  <motion.div
    class="min-h-screen bg-gray-50"
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.4 }"
  >
    <!-- Header -->
    <motion.div
      class="bg-white border-b sticky top-0 z-10"
      :initial="{ opacity: 0, y: -10 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, delay: 0.1 }"
    >
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Button variant="ghost" size="icon" @click="$router.back()">
              <ArrowLeft class="h-5 w-5" />
            </Button>
            <div>
              <h1 class="text-2xl font-bold">{{ course?.title }}</h1>
              <p class="text-sm text-muted-foreground">
                {{ totalModules }} modules • {{ totalLessons }} lessons
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Badge
              :variant="
                course?.status === 'published' ? 'default' : 'secondary'
              "
            >
              {{ course?.status }}
            </Badge>
            <Button
              v-if="course?.status !== 'published'"
              class="bg-green-600 hover:bg-green-700"
              size="sm"
              @click="publishCourse"
            >
              Publish Course
            </Button>
            <Button v-else variant="outline" size="sm" @click="unpublishCourse">
              Unpublish
            </Button>
          </div>
        </div>
      </div>
    </motion.div>

    <!-- Main Content -->
    <motion.div
      class="container mx-auto px-4 py-6"
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, delay: 0.2 }"
    >
      <div class="grid grid-cols-12 gap-6">
        <!-- Sidebar Navigation -->
        <div class="col-span-3">
          <Card class="sticky top-24">
            <CardContent class="p-4">
              <nav class="space-y-1">
                <Button
                  v-for="tab in tabs"
                  :key="tab.id"
                  :variant="activeTab === tab.id ? 'default' : 'ghost'"
                  class="w-full justify-start"
                  @click="activeTab = tab.id"
                >
                  <component :is="tab.icon" class="h-4 w-4 mr-2" />
                  {{ tab.label }}
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        <!-- Main Content Area -->
        <div class="col-span-9">
          <!-- Content Tab -->
          <div v-if="activeTab === 'content'">
            <Card class="mb-6">
              <CardHeader class="border-b bg-muted/30">
                <div class="flex items-center justify-between">
                  <div>
                    <CardTitle class="flex items-center gap-2">
                      <div
                        class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"
                      >
                        <BookOpen class="h-4 w-4 text-primary" />
                      </div>
                      Content
                    </CardTitle>
                    <CardDescription class="mt-1">
                      Manage modules, lessons, and course structure
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent class="p-0">
                <!-- Empty State -->
                <div v-if="modules.length === 0" class="py-16 text-center">
                  <div
                    class="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"
                  >
                    <Layers class="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 class="text-lg font-semibold mb-2">No modules yet</h3>
                  <p class="text-muted-foreground mb-4">
                    Start building your course by adding modules
                  </p>
                  <Button @click="openAddModuleDialog">
                    <Plus class="h-4 w-4 mr-2" />
                    Create First Module
                  </Button>
                </div>

                <!-- Modules List -->
                <div v-else ref="modulesContainer" class="space-y-4 p-6">
                  <div
                    v-for="(module, moduleIndex) in modules"
                    :key="module.id"
                    :data-id="module.id"
                    class="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <!-- Module Header -->
                    <div
                      class="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      :class="{
                        'border-b border-gray-100': expandedModules.includes(
                          module.id
                        ),
                      }"
                      @click="toggleModule(module.id)"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <div
                            class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center"
                          >
                            <BookOpen class="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 class="font-semibold text-gray-900">
                              {{ module.title }}
                            </h3>
                            <p class="text-sm text-gray-500">
                              Modified today
                              {{
                                new Date().toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              }}
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <Badge variant="outline" class="text-xs">
                            {{ module.lessons?.length || 0 }} lessons
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            class="h-8 w-8"
                            @click.stop
                          >
                            <ChevronDown
                              class="h-4 w-4 transition-transform duration-200"
                              :class="{
                                'rotate-180': !expandedModules.includes(
                                  module.id
                                ),
                              }"
                            />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild @click.stop>
                              <Button
                                variant="ghost"
                                size="icon"
                                class="h-8 w-8"
                              >
                                <MoreVertical class="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem @click="editModule(module)">
                                <Pencil class="h-4 w-4 mr-2" />
                                Edit Module
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                @click="confirmDeleteModule(module)"
                              >
                                <Trash2 class="h-4 w-4 mr-2 text-destructive" />
                                Delete Module
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>

                    <!-- Lessons List -->
                    <div
                      v-show="expandedModules.includes(module.id)"
                      class="p-4"
                    >
                      <div
                        v-if="module.lessons && module.lessons.length > 0"
                        :ref="el => lessonsContainers[module.id] = el as HTMLElement"
                        class="space-y-2 mb-3"
                      >
                        <div
                          v-for="(lesson, lessonIndex) in module.lessons"
                          :key="lesson.id"
                          :data-id="lesson.id"
                          class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                          @click="viewLessonContent(module, lesson)"
                        >
                          <div class="flex items-center gap-3 flex-1">
                            <span class="text-sm font-medium text-gray-400"
                              ># {{ lessonIndex + 1 }}</span
                            >
                            <div class="flex items-center gap-2">
                              <FileText class="h-4 w-4 text-gray-400" />
                              <span class="font-medium text-gray-700">{{
                                lesson.title
                              }}</span>
                            </div>
                            <span class="text-xs text-gray-400">
                              Modified today
                              {{
                                new Date().toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              }}
                            </span>
                          </div>
                          <div
                            class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              class="h-8 w-8"
                              @click.stop="viewLessonContent(module, lesson)"
                            >
                              <Eye class="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              class="h-8 w-8"
                              @click.stop="confirmDeleteLesson(module, lesson)"
                            >
                              <Trash2 class="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <!-- Add Lesson Button -->
                      <Button
                        variant="ghost"
                        class="w-full border-dashed border-2 border-gray-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                        @click="openAddLessonDialog(module)"
                      >
                        <Plus class="h-4 w-4 mr-2" />
                        Add lesson
                      </Button>
                    </div>
                  </div>

                  <!-- Add Module Button -->
                  <Button
                    variant="outline"
                    class="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50 py-8"
                    @click="openAddModuleDialog"
                  >
                    <Plus class="h-4 w-4 mr-2" />
                    Add module
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Settings Tab -->
          <div v-if="activeTab === 'settings'">
            <Card>
              <CardHeader class="border-b bg-muted/30">
                <CardTitle class="flex items-center gap-2">
                  <Settings class="h-5 w-5" />
                  Course Settings
                </CardTitle>
              </CardHeader>
              <CardContent class="p-6">
                <div class="space-y-4">
                  <div class="space-y-2">
                    <Label>Course Title</Label>
                    <Input v-model="course.title" />
                  </div>
                  <div class="space-y-2">
                    <Label>Description</Label>
                    <Textarea v-model="course.description" rows="4" />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>

    <!-- Add/Edit Module Dialog -->
    <Dialog v-model:open="moduleDialogOpen">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{
            editingModule ? "Edit Module" : "Add Module"
          }}</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Module Title *</Label>
            <Input
              v-model="moduleForm.title"
              placeholder="e.g., Introduction to Course"
            />
          </div>
          <div class="space-y-2">
            <Label>Description</Label>
            <Textarea v-model="moduleForm.description" rows="3" />
          </div>
          <div class="space-y-2">
            <Label>Order</Label>
            <Input v-model.number="moduleForm.order" type="number" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="moduleDialogOpen = false"
            >Cancel</Button
          >
          <Button @click="saveModule">
            {{ editingModule ? "Update" : "Create" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add/Edit Lesson Dialog -->
    <Dialog v-model:open="lessonDialogOpen">
      <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{
            editingLesson ? "Edit Lesson" : "Add Lesson"
          }}</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Lesson Title *</Label>
            <Input
              v-model="lessonForm.title"
              placeholder="e.g., Getting Started"
            />
          </div>
          <template v-if="editingLesson">
            <div class="space-y-2">
              <Label>Content</Label>
              <div class="border rounded-md">
                <QuillEditor
                  v-model:content="contentHtml"
                  contentType="html"
                  toolbar="full"
                  theme="snow"
                />
              </div>
            </div>
            <div class="space-y-2">
              <Label>Video URL</Label>
              <Input
                v-model="lessonForm.video_url"
                placeholder="Enter video URL"
              />
            </div>
          </template>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="lessonDialogOpen = false"
            >Cancel</Button
          >
          <Button @click="saveLesson">
            {{ editingLesson ? "Update" : "Create" }}
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
            {{ deleteMessage }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="confirmDelete"
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
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { motion } from "motion-v";
import { useSortable } from "@vueuse/integrations/useSortable";
import {
  ArrowLeft,
  BookOpen,
  Settings,
  Users,
  Plus,
  Layers,
  GripVertical,
  FileText,
  Eye,
  Trash2,
  MoreVertical,
  Pencil,
  ChevronDown,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

const route = useRoute();
const config = useRuntimeConfig();
const API_BASE_URL = config.public.baseURL as string;
const authStore = useAuthStore();

const courseId = route.params.id as string;

const tabs = [
  { id: "content", label: "Content", icon: BookOpen },
  { id: "settings", label: "Settings", icon: Settings },
];

const activeTab = ref("content");
const course = ref<any>(null);
const modules = ref<any[]>([]);
const expandedModules = ref<string[]>([]);
const modulesContainer = ref<HTMLElement | null>(null);
const lessonsContainers = ref<Record<string, HTMLElement | null>>({});
const lessonsSortableInstances = ref<Record<string, any>>({});

const moduleDialogOpen = ref(false);
const lessonDialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const editingModule = ref<any>(null);
const editingLesson = ref<any>(null);
const currentModule = ref<any>(null);
const deleteTarget = ref<any>(null);
const deleteType = ref<"module" | "lesson">("module");

const moduleForm = ref({
  title: "",
  description: "",
  order: 1,
});

const lessonForm = ref({
  title: "",
  content: {} as any,
  video_url: "",
  order: 1,
});

const contentHtml = ref("");

const getAuthHeaders = () => ({
  Authorization: `Bearer ${authStore.token}`,
  "Content-Type": "application/json",
});

const totalModules = computed(() => modules.value.length);
const totalLessons = computed(() => {
  return modules.value.reduce(
    (sum, module) => sum + (module.lessons?.length || 0),
    0
  );
});

const deleteMessage = computed(() => {
  if (deleteType.value === "module") {
    return `This will permanently delete the module "${deleteTarget.value?.title}" and all its lessons.`;
  }
  return `This will permanently delete the lesson "${deleteTarget.value?.title}".`;
});

// Toggle module collapse/expand
const toggleModule = (moduleId: string) => {
  const index = expandedModules.value.indexOf(moduleId);
  if (index > -1) {
    expandedModules.value.splice(index, 1);
  } else {
    expandedModules.value.push(moduleId);
    // Reinitialize sortable for newly opened module
    setTimeout(() => {
      initLessonsSortable(moduleId);
    }, 100);
  }
};

// Fetch course details
const fetchCourse = async () => {
  try {
    const centerId = authStore.user?.center_id;
    const response = await $fetch(
      `${API_BASE_URL}/centers/${centerId}/lms/courses/${courseId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    course.value = response;
  } catch (error: any) {
    toast.error("Failed to load course");
  }
};

// Update module order
const updateModulesOrder = async () => {
  try {
    await Promise.all(
      modules.value.map((module, index) =>
        $fetch(
          `${API_BASE_URL}/centers/${authStore.user?.center_id}/lms/modules/${module.id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: { ...module, order: index + 1 },
          }
        )
      )
    );
    toast.success("Module order updated");
  } catch (error) {
    toast.error("Failed to update module order");
  }
};

// Update lesson order
const updateLessonsOrder = async (moduleId: string) => {
  try {
    const module = modules.value.find((m) => m.id === moduleId);
    if (!module || !module.lessons) return;

    await Promise.all(
      module.lessons.map((lesson: any, index: number) =>
        $fetch(
          `${API_BASE_URL}/centers/${authStore.user?.center_id}/lms/lessons/${lesson.id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: { ...lesson, order: index + 1 },
          }
        )
      )
    );
    toast.success("Lesson order updated");
  } catch (error) {
    toast.error("Failed to update lesson order");
  }
};

// Initialize sortable for modules
const initModulesSortable = () => {
  nextTick(() => {
    if (modulesContainer.value) {
      useSortable(modulesContainer.value, modules, {
        animation: 150,
        handle: ".module-drag-handle",
        onEnd: () => updateModulesOrder(),
      });
    }
  });
};

// Initialize sortable for lessons
const initLessonsSortable = (moduleId: string) => {
  nextTick(() => {
    // Cleanup old instance if exists
    if (lessonsSortableInstances.value[moduleId]) {
      lessonsSortableInstances.value[moduleId] = null;
    }

    const container = lessonsContainers.value[moduleId];
    if (container) {
      const module = modules.value.find((m) => m.id === moduleId);
      if (module && module.lessons && module.lessons.length > 0) {
        lessonsSortableInstances.value[moduleId] = useSortable(
          container,
          module.lessons,
          {
            animation: 150,
            handle: ".lesson-drag-handle",
            onEnd: () => updateLessonsOrder(moduleId),
          }
        );
      }
    }
  });
};

// Fetch modules with lessons
// Watch for accordion changes to reinitialize lessons sortable
watch(expandedModules, (newExpanded, oldExpanded) => {
  // Find newly opened modules
  const openedModules = newExpanded.filter((id) => !oldExpanded?.includes(id));
  openedModules.forEach((moduleId) => {
    // Small delay to ensure DOM is rendered
    setTimeout(() => {
      initLessonsSortable(moduleId);
    }, 100);
  });
});

const fetchModules = async () => {
  try {
    const centerId = authStore.user?.center_id;
    const modulesResponse = await $fetch(
      `${API_BASE_URL}/centers/${centerId}/lms/courses/${courseId}/modules`,
      {
        headers: getAuthHeaders(),
      }
    );

    // Fetch lessons for each module
    const modulesWithLessons = await Promise.all(
      modulesResponse.map(async (module: any) => {
        try {
          const lessons = await $fetch(
            `${API_BASE_URL}/centers/${authStore.user?.center_id}/lms/modules/${module.id}/lessons`,
            {
              headers: getAuthHeaders(),
            }
          );
          return { ...module, lessons };
        } catch (error) {
          console.error(
            `Failed to fetch lessons for module ${module.id}:`,
            error
          );
          return { ...module, lessons: [] };
        }
      })
    );

    modules.value = modulesWithLessons;
    expandedModules.value = modules.value.map((m) => m.id);
    initModulesSortable();
    // Initialize lessons sortable with delay to ensure DOM is ready
    nextTick(() => {
      setTimeout(() => {
        modules.value.forEach((m) => initLessonsSortable(m.id));
      }, 150);
    });
  } catch (error: any) {
    toast.error("Failed to load modules");
  }
};

// Module functions
const openAddModuleDialog = () => {
  editingModule.value = null;
  moduleForm.value = {
    title: "",
    description: "",
    order: modules.value.length + 1,
  };
  moduleDialogOpen.value = true;
};

const editModule = (module: any) => {
  editingModule.value = module;
  moduleForm.value = { ...module };
  moduleDialogOpen.value = true;
};

const saveModule = async () => {
  try {
    const payload = { ...moduleForm.value };

    if (editingModule.value) {
      const centerId = authStore.user?.center_id;
      await $fetch(
        `${API_BASE_URL}/centers/${centerId}/lms/modules/${editingModule.value.id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: payload,
        }
      );
      toast.success("Module updated");
    } else {
      const centerId = authStore.user?.center_id;
      await $fetch(
        `${API_BASE_URL}/centers/${centerId}/lms/courses/${courseId}/modules`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: payload,
        }
      );
      toast.success("Module created");
    }

    moduleDialogOpen.value = false;
    await fetchModules();
  } catch (error: any) {
    toast.error("Failed to save module");
  }
};

const confirmDeleteModule = (module: any) => {
  deleteTarget.value = module;
  deleteType.value = "module";
  deleteDialogOpen.value = true;
};

// Lesson functions
const openAddLessonDialog = (module: any) => {
  currentModule.value = module;
  editingLesson.value = null;
  lessonForm.value = {
    title: "",
    content: {},
    video_url: "",
    order: (module.lessons?.length || 0) + 1,
  };
  contentHtml.value = "";
  lessonDialogOpen.value = true;
};

const editLesson = (module: any, lesson: any) => {
  currentModule.value = module;
  editingLesson.value = lesson;
  lessonForm.value = { ...lesson };
  contentHtml.value = lesson.content?.html || lesson.content?.text || "";
  lessonDialogOpen.value = true;
};

const viewLessonContent = (module: any, lesson: any) => {
  navigateTo(
    `/teacher/course/${courseId}/module/${module.id}/lesson/${lesson.id}/content`
  );
};

const saveLesson = async () => {
  try {
    // When creating new lesson, only send title and order
    // When editing, send all fields
    const payload = editingLesson.value
      ? {
          title: lessonForm.value.title,
          content: { html: contentHtml.value },
          video_url: lessonForm.value.video_url || "",
          order: lessonForm.value.order,
        }
      : {
          title: lessonForm.value.title,
          order: lessonForm.value.order,
        };

    if (editingLesson.value) {
      const centerId = authStore.user?.center_id;
      await $fetch(
        `${API_BASE_URL}/centers/${centerId}/lms/lessons/${editingLesson.value.id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: payload,
        }
      );
      toast.success("Lesson updated");
    } else {
      const centerId = authStore.user?.center_id;
      await $fetch(
        `${API_BASE_URL}/centers/${centerId}/lms/modules/${currentModule.value.id}/lessons`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: payload,
        }
      );
      toast.success("Lesson created");
    }

    lessonDialogOpen.value = false;
    await fetchModules();
  } catch (error: any) {
    toast.error("Failed to save lesson");
  }
};

const confirmDeleteLesson = (module: any, lesson: any) => {
  currentModule.value = module;
  deleteTarget.value = lesson;
  deleteType.value = "lesson";
  deleteDialogOpen.value = true;
};

const confirmDelete = async () => {
  try {
    if (deleteType.value === "module") {
      const centerId = authStore.user?.center_id;
      await $fetch(
        `${API_BASE_URL}/centers/${centerId}/lms/modules/${deleteTarget.value.id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      toast.success("Module deleted");
    } else {
      const centerId = authStore.user?.center_id;
      await $fetch(
        `${API_BASE_URL}/centers/${centerId}/lms/lessons/${deleteTarget.value.id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      toast.success("Lesson deleted");
    }

    deleteDialogOpen.value = false;
    await fetchModules();
  } catch (error: any) {
    toast.error("Failed to delete");
  }
};

const publishCourse = async () => {
  try {
    const centerId = authStore.user?.center_id;
    await $fetch(
      `${API_BASE_URL}/centers/${centerId}/lms/courses/${courseId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: {
          ...course.value,
          status: "published",
        },
      }
    );
    toast.success("Course published successfully");
    await fetchCourse();
  } catch (error: any) {
    toast.error("Failed to publish course");
  }
};

const unpublishCourse = async () => {
  try {
    const centerId = authStore.user?.center_id;
    await $fetch(
      `${API_BASE_URL}/centers/${centerId}/lms/courses/${courseId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: {
          ...course.value,
          status: "draft",
        },
      }
    );
    toast.success("Course unpublished");
    await fetchCourse();
  } catch (error: any) {
    toast.error("Failed to unpublish course");
  }
};

onMounted(() => {
  fetchCourse();
  fetchModules();
});

useHead({
  title: "Course Builder - LMS",
});

definePageMeta({
  layout: "teacher",
  middleware: "auth",
});
</script>
