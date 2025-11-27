<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <Toaster position="top-center" richColors theme="system" />

    <!-- Central Content Area -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto p-8">
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
    </div>

    <!-- Right Sidebar with Shadcn UI Tabs -->
    <div class="w-96 bg-white border-l border-gray-200 shadow-xl">
      <Tabs :model-value="activeTab" @update:model-value="(val) => activeTab = val" orientation="vertical" class="flex h-full">
        <TabsList class="w-16 border-r border-gray-200 flex flex-col py-4 bg-white rounded-none h-full justify-start gap-1">
          <TabsTrigger
            v-for="tab in tabs"
            :key="tab.id"
            :value="tab.id"
            class="flex flex-col items-center justify-center gap-2 px-2 py-4 text-xs font-medium transition-all relative group data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-lg w-full"
            :title="tab.label"
          >
            <component :is="tab.icon" class="h-5 w-5" />
            <span class="text-[10px] leading-tight text-center">{{ tab.label }}</span>
            <div
              class="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r opacity-0 group-data-[state=active]:opacity-100 transition-opacity"
            ></div>
          </TabsTrigger>
        </TabsList>

        <!-- Settings Tab Content -->
        <TabsContent value="settings" class="flex-1 overflow-y-auto p-6 mt-0">
          <SettingsTab
            :lesson="lesson"
            :is-saving="isSaving"
            @update:lesson="lesson = $event"
            @save="saveContent"
          />
        </TabsContent>

        <!-- Content Tab Content -->
        <TabsContent value="content" class="flex-1 overflow-y-auto p-6 mt-0">
          <ContentTab
            :content-blocks="contentBlocks"
            @remove-block="removeBlock"
          />
        </TabsContent>

        <!-- Quiz Tab Content -->
        <TabsContent value="quiz" class="flex-1 overflow-y-auto p-6 mt-0">
          <QuizTab
            :quiz-questions="quizQuestions"
            @update:quiz-questions="quizQuestions = $event"
            @add-question="addQuestion"
            @remove-question="removeQuestion"
          />
        </TabsContent>

        <!-- Vocabulary Tab Content -->
        <TabsContent value="vocabulary" class="flex-1 overflow-y-auto p-6 mt-0">
          <VocabularyTab
            :vocabulary-words="vocabularyWords"
            @update:vocabulary-words="vocabularyWords = $event"
            @add-word="addWord"
            @remove-word="removeWord"
          />
        </TabsContent>
      </Tabs>
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
        size: media.size || Math.floor(Math.random() * (5000000 - 100000) + 100000), // Random size if not provided
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
