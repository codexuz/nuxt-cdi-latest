<template>
  <div class="min-h-screen bg-gradient-to-b from-muted/30 to-background">
    <motion.div
      class="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl"
      :initial="{ opacity: 0, y: 20 }"
      :transition="{ duration: 0.6, ease: 'easeOut' }"
      :animate="{ opacity: 1, y: 0 }"
    >
      <Toaster position="top-center" richColors theme="system" />

      <!-- Header -->
      <motion.div
        class="bg-card border rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm"
        :initial="{ opacity: 0, y: -10 }"
        :transition="{ duration: 0.5, delay: 0.1 }"
        :animate="{ opacity: 1, y: 0 }"
      >
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div class="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              @click="$router.back()"
              class="shrink-0 hover:bg-muted"
            >
              <ArrowLeft class="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div>
              <h1
                class="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight"
              >
                Reading Test Builder
              </h1>
              <p class="text-xs sm:text-sm text-muted-foreground mt-1">
                Design and configure reading test sections
              </p>
            </div>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <Button
              @click="saveReadingTest"
              :disabled="!isValid"
              class="flex-1 sm:flex-none"
              size="default"
            >
              <Save class="mr-2 h-4 w-4" />
              <span class="hidden sm:inline">Save Test</span>
              <span class="sm:hidden">Save</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <!-- Reading Test Information -->
      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :transition="{ duration: 0.5, delay: 0.2 }"
        :animate="{ opacity: 1, y: 0 }"
      >
        <Card class="mb-6 sm:mb-8 shadow-sm border-2">
          <CardHeader class="bg-muted/50">
            <CardTitle class="text-lg flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-primary"></div>
              Test Configuration
            </CardTitle>
          </CardHeader>
          <CardContent class="pt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="title" class="text-sm font-medium"
                  >Test Title</Label
                >
                <Input
                  id="title"
                  v-model="readingData.title"
                  placeholder="e.g., IELTS Reading Test - Academic Module"
                  class="h-10"
                />
              </div>
              <div class="space-y-2">
                <Label for="for_cdi" class="text-sm font-medium">For CDI</Label>
                <Select v-model="readingData.for_cdi">
                  <SelectTrigger id="for_cdi" class="h-10">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <!-- Parts Section -->
      <motion.div
        class="mb-4 sm:mb-6"
        :initial="{ opacity: 0, y: 20 }"
        :transition="{ duration: 0.5, delay: 0.3 }"
        :animate="{ opacity: 1, y: 0 }"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4"
        >
          <div>
            <h3
              class="text-base sm:text-lg font-semibold flex items-center gap-2"
            >
              <div class="h-2 w-2 rounded-full bg-primary"></div>
              Test Parts
              <span
                class="text-xs sm:text-sm font-normal text-muted-foreground ml-2"
              >
                ({{ readingData.parts.length }}
                {{ readingData.parts.length === 1 ? "part" : "parts" }})
              </span>
            </h3>
            <p class="text-xs sm:text-sm text-muted-foreground mt-1">
              Configure passages and questions for each section
            </p>
          </div>
          <Button
            @click="addReadingPart"
            size="default"
            class="w-full sm:w-auto shadow-sm"
          >
            <Plus class="mr-2 h-4 w-4" />
            Add New Part
          </Button>
        </div>

        <Accordion type="multiple" class="w-full space-y-3 sm:space-y-4">
          <AccordionItem
            v-for="(part, index) in readingData.parts"
            :key="index"
            :value="`reading-part-${index}`"
            class="border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-card"
          >
            <AccordionTrigger
              class="hover:no-underline py-4 sm:py-5 px-4 sm:px-6 hover:bg-muted/50 transition-colors"
            >
              <div
                class="flex items-center justify-between w-full pr-2 sm:pr-4"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-semibold text-sm"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="text-left">
                    <span class="text-sm sm:text-base font-semibold block">{{
                      part.part.replace("_", " ")
                    }}</span>
                    <span class="text-xs text-muted-foreground"
                      >{{ part.question.content.length }} question types</span
                    >
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  @click.stop="removeReadingPart(index)"
                  class="h-8 w-8 hover:bg-destructive/10 hover:text-destructive shrink-0"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent class="px-4 sm:px-6 pb-6 pt-2">
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label class="text-sm font-medium">Part Type</Label>
                    <Select v-model="part.part">
                      <SelectTrigger class="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PART_1">Part 1</SelectItem>
                        <SelectItem value="PART_2">Part 2</SelectItem>
                        <SelectItem value="PART_3">Part 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="space-y-2">
                    <Label class="text-sm font-medium"
                      >Number of Questions</Label
                    >
                    <Input
                      type="number"
                      v-model.number="part.question.number_of_questions"
                      min="1"
                      max="15"
                      class="h-10"
                    />
                  </div>
                </div>

                <!-- Reading Passage -->
                <Card class="border-dashed">
                  <CardHeader class="pb-3">
                    <CardTitle class="text-sm font-medium text-muted-foreground"
                      >Reading Passage</CardTitle
                    >
                  </CardHeader>
                  <CardContent>
                    <QuillEditor
                      style="min-height: 200px"
                      class="text-sm sm:text-base"
                      placeholder="Enter the reading passage text here..."
                      contentType="html"
                      theme="snow"
                      v-model:content="part.passage"
                    />
                  </CardContent>
                </Card>

                <!-- Question Content -->
                <Card class="border-dashed">
                  <CardHeader class="pb-3">
                    <div
                      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <CardTitle
                        class="text-sm font-medium text-muted-foreground"
                        >Question Content</CardTitle
                      >
                    </div>
                  </CardHeader>
                  <CardContent>
                    <!-- Floating Add Button -->
                    <div class="sticky top-4 z-10 mb-4 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button
                            size="default"
                            class="shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Plus class="mr-2 h-4 w-4" />
                            <span>Add Question Type</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-56">
                          <DropdownMenuItem
                            @click="
                              addQuestionByType(
                                part.question.content,
                                'completion'
                              )
                            "
                          >
                            <span class="font-medium">Completion</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            @click="
                              addQuestionByType(
                                part.question.content,
                                'multiple-choice'
                              )
                            "
                          >
                            <span class="font-medium">Multiple Choice</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            @click="
                              addQuestionByType(
                                part.question.content,
                                'multi-select'
                              )
                            "
                          >
                            <span class="font-medium">Multi Select</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            @click="
                              addQuestionByType(
                                part.question.content,
                                'draggable-selection'
                              )
                            "
                          >
                            <span class="font-medium">Draggable Selection</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            @click="
                              addQuestionByType(
                                part.question.content,
                                'selection'
                              )
                            "
                          >
                            <span class="font-medium"
                              >Selection (True/False/Headings)</span
                            >
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div
                      v-for="(content, contentIndex) in part.question.content"
                      :key="contentIndex"
                      class="mb-4 last:mb-0"
                    >
                      <CompletionQuestion
                        v-if="content.type === 'completion'"
                        v-model="part.question.content[contentIndex]"
                        @remove="part.question.content.splice(contentIndex, 1)"
                      />
                      <MultipleChoiceQuestion
                        v-else-if="content.type === 'multiple-choice'"
                        v-model="part.question.content[contentIndex]"
                        @remove="part.question.content.splice(contentIndex, 1)"
                      />
                      <MultiSelectQuestion
                        v-else-if="content.type === 'multi-select'"
                        v-model="part.question.content[contentIndex]"
                        @remove="part.question.content.splice(contentIndex, 1)"
                      />
                      <DraggableSelectionQuestion
                        v-else-if="content.type === 'draggable-selection'"
                        v-model="part.question.content[contentIndex]"
                        @remove="part.question.content.splice(contentIndex, 1)"
                      />
                      <SelectionQuestion
                        v-else-if="content.type === 'selection'"
                        v-model="part.question.content[contentIndex]"
                        @remove="part.question.content.splice(contentIndex, 1)"
                      />
                    </div>
                  </CardContent>
                </Card>

                <!-- Answer Key Input -->
                <Card
                  v-if="part.question.content.length > 0"
                  class="border-dashed bg-primary/5"
                >
                  <CardHeader class="pb-3">
                    <CardTitle class="text-sm font-medium text-muted-foreground"
                      >Answer Key</CardTitle
                    >
                  </CardHeader>
                  <CardContent>
                    <p class="text-xs text-muted-foreground mb-3">
                      Enter answers separated by commas (e.g., A, go, TRUE, C,
                      walking)<br />
                      <strong class="text-primary">Note:</strong> For multiple
                      correct answers, use slash (e.g., book/books,
                      cinema/cinemas)
                    </p>
                    <Textarea
                      :model-value="getAnswersAsText(part)"
                      @update:model-value="
                        (value) => setAnswersFromText(part, value)
                      "
                      placeholder="A, go, TRUE, book/books, cinema/cinemas"
                      rows="3"
                      class="font-mono text-xs sm:text-sm resize-none"
                    />
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </motion.div>

    <!-- Delete Part Confirmation Dialog -->
    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Part?</AlertDialogTitle>
          <AlertDialogDescription>
            <template v-if="partToDelete !== null">
              Are you sure you want to delete
              <strong>{{
                readingData.parts[partToDelete]?.part.replace("_", " ")
              }}</strong>
              with
              <strong
                >{{
                  readingData.parts[partToDelete]?.question.content.length
                }}
                question type(s)</strong
              >? <br /><br />
              This action cannot be undone.
            </template>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            @click="confirmDeletePart"
            class="bg-destructive text-white hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup>
import { motion } from "motion-v";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

import CompletionQuestion from "@/components/questions/CompletionQuestion.vue";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion.vue";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion.vue";
import DraggableSelectionQuestion from "@/components/questions/DraggableSelectionQuestion.vue";
import SelectionQuestion from "@/components/questions/SelectionQuestion.vue";

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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

useHead({
  title: "Reading Test Builder - Testify",
});

const route = useRoute();
const testId = route.query.test_id || "";
const storageKey = `reading-draft-${testId}`;

const deleteDialogOpen = ref(false);
const partToDelete = ref(null);
const isLoading = ref(false);

// Load from localStorage or use defaults
const loadFromStorage = () => {
  if (process.client && testId) {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Make answers objects reactive
        if (data.parts) {
          data.parts = data.parts.map((part) => ({
            ...part,
            answers: reactive(part.answers || {}),
          }));
        }
        return data;
      } catch (e) {
        console.error("Failed to parse saved data:", e);
      }
    }
  }
  return {
    title: "IELTS Reading Test - Academic Module",
    description:
      "A comprehensive reading test featuring three passages with increasing difficulty levels.",
    for_cdi: "false",
    test_id: testId,
    parts: [],
  };
};

const readingData = ref(loadFromStorage());

// Fetch reading test from API
const fetchReadingTest = async () => {
  if (!testId) return;

  try {
    isLoading.value = true;
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    // Get center from user
    if (!authStore.user?.center_id) {
      toast.error("No center found for user");
      return;
    }

    const response = await $fetch(
      `${baseURL}/ielts/centers/${authStore.user.center_id}/tests/${testId}/reading`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response) {
      // Make answers objects reactive
      if (response.parts) {
        response.parts = response.parts.map((part) => ({
          ...part,
          answers: reactive(part.answers || {}),
        }));
      }

      readingData.value = {
        ...response,
        for_cdi: String(response.for_cdi || false),
        test_id: testId,
      };

      console.log("Reading test loaded:", response);
    }
  } catch (error) {
    console.error("Failed to fetch reading test:", error);
    // Don't show error toast if it's a 404 (no reading test yet)
    if (error.status !== 404) {
      toast.error("Failed to load reading test");
    }
  } finally {
    isLoading.value = false;
  }
};

// Load test on mount
onMounted(() => {
  fetchReadingTest();
});

// Auto-save to localStorage whenever data changes
watch(
  readingData,
  (newData) => {
    if (process.client && testId) {
      localStorage.setItem(storageKey, JSON.stringify(newData));
    }
  },
  { deep: true }
);

const isValid = computed(() => {
  return (
    readingData.value.title &&
    readingData.value.test_id &&
    readingData.value.parts.length > 0
  );
});

const addReadingPart = () => {
  readingData.value.parts.push({
    part: "PART_1",
    question: {
      content: [],
      number_of_questions: 13,
    },
    passage: "",
    answers: reactive({}),
  });
};

const removeReadingPart = (index) => {
  partToDelete.value = index;
  deleteDialogOpen.value = true;
};

const confirmDeletePart = () => {
  if (partToDelete.value !== null) {
    readingData.value.parts.splice(partToDelete.value, 1);
    partToDelete.value = null;
    deleteDialogOpen.value = false;
  }
};

const getPartStartingNumber = (partType) => {
  const partMap = {
    PART_1: 1,
    PART_2: 14,
    PART_3: 27,
  };
  return partMap[partType] || 1;
};

const getAnswersAsText = (part) => {
  const keys = Object.keys(part.answers).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  return keys.map((key) => part.answers[key]).join(", ");
};

const setAnswersFromText = (part, value) => {
  const answers = value
    .split(",")
    .map((a) => a.trim())
    .filter((a) => a);

  const startingNumber = getPartStartingNumber(part.part);

  part.answers = reactive({});
  answers.forEach((answer, index) => {
    part.answers[String(startingNumber + index)] = answer;
  });
  Object.assign(part.answers, {});
};

const countBlanks = (content) => {
  if (!content) return [];
  const matches = content.match(/@@/g);
  return matches ? matches : [];
};

const getQuestionNumber = (part, contentIndex, itemIndex) => {
  let questionNumber = 1;
  for (let i = 0; i < contentIndex; i++) {
    const content = part.question.content[i];
    if (
      content.type === "completion" ||
      content.type === "selection" ||
      content.type === "draggable-selection"
    ) {
      questionNumber += countBlanks(content.content).length;
    } else if (content.type === "multiple-choice") {
      questionNumber += content.questions?.length || 0;
    } else if (content.type === "multi-select") {
      questionNumber += content.limit || 2;
    }
  }
  return String(questionNumber + itemIndex);
};

const isMultiSelectAnswerSelected = (part, contentIndex, value) => {
  const startQuestion = parseInt(getQuestionNumber(part, contentIndex, 0));
  const content = part.question.content[contentIndex];
  const limit = content.limit || 2;
  for (let i = 0; i < limit; i++) {
    if (part.answers[String(startQuestion + i)] === value) {
      return true;
    }
  }
  return false;
};

const toggleMultiSelectAnswer = (part, contentIndex, value, limit) => {
  const startQuestion = parseInt(getQuestionNumber(part, contentIndex, 0));
  let selectedIndex = -1;
  for (let i = 0; i < limit; i++) {
    if (part.answers[String(startQuestion + i)] === value) {
      selectedIndex = i;
      break;
    }
  }
  if (selectedIndex !== -1) {
    delete part.answers[String(startQuestion + selectedIndex)];
    for (let i = selectedIndex; i < limit - 1; i++) {
      const nextValue = part.answers[String(startQuestion + i + 1)];
      if (nextValue) {
        part.answers[String(startQuestion + i)] = nextValue;
        delete part.answers[String(startQuestion + i + 1)];
      }
    }
  } else {
    for (let i = 0; i < limit; i++) {
      if (!part.answers[String(startQuestion + i)]) {
        part.answers[String(startQuestion + i)] = value;
        break;
      }
    }
  }
  // Trigger reactivity
  Object.assign(part.answers, {});
};

const getCommaSeparatedAnswers = (part, contentIndex, count) => {
  const startQuestion = parseInt(getQuestionNumber(part, contentIndex, 0));
  const answers = [];
  for (let i = 0; i < count; i++) {
    const answer = part.answers[String(startQuestion + i)];
    answers.push(answer || "");
  }
  return answers.join(", ");
};

const setCommaSeparatedAnswers = (part, contentIndex, count, value) => {
  const startQuestion = parseInt(getQuestionNumber(part, contentIndex, 0));
  const answers = value.split(",").map((a) => a.trim());
  for (let i = 0; i < count; i++) {
    const answer = answers[i];
    if (answer) {
      part.answers[String(startQuestion + i)] = answer;
    } else {
      delete part.answers[String(startQuestion + i)];
    }
  }
  // Trigger reactivity
  Object.assign(part.answers, {});
};

const addQuestionByType = (contentArray, type) => {
  const baseQuestion = {
    id: `qc_${Date.now()}`,
    type: type,
    title: "",
    condition: "",
  };

  switch (type) {
    case "completion":
      contentArray.push({ ...baseQuestion, content: "" });
      break;
    case "multiple-choice":
      contentArray.push({ ...baseQuestion, questions: [] });
      break;
    case "multi-select":
      contentArray.push({ ...baseQuestion, options: [], limit: 2 });
      break;
    case "draggable-selection":
      contentArray.push({
        ...baseQuestion,
        content: "",
        options: [],
        optionsTitle: "",
      });
      break;
    case "selection":
      const defaultOptions = [
        { id: `opt_${Date.now()}_1`, value: "A", label: "" },
        { id: `opt_${Date.now()}_2`, value: "B", label: "" },
        { id: `opt_${Date.now()}_3`, value: "C", label: "" },
        { id: `opt_${Date.now()}_4`, value: "D", label: "" },
        { id: `opt_${Date.now()}_5`, value: "E", label: "" },
        { id: `opt_${Date.now()}_6`, value: "F", label: "" },
        { id: `opt_${Date.now()}_7`, value: "G", label: "" },
        { id: `opt_${Date.now()}_8`, value: "H", label: "" },
      ];
      contentArray.push({
        ...baseQuestion,
        content: "",
        options: defaultOptions,
        showOptions: true,
        optionsTitle: "OPTIONS",
      });
      break;
    default:
      contentArray.push(baseQuestion);
  }
};

const saveReadingTest = async () => {
  try {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;

    // Get center from user
    if (!authStore.user?.center_id) {
      toast.error("No center found for user");
      return;
    }

    const payload = {
      ...readingData.value,
      for_cdi: readingData.value.for_cdi === "true",
    };

    const response = await $fetch(
      `${baseURL}/ielts/centers/${authStore.user.center_id}/reading`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );

    console.log("Reading test saved:", response);

    // Clear localStorage after successful save
    if (process.client && testId) {
      localStorage.removeItem(storageKey);
    }

    toast.success("Reading test saved successfully!");

    // Navigate back after save
    setTimeout(() => {
      navigateTo("/teacher/test-builder");
    }, 1000);
  } catch (error) {
    console.error("Failed to save:", error);
    toast.error(error.data?.message || "Failed to save reading test");
  }
};

definePageMeta({
  layout: "teacher",
  middleware: "auth",
});
</script>
