<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <Toaster position="top-center" richColors theme="system" />

    

    <!-- Central Content Area -->
    <div class="flex-1 overflow-y-auto">
           <!-- Back Button -->
    <div class="z-10">
      <Button
        @click="$router.back()"
        class="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg"
      >
        <ArrowLeft class="h-5 w-5 mr-2" />
        Back
      </Button>
    </div>
      <div class="max-w-4xl mx-auto p-8" v-show="activeTab === 'settings'">
        <SettingsTab v-model:lesson="lesson" @save="saveContent" />
      </div>

      <div class="max-w-4xl mx-auto p-8" v-show="activeTab === 'content'">
        <!-- Content Blocks List -->
        <ContentBlockList
          :content-blocks="contentBlocks"
          @update:content-blocks="contentBlocks = $event"
          @remove-block="removeBlock"
          @open-media-picker="openMediaPickerForBlock"
        />

        <!-- Add Block Buttons -->
        <AddBlockButtons @add-block="addBlock" />
      </div>

      <div class="max-w-4xl mx-auto p-8" v-show="activeTab === 'quiz'">
        <QuizTab v-model:questions="quizQuestions" />
      </div>

      <div class="max-w-4xl mx-auto p-8" v-show="activeTab === 'vocabulary'">
        <VocabularyTab v-model:words="vocabularyWords" />
      </div>
    </div>

    <!-- Right Sidebar with Shadcn UI Tabs -->
    <div class="w-80 border-l bg-white shadow-lg overflow-y-auto">
      <div class="p-4 space-y-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'w-full flex items-start gap-3 px-4 py-3 rounded-lg text-left transition-colors',
            activeTab === tab.id
              ? 'bg-primary/10 text-primary'
              : 'hover:bg-gray-100 text-gray-700',
          ]"
        >
          <component :is="tab.icon" class="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <div class="font-medium">{{ tab.label }}</div>
            <div class="text-xs text-muted-foreground mt-0.5">
              {{ getTabDescription(tab.id) }}
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Media Picker Modal -->
    <MediaPickerModal
      v-model:open="showMediaPicker"
      @selected="handleMediaSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  Settings,
  BookOpen,
  HelpCircle,
  BookMarked,
  FileText,
  FileEdit,
  Video,
  Code,
  Paperclip,
  X,
  Save,
  Plus,
  ArrowLeft,
} from "lucide-vue-next";
import MediaPickerModal from "@/components/MediaPickerModal.vue";
import { toast, Toaster } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentBlockList from "@/components/lesson/ContentBlockList.vue";
import AddBlockButtons from "@/components/lesson/AddBlockButtons.vue";
import SettingsTab from "@/components/lesson/SettingsTab.vue";
import ContentTab from "@/components/lesson/ContentTab.vue";
import QuizTab from "@/components/lesson/QuizTab.vue";
import VocabularyTab from "@/components/lesson/VocabularyTab.vue";

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const API_BASE_URL = config.public.baseURL as string;
const authStore = useAuthStore();

const courseId = route.params.courseId as string;
const moduleId = route.params.moduleId as string;
const lessonId = route.params.lessonId as string;

// Tabs configuration
const tabs = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "content", label: "Content", icon: BookOpen },
  { id: "quiz", label: "Quiz", icon: HelpCircle },
  { id: "vocabulary", label: "Vocabulary", icon: BookMarked },
];

const activeTab = ref("settings");

// Lesson data
const lesson = ref<any>({
  title: "",
  description: "",
  order: 1,
  published: false,
  content: {
    html: "",
    resources: [],
  },
  video_url: "",
});

// Content blocks
const contentBlocks = ref<any[]>([]);

// Quiz questions
const quizQuestions = ref<any[]>([]);

// Vocabulary words
const vocabularyWords = ref<any[]>([]);

const isSaving = ref(false);
const showMediaPicker = ref(false);
const currentBlockIndex = ref<number | null>(null);

const getAuthHeaders = () => ({
  Authorization: `Bearer ${authStore.token}`,
  "Content-Type": "application/json",
});

// Get tab description
const getTabDescription = (tabId: string) => {
  switch (tabId) {
    case "settings":
      return "Design and parameters";
    case "content":
      return "Content Builder";
    case "quiz":
      return 'In "Exam" mode';
    case "vocabulary":
      return "Terms and definitions";
    default:
      return "";
  }
};

// Get icon for block type
const getBlockIcon = (type: string) => {
  switch (type) {
    case "Editor":
      return FileEdit;
    case "Video":
      return Video;
    case "Iframe":
      return Code;
    case "Attachment":
      return Paperclip;
    default:
      return FileText;
  }
};

// Add content block
const addBlock = (type: string) => {
  const block = {
    id: Date.now(),
    type,
    title: "",
    content: "",
    url: "",
    files: [],
  };
  contentBlocks.value.push(block);
  toast.success(`${type} block added`);
};

// Remove content block
const removeBlock = (index: number) => {
  contentBlocks.value.splice(index, 1);
  toast.success("Block removed");
};

// Handle media selection
const handleMediaSelect = (media: any) => {
  if (currentBlockIndex.value !== null) {
    const block = contentBlocks.value[currentBlockIndex.value];
    if (block.type === "Attachment") {
      if (!block.files) {
        block.files = [];
      }
      block.files.push({
        name: media.name || media.filename,
        url: media.url,
        type: media.type,
        size:
          media.size || Math.floor(Math.random() * (5000000 - 100000) + 100000), // Random size if not provided
      });
    }
  }
  showMediaPicker.value = false;
  currentBlockIndex.value = null;
  toast.success("Attachment added");
};

// Open media picker for specific block
const openMediaPickerForBlock = (blockIndex: number) => {
  currentBlockIndex.value = blockIndex;
  showMediaPicker.value = true;
};

// Add quiz question
const addQuestion = () => {
  quizQuestions.value.push({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });
  toast.success("Question added");
};

// Remove quiz question
const removeQuestion = (index: number) => {
  quizQuestions.value.splice(index, 1);
  toast.success("Question removed");
};

// Add vocabulary word
const addWord = () => {
  vocabularyWords.value.push({
    term: "",
    definition: "",
    example: "",
  });
  toast.success("Word added");
};

// Remove vocabulary word
const removeWord = (index: number) => {
  vocabularyWords.value.splice(index, 1);
  toast.success("Word removed");
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
    }

    // Load existing content blocks if any
    if (lesson.value.content.blocks) {
      contentBlocks.value = lesson.value.content.blocks;
    }

    // Load quiz questions if any
    if (lesson.value.quiz) {
      quizQuestions.value = lesson.value.quiz;
    }

    // Load vocabulary if any
    if (lesson.value.vocabulary) {
      vocabularyWords.value = lesson.value.vocabulary;
    }
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
      description: lesson.value.description,
      order: lesson.value.order,
      published: lesson.value.published,
      content: {
        blocks: contentBlocks.value,
        resources: lesson.value.content.resources || [],
      },
      quiz: quizQuestions.value,
      vocabulary: vocabularyWords.value,
      video_url: lesson.value.video_url || "",
    };

    await $fetch(`${API_BASE_URL}/lms/lessons/${lessonId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: payload,
    });

    toast.success("Lesson saved successfully!");
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

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Quill Editor Custom Styles */
:deep(.quill-editor-custom .ql-container) {
  min-height: 200px;
  font-size: 14px;
}

:deep(.quill-editor-custom .ql-editor) {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

:deep(.quill-editor-custom .ql-toolbar) {
  background-color: #f9fafb;
  border: none;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.quill-editor-custom .ql-container) {
  border: none;
}

:deep(.quill-editor-custom .ql-editor.ql-blank::before) {
  color: #9ca3af;
  font-style: normal;
}
</style>
