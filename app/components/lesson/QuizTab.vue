<template>
  <div class="space-y-8">
    <!-- Quiz Header -->
    <div
      class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100"
    >
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center"
          >
            <template v-if="isLoading">
              <div
                class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"
              ></div>
            </template>
            <Brain v-else class="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Quiz Builder</h3>
            <p class="text-sm text-gray-600">
              <template v-if="isLoading">Loading quiz...</template>
              <template v-else>
                {{ quizData.questions.length }} question{{
                  quizData.questions.length !== 1 ? "s" : ""
                }}
                created
              </template>
            </p>
          </div>
        </div>
        <Button
          @click="saveQuiz"
          :disabled="isSaving || isLoading"
          class="gap-2"
        >
          <template v-if="isSaving">
            <div
              class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
            ></div>
            Saving...
          </template>
          <template v-else>
            <Save class="h-4 w-4" />
            Save Quiz
          </template>
        </Button>
      </div>

      <!-- Quiz Settings -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <Label
            class="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <FileText class="h-4 w-4" />
            Quiz Title
          </Label>
          <Input
            v-model="quizData.title"
            placeholder="Enter quiz title"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <Label
            class="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <Clock class="h-4 w-4" />
            Time Limit (minutes)
          </Label>
          <Input
            v-model.number="quizData.time_limit"
            type="number"
            min="0"
            placeholder="0 = No limit"
            class="w-full"
          />
        </div>

        <div class="md:col-span-2 space-y-2">
          <Label
            class="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <AlignLeft class="h-4 w-4" />
            Description
          </Label>
          <Textarea
            v-model="quizData.description"
            placeholder="Enter quiz description or instructions"
            rows="3"
            class="w-full resize-none"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="quizData.questions.length === 0" class="text-center py-12">
      <div
        class="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4"
      >
        <HelpCircle class="h-8 w-8 text-purple-500" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No questions yet</h3>
      <p class="text-gray-500 mb-6">
        Start building your quiz by adding questions
      </p>
    </div>

    <!-- Questions -->
    <div v-else class="space-y-6">
      <motion.div
        v-for="(question, index) in quizData.questions"
        :key="index"
        class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.3, delay: index * 0.05 }"
      >
        <!-- Question Header -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
              >
                {{ index + 1 }}
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">
                  Question {{ index + 1 }}
                </h4>
                <p class="text-xs text-gray-500">
                  {{ question.points || 1 }} point{{
                    question.points !== 1 ? "s" : ""
                  }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                @click="toggleQuestion(index)"
                class="text-gray-400 hover:text-gray-600"
              >
                <ChevronDown
                  v-if="!expandedQuestions.has(index)"
                  class="h-4 w-4"
                />
                <ChevronUp v-else class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                @click="removeQuestion(index)"
                class="text-gray-400 hover:text-red-500"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <!-- Question Preview -->
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="font-medium text-gray-900">
              {{ question.question || "Enter your question..." }}
            </p>
            <div class="mt-2 flex items-center gap-2 text-xs">
              <Badge variant="outline">{{
                getQuestionTypeLabel(question.type)
              }}</Badge>
              <span class="text-gray-500">{{ question.points || 1 }} pts</span>
            </div>
          </div>
        </div>

        <!-- Question Details -->
        <div v-show="expandedQuestions.has(index)" class="p-6 space-y-6">
          <!-- Question Text & Type -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-2">
              <Label class="text-sm font-medium text-gray-700"
                >Question Text</Label
              >
              <Textarea
                :model-value="question.question"
                @update:model-value="
                  (val) => updateQuestion(index, 'question', val)
                "
                placeholder="Enter your question here..."
                rows="3"
                class="w-full resize-none"
              />
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <Label class="text-sm font-medium text-gray-700"
                  >Question Type</Label
                >
                <Select
                  :model-value="question.type"
                  @update:model-value="(val) => updateQuestionType(index, val)"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice"
                      >Multiple Choice</SelectItem
                    >
                    <SelectItem value="fill_in_the_blank"
                      >Fill in the Blank</SelectItem
                    >
                    <SelectItem value="true_false">True/False</SelectItem>
                    <SelectItem value="typing">Typing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label class="text-sm font-medium text-gray-700">Points</Label>
                <Input
                  :model-value="question.points"
                  @update:model-value="
                    (val) => updateQuestion(index, 'points', Number(val))
                  "
                  type="number"
                  min="1"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Options (for multiple choice and true/false) -->
          <div v-if="question.type === 'multiple_choice'" class="space-y-4">
            <Label class="text-sm font-medium text-gray-700"
              >Answer Options</Label
            >
            <div class="space-y-3">
              <div
                v-for="(option, optIndex) in question.options"
                :key="optIndex"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <input
                  type="radio"
                  :name="`correct-${index}`"
                  :checked="isCorrectAnswer(question, optIndex)"
                  @change="updateCorrectAnswer(index, optIndex)"
                  class="w-4 h-4 text-purple-600"
                />
                <Input
                  :model-value="option"
                  @update:model-value="
                    (val) => updateOption(index, optIndex, val)
                  "
                  :placeholder="`Option ${optIndex + 1}`"
                  class="flex-1"
                />
                <Button
                  v-if="question.options.length > 2"
                  variant="ghost"
                  size="icon"
                  @click="removeOption(index, optIndex)"
                  class="text-gray-400 hover:text-red-500"
                >
                  <X class="h-4 w-4" />
                </Button>
              </div>

              <Button
                @click="addOption(index)"
                variant="outline"
                size="sm"
                class="w-full"
              >
                <Plus class="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>

          <!-- True/False Options -->
          <div v-if="question.type === 'true_false'" class="space-y-4">
            <Label class="text-sm font-medium text-gray-700"
              >Correct Answer</Label
            >
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  :name="`tf-${index}`"
                  :checked="question.correct_answer === true"
                  @change="updateQuestion(index, 'correct_answer', true)"
                  class="w-4 h-4 text-purple-600"
                />
                <span class="text-green-600 font-medium">True</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  :name="`tf-${index}`"
                  :checked="question.correct_answer === false"
                  @change="updateQuestion(index, 'correct_answer', false)"
                  class="w-4 h-4 text-purple-600"
                />
                <span class="text-red-600 font-medium">False</span>
              </label>
            </div>
          </div>

          <!-- Fill in the blank / Typing answer -->
          <div
            v-if="
              question.type === 'fill_in_the_blank' ||
              question.type === 'typing'
            "
            class="space-y-2"
          >
            <Label class="text-sm font-medium text-gray-700"
              >Correct Answer</Label
            >
            <Input
              :model-value="
                typeof question.correct_answer === 'string'
                  ? question.correct_answer
                  : ''
              "
              @update:model-value="
                (val) => updateQuestion(index, 'correct_answer', val)
              "
              placeholder="Enter the correct answer"
              class="w-full"
            />
          </div>

          <!-- Explanation -->
          <div class="space-y-2">
            <Label
              class="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <MessageCircle class="h-4 w-4" />
              Explanation (Optional)
            </Label>
            <Textarea
              :model-value="question.explanation"
              @update:model-value="
                (val) => updateQuestion(index, 'explanation', val)
              "
              placeholder="Provide an explanation for the correct answer..."
              rows="2"
              class="w-full resize-none"
            />
          </div>
        </div>
      </motion.div>
    </div>

    <!-- Add Question Button -->
    <div class="flex justify-center">
      <Button @click="addQuestion" variant="outline" class="gap-2 px-8 py-3">
        <Plus class="h-5 w-5" />
        Add New Question
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { motion } from "motion-v";
import {
  Plus,
  X,
  Trash2,
  Brain,
  Save,
  FileText,
  Clock,
  AlignLeft,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuizQuestion {
  question: string;
  explanation: string;
  type: "multiple_choice" | "fill_in_the_blank" | "true_false" | "typing";
  options: string[];
  correct_answer: any;
  points: number;
  order: number;
}

interface QuizData {
  title: string;
  description: string;
  time_limit: number;
  questions: QuizQuestion[];
}

interface QuizTabProps {
  quizQuestions: QuizQuestion[];
}

const props = defineProps<QuizTabProps>();
const emit = defineEmits<{
  "update:quiz-questions": [questions: QuizQuestion[]];
}>();

// Local quiz data
const quizData = ref<QuizData>({
  title: "",
  description: "",
  time_limit: 0,
  questions: props.quizQuestions || [],
});

// Watch for prop changes
watch(
  () => props.quizQuestions,
  (newQuestions) => {
    quizData.value.questions = newQuestions || [];
  },
  { deep: true }
);

// Collapsible questions state
const expandedQuestions = ref<Set<number>>(new Set());

// Save state
const isSaving = ref(false);
const isLoading = ref(false);

// API configuration
const config = useRuntimeConfig();
const API_BASE_URL = config.public.baseURL as string;
const authStore = useAuthStore();

const getAuthHeaders = () => ({
  Authorization: `Bearer ${authStore.token}`,
  "Content-Type": "application/json",
});

// Question type labels
const getQuestionTypeLabel = (type: string) => {
  const labels = {
    multiple_choice: "Multiple Choice",
    fill_in_the_blank: "Fill in the Blank",
    true_false: "True/False",
    typing: "Typing",
  };
  return labels[type as keyof typeof labels] || type;
};

// Fetch existing quiz data
const fetchQuiz = async () => {
  try {
    isLoading.value = true;
    const centerId = authStore.user?.center_id;
    const route = useRoute();
    const lessonId = route.params.lessonId as string;

    if (!centerId) {
      console.warn("No center ID found");
      return;
    }

    const response = await $fetch<QuizData>(
      `${API_BASE_URL}/centers/${centerId}/lms/lessons/${lessonId}/quiz`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (response) {
      quizData.value = {
        title: response.title || "",
        description: response.description || "",
        time_limit: response.time_limit || 0,
        questions: response.questions || [],
      };

      emit("update:quiz-questions", quizData.value.questions);

      if (response.questions && response.questions.length > 0) {
        toast.success(
          `Loaded quiz with ${response.questions.length} questions`
        );
      }
    }
  } catch (error: any) {
    // If 404, no quiz exists yet (this is normal for new lessons)
    if (error.status !== 404) {
      console.error("Failed to fetch quiz:", error);
      toast.error("Failed to load existing quiz");
    }
  } finally {
    isLoading.value = false;
  }
};

// Initialize quiz data on component mount
onMounted(() => {
  fetchQuiz();
});

// Toggle question expansion
const toggleQuestion = (index: number) => {
  if (expandedQuestions.value.has(index)) {
    expandedQuestions.value.delete(index);
  } else {
    expandedQuestions.value.add(index);
  }
};

// Add new question
const addQuestion = () => {
  const newQuestion: QuizQuestion = {
    question: "",
    explanation: "",
    type: "multiple_choice",
    options: ["", ""],
    correct_answer: 0,
    points: 1,
    order: quizData.value.questions.length,
  };

  quizData.value.questions.push(newQuestion);
  expandedQuestions.value.add(quizData.value.questions.length - 1);
  emit("update:quiz-questions", quizData.value.questions);
  toast.success("New question added");
};

// Remove question
const removeQuestion = (index: number) => {
  quizData.value.questions.splice(index, 1);
  expandedQuestions.value.delete(index);

  // Reorder remaining questions
  quizData.value.questions.forEach((q, i) => {
    q.order = i;
  });

  emit("update:quiz-questions", quizData.value.questions);
  toast.success("Question removed");
};

// Update question
const updateQuestion = (index: number, field: string, value: any) => {
  const question = quizData.value.questions[index];
  if (question) {
    (question as any)[field] = value;
    emit("update:quiz-questions", quizData.value.questions);
  }
};

// Update question type and reset options
const updateQuestionType = (index: number, type: string) => {
  const question = quizData.value.questions[index];
  if (question) {
    question.type = type as any;

    // Reset options based on type
    if (type === "multiple_choice") {
      question.options = ["", ""];
      question.correct_answer = 0;
    } else if (type === "true_false") {
      question.options = [];
      question.correct_answer = true;
    } else {
      question.options = [];
      question.correct_answer = "";
    }

    emit("update:quiz-questions", quizData.value.questions);
  }
};

// Update option
const updateOption = (
  questionIndex: number,
  optionIndex: number,
  value: string
) => {
  const question = quizData.value.questions[questionIndex];
  if (question && question.options) {
    question.options[optionIndex] = value;
    emit("update:quiz-questions", quizData.value.questions);
  }
};

// Add option
const addOption = (questionIndex: number) => {
  const question = quizData.value.questions[questionIndex];
  if (question) {
    question.options.push("");
    emit("update:quiz-questions", quizData.value.questions);
  }
};

// Remove option
const removeOption = (questionIndex: number, optionIndex: number) => {
  const question = quizData.value.questions[questionIndex];
  if (question && question.options.length > 2) {
    question.options.splice(optionIndex, 1);

    // Adjust correct answer if needed
    if (question.correct_answer >= optionIndex && question.correct_answer > 0) {
      question.correct_answer--;
    }

    emit("update:quiz-questions", quizData.value.questions);
  }
};

// Check if answer is correct
const isCorrectAnswer = (question: QuizQuestion, optionIndex: number) => {
  return question.correct_answer === optionIndex;
};

// Update correct answer
const updateCorrectAnswer = (questionIndex: number, optionIndex: number) => {
  updateQuestion(questionIndex, "correct_answer", optionIndex);
};

// Initialize quiz data on component mount
onMounted(() => {
  fetchQuiz();
});

// Save quiz to API
const saveQuiz = async () => {
  try {
    isSaving.value = true;
    const centerId = authStore.user?.center_id;
    const route = useRoute();
    const lessonId = route.params.lessonId as string;

    if (!centerId) {
      toast.error("No center ID found");
      return;
    }

    const quizPayload = {
      title: quizData.value.title || "Untitled Quiz",
      description: quizData.value.description || "",
      time_limit: quizData.value.time_limit || 0,
      questions: quizData.value.questions,
    };

    await $fetch(
      `${API_BASE_URL}/centers/${centerId}/lms/lessons/${lessonId}/quiz`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: quizPayload,
      }
    );

    toast.success("Quiz saved successfully");
  } catch (error: any) {
    console.error("Failed to save quiz:", error);
    toast.error("Failed to save quiz");
  } finally {
    isSaving.value = false;
  }
};
</script>
