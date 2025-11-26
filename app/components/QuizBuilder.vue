<template>
  <Card>
    <CardHeader class="border-b">
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="flex items-center gap-2">
            <ClipboardList class="h-5 w-5" />
            Quiz
          </CardTitle>
          <CardDescription
            >Create quiz questions for this lesson</CardDescription
          >
        </div>
        <Button @click="openAddDialog" size="sm">
          <Plus class="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>
    </CardHeader>
    <CardContent class="p-6">
      <!-- Empty State -->
      <div v-if="questions.length === 0" class="text-center py-8">
        <ClipboardList class="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 class="font-semibold mb-1">No questions yet</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Add quiz questions to test student knowledge
        </p>
        <Button @click="openAddDialog" size="sm">
          <Plus class="h-4 w-4 mr-2" />
          Add First Question
        </Button>
      </div>

      <!-- Questions List -->
      <div v-else class="space-y-4">
        <div
          v-for="(question, index) in questions"
          :key="question.id"
          class="border rounded-lg p-4 hover:bg-muted/50 transition-colors group"
        >
          <div class="flex items-start gap-3">
            <Badge variant="outline" class="mt-1">Q{{ index + 1 }}</Badge>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <Badge>{{ question.type }}</Badge>
                <span class="text-sm text-muted-foreground"
                  >{{ question.points }} points</span
                >
              </div>
              <p class="font-medium mb-3">{{ question.question }}</p>

              <!-- Multiple Choice Options -->
              <div v-if="question.type === 'multiple_choice'" class="space-y-2">
                <div
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  class="flex items-center gap-2 text-sm"
                >
                  <div
                    :class="[
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      option.is_correct
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300',
                    ]"
                  >
                    <Check
                      v-if="option.is_correct"
                      class="h-3 w-3 text-green-600"
                    />
                  </div>
                  <span
                    :class="
                      option.is_correct ? 'font-medium text-green-700' : ''
                    "
                  >
                    {{ option.text }}
                  </span>
                </div>
              </div>

              <!-- True/False -->
              <div v-else-if="question.type === 'true_false'" class="text-sm">
                <span class="font-medium text-green-700">
                  Answer: {{ question.correct_answer ? "True" : "False" }}
                </span>
              </div>

              <!-- Short Answer -->
              <div v-else-if="question.type === 'short_answer'" class="text-sm">
                <span class="text-muted-foreground">Correct answer: </span>
                <span class="font-medium">{{ question.correct_answer }}</span>
              </div>
            </div>

            <div
              class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                @click="editQuestion(question)"
              >
                <Pencil class="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                @click="confirmDelete(question)"
              >
                <Trash2 class="h-3 w-3 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Add/Edit Dialog -->
  <Dialog v-model:open="dialogOpen">
    <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{
          editingQuestion ? "Edit Question" : "Add Question"
        }}</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Question Type</Label>
            <Select v-model="form.type">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                <SelectItem value="true_false">True/False</SelectItem>
                <SelectItem value="short_answer">Short Answer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label>Points</Label>
            <Input v-model.number="form.points" type="number" min="1" />
          </div>
        </div>

        <div class="space-y-2">
          <Label>Question *</Label>
          <Textarea
            v-model="form.question"
            rows="3"
            placeholder="Enter your question"
          />
        </div>

        <!-- Multiple Choice Options -->
        <div v-if="form.type === 'multiple_choice'" class="space-y-3">
          <Label>Options</Label>
          <div
            v-for="(option, index) in form.options"
            :key="index"
            class="flex items-center gap-2"
          >
            <Input
              v-model="option.text"
              :placeholder="`Option ${index + 1}`"
              class="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              :class="option.is_correct ? 'bg-green-100 border-green-500' : ''"
              @click="setCorrectOption(index)"
            >
              <Check class="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              @click="removeOption(index)"
              :disabled="form.options.length <= 2"
            >
              <X class="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" @click="addOption" class="w-full">
            <Plus class="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>

        <!-- True/False -->
        <div v-else-if="form.type === 'true_false'" class="space-y-2">
          <Label>Correct Answer</Label>
          <Select v-model="form.correct_answer">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Short Answer -->
        <div v-else-if="form.type === 'short_answer'" class="space-y-2">
          <Label>Correct Answer</Label>
          <Input
            v-model="form.correct_answer"
            placeholder="Enter correct answer"
          />
        </div>

        <div class="space-y-2">
          <Label>Explanation (Optional)</Label>
          <Textarea
            v-model="form.explanation"
            rows="2"
            placeholder="Explain the correct answer"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="dialogOpen = false">Cancel</Button>
        <Button @click="saveQuestion">{{
          editingQuestion ? "Update" : "Add"
        }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Delete Dialog -->
  <AlertDialog v-model:open="deleteDialogOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Question</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this question?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          @click="deleteQuestion"
          class="bg-destructive hover:bg-destructive/90"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ClipboardList, Plus, Check, X, Pencil, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  lessonId: string;
}

const props = defineProps<Props>();

const config = useRuntimeConfig();
const API_BASE_URL = config.public.baseURL as string;
const authStore = useAuthStore();

const questions = ref<any[]>([]);
const dialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const editingQuestion = ref<any>(null);
const questionToDelete = ref<any>(null);

const form = ref({
  type: "multiple_choice",
  question: "",
  points: 1,
  options: [
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ],
  correct_answer: "true",
  explanation: "",
});

const getAuthHeaders = () => ({
  Authorization: `Bearer ${authStore.token}`,
  "Content-Type": "application/json",
});

const fetchQuestions = async () => {
  try {
    const response = await $fetch(
      `${API_BASE_URL}/lms/lessons/${props.lessonId}/quiz`,
      {
        headers: getAuthHeaders(),
      }
    );
    questions.value = response;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
  }
};

const openAddDialog = () => {
  editingQuestion.value = null;
  form.value = {
    type: "multiple_choice",
    question: "",
    points: 1,
    options: [
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ],
    correct_answer: "true",
    explanation: "",
  };
  dialogOpen.value = true;
};

const editQuestion = (question: any) => {
  editingQuestion.value = question;
  form.value = { ...question };
  if (!form.value.options) {
    form.value.options = [
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ];
  }
  dialogOpen.value = true;
};

const addOption = () => {
  form.value.options.push({ text: "", is_correct: false });
};

const removeOption = (index: number) => {
  form.value.options.splice(index, 1);
};

const setCorrectOption = (index: number) => {
  form.value.options.forEach((opt, i) => {
    opt.is_correct = i === index;
  });
};

const saveQuestion = async () => {
  if (!form.value.question) {
    toast.error("Please enter a question");
    return;
  }

  try {
    const payload = { ...form.value };

    if (editingQuestion.value) {
      await $fetch(`${API_BASE_URL}/lms/quizzes/${editingQuestion.value.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: payload,
      });
      toast.success("Question updated");
    } else {
      await $fetch(`${API_BASE_URL}/lms/lessons/${props.lessonId}/quiz`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: payload,
      });
      toast.success("Question added");
    }

    dialogOpen.value = false;
    await fetchQuestions();
  } catch (error) {
    toast.error("Failed to save question");
  }
};

const confirmDelete = (question: any) => {
  questionToDelete.value = question;
  deleteDialogOpen.value = true;
};

const deleteQuestion = async () => {
  try {
    await $fetch(`${API_BASE_URL}/lms/quizzes/${questionToDelete.value.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    toast.success("Question deleted");
    deleteDialogOpen.value = false;
    await fetchQuestions();
  } catch (error) {
    toast.error("Failed to delete question");
  }
};

onMounted(() => {
  fetchQuestions();
});
</script>
