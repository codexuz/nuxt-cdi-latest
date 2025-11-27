<template>
  <motion.div
    class="min-h-screen bg-gray-50"
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.4 }"
  >
    <Toaster position="top-center" richColors theme="system" />

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
              <h1 class="text-2xl font-bold">{{ lesson?.title }}</h1>
              <p class="text-sm text-muted-foreground">Edit lesson content</p>
            </div>
          </div>
          <Button @click="saveContent" :disabled="isSaving">
            <Save class="h-4 w-4 mr-2" />
            Save Content
          </Button>
        </div>
      </div>
    </motion.div>

    <!-- Content Editor -->
    <div class="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
      <Card class="m-4 h-[400px] flex items-center justify-center col-span-2">
        <CardContent class="mx-auto text-center space-y-1">
           <CircleFadingPlus
            class="h-[90px] w-[90px] mx-auto text-blue-500 cursor-pointer mb-2"
          />
          <h2 class="text-xl font-semibold">Fill in the content</h2>
          <p class="text-slate-600">It's empty here for now, add the first block below</p>
        </CardContent>
      </Card>
      <Card class="m-4 w-[60%] h-auto">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            Preview the lesson content as it will appear to students.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>

    <!-- Media Picker Modal -->
    <MediaPickerModal
      v-model:open="showMediaPicker"
      @selected="handleMediaSelect"
    />
  </motion.div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { motion } from "motion-v";
import { ArrowLeft, Save, CircleFadingPlus, X } from "lucide-vue-next";
import MediaPickerModal from "@/components/MediaPickerModal.vue";
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

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const API_BASE_URL = config.public.baseURL as string;
const authStore = useAuthStore();

const courseId = route.params.courseId as string;
const moduleId = route.params.moduleId as string;
const lessonId = route.params.lessonId as string;

const lesson = ref<any>({
  title: "",
  content: {
    html: "",
    resources: [],
  },
  video_url: "",
});
const contentHtml = ref("");
const isSaving = ref(false);
const showMediaPicker = ref(false);

const getAuthHeaders = () => ({
  Authorization: `Bearer ${authStore.token}`,
  "Content-Type": "application/json",
});

// Handle media selection
const handleMediaSelect = (media: any) => {
  if (!lesson.value.content.resources) {
    lesson.value.content.resources = [];
  }
  lesson.value.content.resources.push({
    name: media.name || media.filename,
    url: media.url,
    type: media.type,
  });
  showMediaPicker.value = false;
  toast.success("Resource attached");
};

const removeResource = (index: number) => {
  lesson.value.content.resources.splice(index, 1);
  toast.success("Resource removed");
};

// Fetch lesson details
const fetchLesson = async () => {
  try {
    const response = await $fetch(`${API_BASE_URL}/lms/lessons/${lessonId}`, {
      headers: getAuthHeaders(),
    });
    lesson.value = response;

    // Handle content that might be null or missing
    if (!lesson.value.content) {
      lesson.value.content = {
        html: "",
        resources: [],
      };
    } else {
      // Ensure content.resources exists
      if (!lesson.value.content.resources) {
        lesson.value.content.resources = [];
      }
    }

    contentHtml.value =
      lesson.value.content?.html || lesson.value.content?.text || "";
  } catch (error: any) {
    console.error("Failed to fetch lesson:", error);
    toast.error("Failed to load lesson");
  }
};

// Save lesson content
const saveContent = async () => {
  try {
    isSaving.value = true;

    const payload = {
      title: lesson.value.title,
      content: {
        html: contentHtml.value,
        resources: lesson.value.content.resources || [],
      },
      video_url: lesson.value.video_url || "",
      order: lesson.value.order || 1,
    };

    await $fetch(`${API_BASE_URL}/lms/lessons/${lessonId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: payload,
    });

    toast.success("Lesson content saved successfully!");
  } catch (error: any) {
    console.error("Failed to save lesson:", error);
    toast.error(error.data?.message || "Failed to save lesson");
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchLesson();
});

useHead({
  title: "Edit Lesson Content - LMS",
});

definePageMeta({
  layout: "teacher",
  middleware: "auth",
});
</script>

<style>
.ql-editor {
  height: 400px;
  overflow: auto;
}
</style>
