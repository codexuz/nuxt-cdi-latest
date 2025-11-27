<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <Toaster position="top-center" richColors theme="system" />

    <!-- Central Content Area -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto p-8">
        <!-- Empty State -->
        <motion.div
          v-if="contentBlocks.length === 0"
          class="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center mb-8"
          :initial="{ opacity: 0, scale: 0.95 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ duration: 0.3 }"
        >
          <div class="flex items-center justify-center mb-6">
            <div class="bg-blue-50 p-6 rounded-2xl">
              <FileText class="h-16 w-16 text-blue-500" />
            </div>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Fill in the content</h2>
          <p class="text-gray-500 mb-8">It's empty here for now, add the first block below</p>
        </motion.div>

        <!-- Content Blocks -->
        <div v-else class="space-y-4 mb-8">
          <motion.div
            v-for="(block, index) in contentBlocks"
            :key="block.id"
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.3, delay: index * 0.05 }"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <component :is="getBlockIcon(block.type)" class="h-5 w-5 text-blue-500" />
                <span class="font-semibold text-gray-900">{{ block.type }}</span>
              </div>
              <Button variant="ghost" size="icon" @click="removeBlock(index)">
                <X class="h-4 w-4" />
              </Button>
            </div>
            
            <!-- Editor Block -->
            <div v-if="block.type === 'Editor'" class="space-y-4">
              <div>
                <Label class="text-sm font-medium text-gray-700 mb-2 block">Block title</Label>
                <Input
                  v-model="block.title"
                  placeholder="Enter the title"
                  class="w-full"
                />
              </div>
              <div>
                <Label class="text-sm font-medium text-gray-700 mb-2 block">Block content</Label>
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                  <QuillEditor
                    v-model:content="block.content"
                    contentType="html"
                    theme="snow"
                    :toolbar="[
                      ['bold', 'italic', 'underline', 'strike'],
                      ['blockquote', 'code-block'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'script': 'sub'}, { 'script': 'super' }],
                      [{ 'indent': '-1'}, { 'indent': '+1' }],
                      [{ 'size': ['small', false, 'large', 'huge'] }],
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'align': [] }],
                      ['link', 'image', 'video'],
                      ['clean']
                    ]"
                    placeholder="Press / to select a tool"
                    class="quill-editor-custom"
                  />
                </div>
              </div>
            </div>

            <!-- Video Block -->
            <div v-else-if="block.type === 'Video'" class="space-y-4">
              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-3">Upload a video or provide a link</h3>
                
                <!-- URL Input -->
                <div class="relative mb-4">
                  <div class="absolute left-3 top-1/2 -translate-y-1/2">
                    <Link class="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    v-model="block.url"
                    placeholder="You can insert a YouTube, Vimeo or direct video link"
                    class="w-full pl-10"
                  />
                  <button
                    v-if="block.url"
                    @click="block.url = ''"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>

                <!-- Upload Area -->
                <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
                  <button
                    type="button"
                    class="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all group-hover:scale-110"
                  >
                    <Plus class="h-8 w-8" />
                  </button>
                </div>

                <!-- Video Title -->
                <div class="mt-4">
                  <Label class="text-sm font-medium text-red-500 mb-2 block">Video Title</Label>
                  <Input
                    v-model="block.title"
                    placeholder="Enter the title of the video"
                    class="w-full"
                  />
                </div>
              </div>
            </div>

            <!-- Iframe Block -->
            <div v-else-if="block.type === 'Iframe'" class="space-y-3">
              <Input
                v-model="block.url"
                placeholder="Enter iframe URL"
                class="w-full"
              />
              <div v-if="block.url" class="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <Code class="h-12 w-12 text-gray-400" />
              </div>
            </div>

            <!-- Attachment Block -->
            <div v-else-if="block.type === 'Attachment'" class="space-y-4">
              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-1">Pinned attachments</h3>
                <p class="text-sm text-gray-500 mb-4">Will be placed at the very top of the content</p>
                
                <!-- File List -->
                <div v-if="block.files && block.files.length > 0" class="space-y-2 mb-3">
                  <div
                    v-for="(file, fileIndex) in block.files"
                    :key="fileIndex"
                    class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100 group hover:bg-orange-100 transition-colors"
                  >
                    <div class="flex items-center gap-3">
                      <div class="bg-orange-500 p-2 rounded">
                        <FileText class="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                        <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      @click="removeAttachment(index, fileIndex)"
                      class="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X class="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>

                <!-- Add Attachments Button -->
                <Button 
                  @click="openMediaPickerForBlock(index)" 
                  variant="outline" 
                  class="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                >
                  <Paperclip class="h-4 w-4 mr-2" />
                  Add attachments
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <!-- Add Block Buttons -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            @click="addBlock('Editor')"
            class="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            :whileHover="{ scale: 1.02 }"
            :whileTap="{ scale: 0.98 }"
          >
            <div class="flex flex-col items-center gap-3">
              <div class="bg-blue-50 p-4 rounded-xl group-hover:bg-blue-100 transition-colors">
                <FileEdit class="h-8 w-8 text-blue-500" />
              </div>
              <span class="font-medium text-gray-700">Editor</span>
            </div>
          </motion.button>

          <motion.button
            @click="addBlock('Video')"
            class="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all duration-200"
            :whileHover="{ scale: 1.02 }"
            :whileTap="{ scale: 0.98 }"
          >
            <div class="flex flex-col items-center gap-3">
              <div class="bg-purple-50 p-4 rounded-xl group-hover:bg-purple-100 transition-colors">
                <Video class="h-8 w-8 text-purple-500" />
              </div>
              <span class="font-medium text-gray-700">Video</span>
            </div>
          </motion.button>

          <motion.button
            @click="addBlock('Iframe')"
            class="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200"
            :whileHover="{ scale: 1.02 }"
            :whileTap="{ scale: 0.98 }"
          >
            <div class="flex flex-col items-center gap-3">
              <div class="bg-green-50 p-4 rounded-xl group-hover:bg-green-100 transition-colors">
                <Code class="h-8 w-8 text-green-500" />
              </div>
              <span class="font-medium text-gray-700">Iframe</span>
            </div>
          </motion.button>

          <motion.button
            @click="addBlock('Attachment')"
            class="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-200"
            :whileHover="{ scale: 1.02 }"
            :whileTap="{ scale: 0.98 }"
          >
            <div class="flex flex-col items-center gap-3">
              <div class="bg-orange-50 p-4 rounded-xl group-hover:bg-orange-100 transition-colors">
                <Paperclip class="h-8 w-8 text-orange-500" />
              </div>
              <span class="font-medium text-gray-700">Attachment</span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>

    <!-- Right Sidebar -->
    <div class="w-96 bg-white border-l border-gray-200 flex shadow-xl">
      <!-- Vertical Tabs -->
      <div class="w-16 border-r border-gray-200 flex flex-col py-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex flex-col items-center justify-center gap-2 px-2 py-4 text-xs font-medium transition-all relative group"
          :class="[
            activeTab === tab.id
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          ]"
          :title="tab.label"
        >
          <component :is="tab.icon" class="h-5 w-5" />
          <span class="text-[10px] leading-tight text-center">{{ tab.label }}</span>
          <div
            v-if="activeTab === tab.id"
            class="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"
          ></div>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Lesson Settings</h3>
            <div class="space-y-4">
              <div>
                <Label for="lesson-title" class="text-sm font-medium text-gray-700">Lesson Title</Label>
                <Input
                  id="lesson-title"
                  v-model="lesson.title"
                  placeholder="Enter lesson title"
                  class="mt-2"
                />
              </div>
              <div>
                <Label for="lesson-order" class="text-sm font-medium text-gray-700">Order</Label>
                <Input
                  id="lesson-order"
                  v-model.number="lesson.order"
                  type="number"
                  placeholder="Lesson order"
                  class="mt-2"
                />
              </div>
              <div>
                <Label class="text-sm font-medium text-gray-700">Status</Label>
                <div class="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="lesson.published"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-600">Published</span>
                </div>
              </div>
            </div>
          </div>
          <Button @click="saveContent" class="w-full" :disabled="isSaving">
            <Save class="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <!-- Content Tab -->
        <div v-else-if="activeTab === 'content'" class="space-y-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Content Blocks</h3>
            <span class="text-sm text-gray-500">{{ contentBlocks.length }} blocks</span>
          </div>
          <div class="space-y-2">
            <div
              v-for="(block, index) in contentBlocks"
              :key="block.id"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <component :is="getBlockIcon(block.type)" class="h-5 w-5 text-gray-500" />
              <span class="text-sm font-medium text-gray-700 flex-1">{{ block.type }}</span>
              <Button variant="ghost" size="icon" @click="removeBlock(index)">
                <X class="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div v-if="contentBlocks.length === 0" class="text-center py-8">
            <FileText class="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p class="text-sm text-gray-500">No content blocks yet</p>
          </div>
        </div>

        <!-- Quiz Tab -->
        <div v-else-if="activeTab === 'quiz'" class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quiz Questions</h3>
            <div class="space-y-4">
              <div
                v-for="(question, index) in quizQuestions"
                :key="index"
                class="p-4 bg-gray-50 rounded-lg space-y-3"
              >
                <div class="flex items-start justify-between">
                  <Label class="text-sm font-medium text-gray-700">Question {{ index + 1 }}</Label>
                  <Button variant="ghost" size="icon" @click="removeQuestion(index)">
                    <X class="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  v-model="question.text"
                  placeholder="Enter question"
                  class="w-full"
                />
                <div class="space-y-2">
                  <Input
                    v-for="(option, optIndex) in question.options"
                    :key="optIndex"
                    v-model="question.options[optIndex]"
                    :placeholder="`Option ${optIndex + 1}`"
                    class="w-full"
                  />
                </div>
                <div>
                  <Label class="text-xs text-gray-600">Correct Answer</Label>
                  <Input
                    v-model.number="question.correctAnswer"
                    type="number"
                    min="0"
                    :max="question.options.length - 1"
                    placeholder="Index of correct answer"
                    class="w-full mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <Button @click="addQuestion" variant="outline" class="w-full">
            <Plus class="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        <!-- Vocabulary Tab -->
        <div v-else-if="activeTab === 'vocabulary'" class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Vocabulary Words</h3>
            <div class="space-y-3">
              <div
                v-for="(word, index) in vocabularyWords"
                :key="index"
                class="p-4 bg-gray-50 rounded-lg space-y-3"
              >
                <div class="flex items-start justify-between">
                  <Label class="text-sm font-medium text-gray-700">Word {{ index + 1 }}</Label>
                  <Button variant="ghost" size="icon" @click="removeWord(index)">
                    <X class="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  v-model="word.term"
                  placeholder="Term"
                  class="w-full"
                />
                <Input
                  v-model="word.definition"
                  placeholder="Definition"
                  class="w-full"
                />
                <Input
                  v-model="word.example"
                  placeholder="Example sentence (optional)"
                  class="w-full"
                />
              </div>
            </div>
          </div>
          <Button @click="addWord" variant="outline" class="w-full">
            <Plus class="h-4 w-4 mr-2" />
            Add Word
          </Button>
        </div>
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
import { motion } from "motion-v";
import {
  FileText,
  FileEdit,
  Video,
  Code,
  Paperclip,
  Settings,
  BookOpen,
  HelpCircle,
  BookMarked,
  X,
  Save,
  Plus,
  Play,
  Bold,
  Italic,
  Underline,
  Heading,
  List,
  Link,
} from "lucide-vue-next";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import MediaPickerModal from "@/components/MediaPickerModal.vue";
import { toast, Toaster } from "vue-sonner";
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

// Tabs configuration
const tabs = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "content", label: "Content", icon: BookOpen },
  { id: "quiz", label: "Quiz", icon: HelpCircle },
  { id: "vocabulary", label: "Vocabulary", icon: BookMarked },
];

const activeTab = ref("content");

// Lesson data
const lesson = ref<any>({
  title: "",
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

// Remove attachment
const removeAttachment = (blockIndex: number, fileIndex: number) => {
  contentBlocks.value[blockIndex].files.splice(fileIndex, 1);
  toast.success("Attachment removed");
};

// Format file size
const formatFileSize = (bytes: number = 0) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
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
