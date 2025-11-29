<template>
  <div class="space-y-8">
    <!-- Quiz Header -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-purple-100 dark:border-purple-900/50"
    >
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <template v-if="isLoading">
              <div
                class="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"
              ></div>
            </template>
            <Brain v-else class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h3
              class="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100"
            >
              Quiz Builder
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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
          class="gap-2 w-full sm:w-auto"
        >
          <template v-if="isSaving">
            <div
              class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
            ></div>
            <span class="hidden sm:inline">Saving...</span>
            <span class="sm:hidden">Save...</span>
          </template>
          <template v-else>
            <Save class="h-4 w-4" />
            <span class="hidden sm:inline">Save Quiz</span>
            <span class="sm:hidden">Save</span>
          </template>
        </Button>
      </div>

      <!-- Quiz Settings -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <Label
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
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
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
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
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
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
        class="mx-auto w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4"
      >
        <HelpCircle class="h-8 w-8 text-purple-500 dark:text-purple-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No questions yet
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        Start building your quiz by adding questions
      </p>
    </div>

    <!-- Questions -->
    <div v-else class="space-y-6">
      <motion.div
        v-for="(question, index) in quizData.questions"
        :key="index"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.3, delay: index * 0.05 }"
      >
        <!-- Question Header -->
        <div class="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0"
              >
                {{ index + 1 }}
              </div>
              <div>
                <h4
                  class="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100"
                >
                  Question {{ index + 1 }}
                </h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ question.points || 1 }} point{{
                    question.points !== 1 ? "s" : ""
                  }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                @click="toggleQuestion(index)"
                class="text-gray-400 hover:text-gray-600 h-8 w-8 sm:h-10 sm:w-10"
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
                class="text-gray-400 hover:text-red-500 h-8 w-8 sm:h-10 sm:w-10"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <!-- Question Preview -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
            <p
              class="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words"
            >
              {{ question.question || "Enter your question..." }}
            </p>
            <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="outline" class="text-xs">{{
                getQuestionTypeLabel(question.type)
              }}</Badge>
              <span class="text-gray-500 dark:text-gray-400"
                >{{ question.points || 1 }} pts</span
              >
            </div>
          </div>
        </div>

        <!-- Question Details -->
        <div
          v-show="expandedQuestions.has(index)"
          class="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          <!-- Question Text & Type -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div class="lg:col-span-2 space-y-2">
              <Label
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                <Label
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                <Label
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Points</Label
                >
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
            <Label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Answer Options</Label
            >
            <div class="space-y-2 sm:space-y-3">
              <div
                v-for="(option, optIndex) in question.options"
                :key="optIndex"
                class="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <input
                  type="radio"
                  :name="`correct-${index}`"
                  :checked="isCorrectAnswer(question, optIndex)"
                  @change="updateCorrectAnswer(index, optIndex)"
                  class="w-4 h-4 text-purple-600 flex-shrink-0"
                />
                <Input
                  :model-value="option"
                  @update:model-value="
                    (val) => updateOption(index, optIndex, val)
                  "
                  :placeholder="`Option ${optIndex + 1}`"
                  class="flex-1 text-sm"
                />
                <Button
                  v-if="question.options.length > 2"
                  variant="ghost"
                  size="icon"
                  @click="removeOption(index, optIndex)"
                  class="text-gray-400 hover:text-red-500 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                >
                  <X class="h-3 w-3 sm:h-4 sm:w-4" />
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
            <Label class="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                <span class="text-green-600 dark:text-green-400 font-medium"
                  >True</span
                >
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  :name="`tf-${index}`"
                  :checked="question.correct_answer === false"
                  @change="updateQuestion(index, 'correct_answer', false)"
                  class="w-4 h-4 text-purple-600"
                />
                <span class="text-red-600 dark:text-red-400 font-medium"
                  >False</span
                >
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
            <Label class="text-sm font-medium text-gray-700 dark:text-gray-300"
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
              class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
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
  id?: string;
  question: string;
  explanation: string;
  type: "multiple_choice" | "fill_in_the_blank" | "true_false" | "typing";
  options: string[];
  correct_answer: any;
  points: number;
  order: number;
}

interface QuizData {
  id?: string;
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
  id: undefined,
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

    // First fetch the quiz to get the quiz ID
    const quizResponse = await $fetch<QuizData>(
      `${API_BASE_URL}/centers/${centerId}/lms/lessons/${lessonId}/quiz`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (quizResponse) {
      quizData.value = {
        id: quizResponse.id,
        title: quizResponse.title || "",
        description: quizResponse.description || "",
        time_limit: quizResponse.time_limit || 0,
        questions: [],
      };

      // If quiz has an ID, fetch questions from the separate endpoint
      if (quizResponse.id) {
        await fetchQuestions(quizResponse.id);
      } else if (quizResponse.questions) {
        // Fallback to questions from quiz response if no ID
        quizData.value.questions = quizResponse.questions;
        emit("update:quiz-questions", quizData.value.questions);
      }

      if (quizData.value.questions && quizData.value.questions.length > 0) {
        toast.success(
          `Loaded quiz with ${quizData.value.questions.length} questions`
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

// Fetch quiz questions from separate endpoint
const fetchQuestions = async (quizId: string) => {
  try {
    const centerId = authStore.user?.center_id;
    if (!centerId) return;

    const response = await $fetch<QuizQuestion[]>(
      `${API_BASE_URL}/centers/${centerId}/lms/quizzes/${quizId}/questions`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (response) {
      quizData.value.questions = Array.isArray(response) ? response : [];
      emit("update:quiz-questions", quizData.value.questions);
    }
  } catch (error: any) {
    if (error.status !== 404) {
      console.error("Failed to fetch quiz questions:", error);
    }
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
const removeQuestion = async (index: number) => {
  const question = quizData.value.questions[index];

  // If question has an ID, delete it from the backend
  if (question?.id) {
    try {
      const centerId = authStore.user?.center_id;
      if (!centerId) {
        toast.error("No center ID found");
        return;
      }

      await $fetch(
        `${API_BASE_URL}/centers/${centerId}/lms/questions/${question.id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
    } catch (error: any) {
      console.error("Failed to delete question:", error);
      toast.error("Failed to delete question");
      return;
    }
  }

  // Remove from local state
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

    // Save quiz with metadata and questions array
    const quizPayload = {
      title: quizData.value.title || "Untitled Quiz",
      description: quizData.value.description || "",
      time_limit: quizData.value.time_limit || 0,
      questions: quizData.value.questions || [],
    };

    const quizResponse = await $fetch<QuizData>(
      `${API_BASE_URL}/centers/${centerId}/lms/lessons/${lessonId}/quiz`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: quizPayload,
      }
    );

    // Store the quiz ID for future updates
    if (quizResponse?.id) {
      quizData.value.id = quizResponse.id;
    }

    toast.success("Quiz saved successfully");
  } catch (error: any) {
    console.error("Failed to save quiz:", error);
    toast.error("Failed to save quiz");
  } finally {
    isSaving.value = false;
  }
};
</script>
