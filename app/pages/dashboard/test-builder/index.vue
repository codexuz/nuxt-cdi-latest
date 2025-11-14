<template>
  <div class="container mx-auto px-4 py-8">
    <Toaster position="top-center" richColors theme="system" />

    <!-- Test Information -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Test Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="space-y-2">
            <Label for="title">Test Title</Label>
            <Input
              id="title"
              v-model="testData.title"
              placeholder="e.g., IELTS Academic Test - Practice Set 1"
            />
          </div>
          <div class="space-y-2">
            <Label for="for_cdi">For CDI</Label>
            <Select v-model="testData.for_cdi">
              <SelectTrigger id="for_cdi">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="testData.description"
            placeholder="Describe the test content and objectives..."
            rows="3"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Section Tabs -->
    <Card>
      <Tabs v-model="activeTab" class="w-full p-3">
        <div>
          <TabsList class="w-full justify-start  p-0">
            <TabsTrigger
              value="listening"
            >
              <Headphones class="mr-2 h-4 w-4" />
              Listening
            </TabsTrigger>
            <TabsTrigger
              value="reading"
            >
              <BookOpen class="mr-2 h-4 w-4" />
              Reading
            </TabsTrigger>
            <TabsTrigger
              value="preview"
            >
              <Eye class="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <!-- Listening Section -->
        <TabsContent value="listening" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold">Listening Section</h3>
            <Button @click="addListeningPart">
              <Plus class="mr-2 h-4 w-4" />
              Add Part
            </Button>
          </div>

          <div v-for="(part, index) in listeningData.parts" :key="index" class="mb-4">
            <Card>
              <CardHeader>
                <div class="flex justify-between items-center">
                  <CardTitle>Part {{ index + 1 }}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="removeListeningPart(index)"
                  >
                    <Trash2 class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label>Part Type</Label>
                    <Select v-model="part.part">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PART_1">Part 1</SelectItem>
                        <SelectItem value="PART_2">Part 2</SelectItem>
                        <SelectItem value="PART_3">Part 3</SelectItem>
                        <SelectItem value="PART_4">Part 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="space-y-2">
                    <Label>Number of Questions</Label>
                    <Input
                      type="number"
                      v-model.number="part.question.number_of_questions"
                      min="1"
                      max="15"
                    />
                  </div>
                </div>

                <!-- Audio Configuration -->
                <div>
                  <h5 class="font-medium mb-2">Audio Configuration</h5>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-2">
                      <Label>Audio URL</Label>
                      <Input
                        type="url"
                        v-model="part.audio.url"
                        placeholder="https://example.com/audio.mp3"
                      />
                    </div>
                    <div class="space-y-2">
                      <Label>Duration (seconds)</Label>
                      <Input
                        type="number"
                        v-model.number="part.audio.duration"
                        placeholder="180"
                      />
                    </div>
                    <div class="space-y-2">
                      <Label>File Name</Label>
                      <Input
                        v-model="part.audio.file_name"
                        placeholder="listening_part1.mp3"
                      />
                    </div>
                  </div>
                </div>

                <!-- Question Content -->
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <h5 class="font-medium">Question Content</h5>
                    <Button
                      size="sm"
                      variant="outline"
                      @click="addQuestionContent(part.question.content)"
                    >
                      <Plus class="mr-1 h-3 w-3" />
                      Add Section
                    </Button>
                  </div>

                  <div
                    v-for="(content, contentIndex) in part.question.content"
                    :key="contentIndex"
                    class="mb-3"
                  >
                    <Card>
                      <CardHeader>
                        <div class="flex justify-between items-center">
                          <CardTitle class="text-sm">Section {{ contentIndex + 1 }}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            @click="part.question.content.splice(contentIndex, 1)"
                          >
                            <X class="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent class="space-y-3">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div class="space-y-2">
                            <Label>Question Type</Label>
                            <Select v-model="content.type">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="completion">Completion</SelectItem>
                                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                <SelectItem value="multi-select">Multi Select</SelectItem>
                                <SelectItem value="selection">Selection (True/False)</SelectItem>
                                <SelectItem value="matching">Matching</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div class="space-y-2">
                            <Label>Section ID</Label>
                            <Input
                              v-model="content.id"
                              placeholder="qc_001"
                            />
                          </div>
                        </div>
                        <div class="space-y-2">
                          <Label>Title</Label>
                          <Input
                            v-model="content.title"
                            placeholder="e.g., Form Completion"
                          />
                        </div>
                        <div class="space-y-2">
                          <Label>Instructions</Label>
                          <Textarea
                            v-model="content.condition"
                            placeholder="e.g., Complete the form below. Write NO MORE THAN TWO WORDS for each answer."
                            rows="2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <!-- Reading Section -->
        <TabsContent value="reading" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold">Reading Section</h3>
            <Button @click="addReadingPart">
              <Plus class="mr-2 h-4 w-4" />
              Add Part
            </Button>
          </div>

          <div v-for="(part, index) in readingData.parts" :key="index" class="mb-4">
            <Card>
              <CardHeader>
                <div class="flex justify-between items-center">
                  <CardTitle>Part {{ index + 1 }}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="removeReadingPart(index)"
                  >
                    <Trash2 class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label>Part Type</Label>
                    <Select v-model="part.part">
                      <SelectTrigger>
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
                    <Label>Number of Questions</Label>
                    <Input
                      type="number"
                      v-model.number="part.question.number_of_questions"
                      min="1"
                      max="15"
                    />
                  </div>
                </div>

                <!-- Reading Passage -->
                <div class="space-y-2">
                  <Label>Reading Passage</Label>
                  <Textarea
                    v-model="part.passage"
                    placeholder="Enter the reading passage text here..."
                    rows="8"
                  />
                </div>

                <!-- Question Content -->
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <h5 class="font-medium">Question Content</h5>
                    <Button
                      size="sm"
                      variant="outline"
                      @click="addQuestionContent(part.question.content)"
                    >
                      <Plus class="mr-1 h-3 w-3" />
                      Add Section
                    </Button>
                  </div>

                  <div
                    v-for="(content, contentIndex) in part.question.content"
                    :key="contentIndex"
                    class="mb-3"
                  >
                    <Card>
                      <CardHeader>
                        <div class="flex justify-between items-center">
                          <CardTitle class="text-sm">Section {{ contentIndex + 1 }}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            @click="part.question.content.splice(contentIndex, 1)"
                          >
                            <X class="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent class="space-y-3">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div class="space-y-2">
                            <Label>Question Type</Label>
                            <Select v-model="content.type">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="completion">Completion</SelectItem>
                                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                <SelectItem value="multi-select">Multi Select</SelectItem>
                                <SelectItem value="selection">Selection (True/False)</SelectItem>
                                <SelectItem value="matching">Matching</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div class="space-y-2">
                            <Label>Section ID</Label>
                            <Input
                              v-model="content.id"
                              placeholder="qc_001"
                            />
                          </div>
                        </div>
                        <div class="space-y-2">
                          <Label>Title</Label>
                          <Input
                            v-model="content.title"
                            placeholder="e.g., Multiple Choice Questions"
                          />
                        </div>
                        <div class="space-y-2">
                          <Label>Instructions</Label>
                          <Textarea
                            v-model="content.condition"
                            placeholder="e.g., Choose the correct letter, A, B, C or D."
                            rows="2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <!-- Preview Section -->
        <TabsContent value="preview" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold">Test Preview</h3>
            <div class="flex gap-2">
              <Button @click="exportTest" variant="default">
                <Download class="mr-2 h-4 w-4" />
                Export JSON
              </Button>
              <Button @click="copyToClipboard" variant="outline">
                <Copy class="mr-2 h-4 w-4" />
                Copy JSON
              </Button>
            </div>
          </div>

          <Card class="bg-slate-950 text-green-400 overflow-auto max-h-96">
            <CardContent class="p-4">
              <pre class="text-xs">{{ generatedJSON }}</pre>
            </CardContent>
          </Card>

          <!-- Test Summary -->
          <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card class="bg-blue-50 dark:bg-blue-950">
              <CardContent class="p-4">
                <div class="flex items-center">
                  <Headphones class="text-blue-500 h-8 w-8 mr-3" />
                  <div>
                    <p class="text-sm font-medium">Listening Parts</p>
                    <p class="text-2xl font-bold text-blue-600">{{ listeningData.parts.length }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card class="bg-green-50 dark:bg-green-950">
              <CardContent class="p-4">
                <div class="flex items-center">
                  <BookOpen class="text-green-500 h-8 w-8 mr-3" />
                  <div>
                    <p class="text-sm font-medium">Reading Parts</p>
                    <p class="text-2xl font-bold text-green-600">{{ readingData.parts.length }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card class="bg-purple-50 dark:bg-purple-950">
              <CardContent class="p-4">
                <div class="flex items-center">
                  <FileQuestion class="text-purple-500 h-8 w-8 mr-3" />
                  <div>
                    <p class="text-sm font-medium">Total Questions</p>
                    <p class="text-2xl font-bold text-purple-600">{{ totalQuestions }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  </div>
</template>

<script setup>
import {
  Plus,
  Trash2,
  X,
  Eye,
  Download,
  Copy,
  Headphones,
  BookOpen,
  FileQuestion,
} from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "IELTS Test Builder - Testify",
});

const activeTab = ref("listening");

const testData = ref({
  title: "",
  description: "",
  for_cdi: false,
});

const listeningData = ref({
  title: "",
  description: "",
  for_cdi: false,
  parts: [],
});

const readingData = ref({
  title: "",
  description: "",
  for_cdi: false,
  parts: [],
});

// Add listening part
const addListeningPart = () => {
  listeningData.value.parts.push({
    part: "PART_1",
    question: {
      content: [],
      number_of_questions: 10,
    },
    audio: {
      url: "",
      file_name: "",
      duration: null,
      file_size: null,
    },
    answers: {},
  });
};

// Remove listening part
const removeListeningPart = (index) => {
  listeningData.value.parts.splice(index, 1);
};

// Add reading part
const addReadingPart = () => {
  readingData.value.parts.push({
    part: "PART_1",
    question: {
      content: [],
      number_of_questions: 13,
    },
    passage: "",
    answers: {},
  });
};

// Remove reading part
const removeReadingPart = (index) => {
  readingData.value.parts.splice(index, 1);
};

// Add question content
const addQuestionContent = (contentArray) => {
  contentArray.push({
    id: `qc_${Date.now()}`,
    type: "multiple-choice",
    title: "",
    condition: "",
    content: "",
    questions: [],
    options: [],
    limit: null,
    showOptions: true,
    optionsTitle: "",
  });
};

// Calculate total questions
const totalQuestions = computed(() => {
  let total = 0;
  listeningData.value.parts.forEach((part) => {
    total += part.question.number_of_questions || 0;
  });
  readingData.value.parts.forEach((part) => {
    total += part.question.number_of_questions || 0;
  });
  return total;
});

// Generate JSON
const generatedJSON = computed(() => {
  const testObject = {
    test: testData.value,
    listening:
      listeningData.value.parts.length > 0 ? listeningData.value : null,
    reading: readingData.value.parts.length > 0 ? readingData.value : null,
  };
  return JSON.stringify(testObject, null, 2);
});

// Export test as JSON file
const exportTest = () => {
  const blob = new Blob([generatedJSON.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ielts-test-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("Test exported successfully!");
};

// Copy JSON to clipboard
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedJSON.value);
    toast.success("JSON copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy: ", err);
    toast.error("Failed to copy to clipboard");
  }
};

// Initialize with sample data
onMounted(() => {
  testData.value = {
    title: "IELTS Academic Test - Practice Set 1",
    description:
      "A comprehensive IELTS Academic test designed for intermediate to advanced students preparing for their IELTS examination.",
    for_cdi: true,
  };

  listeningData.value = {
    title: "IELTS Listening Test - Academic Module",
    description:
      "A comprehensive listening test with 4 parts covering everyday conversations and academic lectures.",
    for_cdi: true,
    parts: [],
  };

  readingData.value = {
    title: "IELTS Reading Test - Academic Module",
    description:
      "A comprehensive reading test featuring three passages with increasing difficulty levels.",
    for_cdi: false,
    parts: [],
  };
});

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>
