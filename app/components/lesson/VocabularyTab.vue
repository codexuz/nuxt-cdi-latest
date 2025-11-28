<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Vocabulary Words</h3>
        <p class="text-sm text-gray-500 mt-1">
          {{ vocabularyWords.length }} words added
        </p>
      </div>
      <div class="flex gap-2">
        <Button @click="openBulkImport" variant="outline" class="gap-2">
          <FileText class="h-4 w-4" />
          Bulk Import
        </Button>
        <Button @click="addWord" class="gap-2">
          <Plus class="h-4 w-4" />
          Add Word
        </Button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="vocabularyWords.length === 0" class="text-center py-12">
      <div
        class="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4"
      >
        <BookOpen class="h-8 w-8 text-blue-500" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        No vocabulary words yet
      </h3>
      <p class="text-gray-500 mb-6">
        Start building your vocabulary list by adding words
      </p>
    </div>

    <!-- Vocabulary Cards -->
    <div v-else class="space-y-4">
      <motion.div
        v-for="(word, index) in vocabularyWords"
        :key="word.id || index"
        class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.3, delay: index * 0.05 }"
      >
        <!-- Card Header -->
        <div
          class="flex items-start justify-between mb-4 cursor-pointer"
          @click="toggleCard(index)"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
            >
              {{ index + 1 }}
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">
                {{ word.word || "New Word" }}
              </h4>
              <p class="text-xs text-gray-500">Word #{{ index + 1 }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              @click.stop="toggleCard(index)"
              class="text-gray-400 hover:text-gray-600"
            >
              <ChevronDown v-if="!expandedCards.has(index)" class="h-4 w-4" />
              <ChevronUp v-else class="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              @click.stop="removeWord(index)"
              class="text-gray-400 hover:text-red-500"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <!-- Main Content -->
        <div
          v-show="expandedCards.has(index)"
          class="grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-300"
        >
          <!-- Left Column -->
          <div class="space-y-4">
            <!-- English Word -->
            <div class="space-y-2">
              <Label
                class="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Languages class="h-4 w-4" />
                English Word
              </Label>
              <Input
                :model-value="word.word"
                @update:model-value="(val) => updateWord(index, 'word', val)"
                placeholder="Enter English word"
                class="w-full"
              />
            </div>

            <!-- Uzbek Translation -->
            <div class="space-y-2">
              <Label
                class="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Flag class="h-4 w-4" />
                Uzbek Translation
              </Label>
              <Input
                :model-value="word.uz"
                @update:model-value="(val) => updateWord(index, 'uz', val)"
                placeholder="O'zbek tilidagi tarjima"
                class="w-full"
              />
            </div>

            <!-- Russian Translation -->
            <div class="space-y-2">
              <Label
                class="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Flag class="h-4 w-4" />
                Russian Translation
              </Label>
              <Input
                :model-value="word.ru"
                @update:model-value="(val) => updateWord(index, 'ru', val)"
                placeholder="Русский перевод"
                class="w-full"
              />
            </div>

            <!-- Example Sentence -->
            <div class="space-y-2">
              <Label
                class="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <MessageSquare class="h-4 w-4" />
                Example Sentence
              </Label>
              <Textarea
                :model-value="word.example"
                @update:model-value="(val) => updateWord(index, 'example', val)"
                placeholder="Example sentence using this word"
                rows="2"
                class="w-full resize-none"
              />
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-4">
            <!-- Audio URL -->
            <div class="space-y-2">
              <Label
                class="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Volume2 class="h-4 w-4" />
                Audio Pronunciation
              </Label>
              <div class="flex gap-2">
                <Input
                  :model-value="word.audio_url"
                  @update:model-value="
                    (val) => updateWord(index, 'audio_url', val)
                  "
                  placeholder="Audio URL (optional)"
                  class="flex-1"
                />
                <Button
                  v-if="word.audio_url"
                  variant="outline"
                  size="icon"
                  @click="playAudio(word.audio_url)"
                  class="shrink-0"
                >
                  <Play class="h-4 w-4" />
                </Button>
              </div>
              <audio
                v-if="word.audio_url"
                :src="word.audio_url"
                class="w-full h-8"
                controls
              ></audio>
            </div>

            <!-- Image URL -->
            <div class="space-y-2">
              <Label
                class="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Image class="h-4 w-4" />
                Visual Aid
              </Label>
              <div class="flex gap-2">
                <Input
                  :model-value="word.image_url"
                  @update:model-value="
                    (val) => updateWord(index, 'image_url', val)
                  "
                  placeholder="Image URL (optional)"
                  class="flex-1"
                />
                <Button
                  variant="outline"
                  @click="openImagePicker(index)"
                  class="shrink-0"
                >
                  <Upload class="h-4 w-4 mr-2" />
                  Browse
                </Button>
              </div>
              <!-- Image Preview -->
              <div v-if="word.image_url" class="mt-3">
                <img
                  :src="word.image_url"
                  :alt="word.word"
                  class="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-200"
                  @error="handleImageError(index)"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    <!-- Save Button -->
    <div
      v-if="vocabularyWords.length > 0"
      class="flex justify-end pt-6 border-t border-gray-200"
    >
      <Button @click="saveAllWords" :disabled="isSaving" class="gap-2">
        <template v-if="isSaving">
          <div
            class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
          ></div>
          Saving...
        </template>
        <template v-else>
          <Save class="h-4 w-4" />
          Save All Words
        </template>
      </Button>
    </div>

    <!-- Bulk Import Modal -->
    <Dialog v-model:open="showBulkImport">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Import Vocabulary</DialogTitle>
          <DialogDescription>
            Import multiple words at once using comma-separated format like
            Quizlet. Format: English, Uzbek, Russian, Example (each word on a
            new line)
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Import Data</Label>
            <Textarea
              v-model="bulkImportText"
              placeholder="Example format:
hello, salom, привет, Hello everyone!
world, dunyo, мир, The world is beautiful
book, kitob, книга, I love reading books"
              rows="8"
              class="font-mono text-sm"
            />
          </div>
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="text-sm text-blue-700">
              <strong>Format:</strong> English word, Uzbek translation, Russian
              translation, Example sentence
            </p>
            <p class="text-xs text-blue-600 mt-1">
              Each field is separated by commas. Each word should be on a new
              line.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showBulkImport = false">
            Cancel
          </Button>
          <Button @click="processBulkImport" :disabled="!bulkImportText.trim()">
            Import {{ getBulkImportPreviewCount() }} Words
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Media Picker Modal -->
    <MediaPickerModal
      v-model:open="showMediaPicker"
      @selected="handleMediaSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { motion } from "motion-v";
import {
  Plus,
  Trash2,
  Languages,
  Flag,
  MessageSquare,
  Volume2,
  Play,
  Image,
  Upload,
  BookOpen,
  FileText,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import MediaPickerModal from "@/components/MediaPickerModal.vue";

interface VocabularyWord {
  id?: string;
  word: string;
  uz: string;
  ru: string;
  example: string;
  audio_url: string;
  image_url: string;
  order: number;
}

interface VocabularyTabProps {
  words: VocabularyWord[];
}

const props = defineProps<VocabularyTabProps>();
const emit = defineEmits<{
  "update:words": [words: VocabularyWord[]];
}>();

// Use words prop instead of vocabularyWords
const vocabularyWords = computed(() => props.words || []);

// Media picker state
const showMediaPicker = ref(false);
const currentWordIndex = ref<number | null>(null);

// Bulk import state
const showBulkImport = ref(false);
const bulkImportText = ref("");

// Save state
const isSaving = ref(false);

// Collapsible cards state
const expandedCards = ref<Set<number>>(new Set());

// Get API configuration
const config = useRuntimeConfig();
const API_BASE_URL = config.public.baseURL as string;
const authStore = useAuthStore();

const getAuthHeaders = () => ({
  Authorization: `Bearer ${authStore.token}`,
  "Content-Type": "application/json",
});

interface VocabularyResponse {
  id: string;
  word: string;
  uz: string;
  ru: string;
  example: string;
  audio_url: string;
  image_url: string;
  order: number;
}

// Add new word (local only)
const addWord = () => {
  const newWordData: VocabularyWord = {
    word: "",
    uz: "",
    ru: "",
    example: "",
    audio_url: "",
    image_url: "",
    order: vocabularyWords.value.length,
  };

  const updated = [...vocabularyWords.value, newWordData];
  emit("update:words", updated);

  // Auto-expand the new word card
  expandedCards.value.add(updated.length - 1);

  toast.success("New vocabulary word added");
};

// Update word field (local only)
const updateWord = (index: number, field: string, value: string | number) => {
  const updated = [...vocabularyWords.value];
  if (updated[index]) {
    updated[index] = { ...updated[index], [field]: value };
    emit("update:words", updated);
  }
};

// Remove word
const removeWord = async (index: number) => {
  const word = vocabularyWords.value[index];
  if (!word) return;

  try {
    // Delete from API if word has an ID
    if (word.id) {
      const centerId = authStore.user?.center_id;
      if (!centerId) {
        toast.error("No center ID found");
        return;
      }

      await $fetch(
        `${API_BASE_URL}/centers/${centerId}/lms/vocabulary/${word.id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
    }

    const updated = vocabularyWords.value.filter((_, i) => i !== index);
    // Reorder remaining words
    updated.forEach((w, i) => {
      w.order = i;
    });
    emit("update:words", updated);
    toast.success("Vocabulary word removed");
  } catch (error: any) {
    console.error("Failed to delete vocabulary word:", error);
    toast.error("Failed to delete vocabulary word");
  }
};

// Play audio
const playAudio = (audioUrl: string) => {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      toast.error("Could not play audio");
    });
  }
};

// Handle image error
const handleImageError = (index: number) => {
  toast.error("Failed to load image");
};

// Open image picker
const openImagePicker = (index: number) => {
  currentWordIndex.value = index;
  showMediaPicker.value = true;
};

// Handle media selection
const handleMediaSelect = (media: any) => {
  if (currentWordIndex.value !== null) {
    updateWord(currentWordIndex.value, "image_url", media.url);
    toast.success("Image added to vocabulary word");
  }
  showMediaPicker.value = false;
  currentWordIndex.value = null;
};

// Toggle card collapse/expand
const toggleCard = (index: number) => {
  if (expandedCards.value.has(index)) {
    expandedCards.value.delete(index);
  } else {
    expandedCards.value.add(index);
  }
};

// Save all words to API
const saveAllWords = async () => {
  try {
    isSaving.value = true;
    const centerId = authStore.user?.center_id;
    const route = useRoute();
    const lessonId = route.params.lessonId as string;

    if (!centerId) {
      toast.error("No center ID found");
      return;
    }

    const savedWords: VocabularyWord[] = [];

    for (const [index, word] of vocabularyWords.value.entries()) {
      const wordData = {
        word: word.word || "",
        uz: word.uz || "",
        ru: word.ru || "",
        example: word.example || "",
        audio_url: word.audio_url || "",
        image_url: word.image_url || "",
        order: index,
      };

      if (word.id) {
        // Update existing word
        await $fetch(
          `${API_BASE_URL}/centers/${centerId}/lms/vocabulary/${word.id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: wordData,
          }
        );
        savedWords.push({ ...word, ...wordData });
      } else {
        // Create new word
        const response = await $fetch<VocabularyResponse>(
          `${API_BASE_URL}/centers/${centerId}/lms/lessons/${lessonId}/vocabulary`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: wordData,
          }
        );
        savedWords.push({ id: response.id, ...wordData });
      }
    }

    emit("update:words", savedWords);
    toast.success(`Successfully saved ${savedWords.length} vocabulary words`);
  } catch (error: any) {
    console.error("Failed to save vocabulary words:", error);
    toast.error("Failed to save vocabulary words");
  } finally {
    isSaving.value = false;
  }
};

// Bulk import functions
const openBulkImport = () => {
  bulkImportText.value = "";
  showBulkImport.value = true;
};

const getBulkImportPreviewCount = () => {
  if (!bulkImportText.value.trim()) return 0;
  return bulkImportText.value
    .trim()
    .split("\n")
    .filter((line) => line.trim()).length;
};

const processBulkImport = async () => {
  try {
    const lines = bulkImportText.value
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    const newWords: VocabularyWord[] = [];
    const centerId = authStore.user?.center_id;
    const lessonId = useRoute().params.lessonId as string;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const trimmedLine = line.trim();
      const parts = trimmedLine.split(",").map((part) => part.trim());

      if (parts.length >= 1) {
        const wordData = {
          word: parts[0] || "",
          uz: parts[1] || "",
          ru: parts[2] || "",
          example: parts[3] || "",
          audio_url: "",
          image_url: "",
          order: vocabularyWords.value.length + newWords.length,
        };

        // Create word via API
        const response = await $fetch<VocabularyResponse>(
          `${API_BASE_URL}/centers/${centerId}/lms/lessons/${lessonId}/vocabulary`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: wordData,
          }
        );

        const word: VocabularyWord = {
          id: response.id,
          ...wordData,
        };
        newWords.push(word);
      }
    }

    if (newWords.length > 0) {
      const updated = [...vocabularyWords.value, ...newWords];
      emit("update:words", updated);
      toast.success(
        `Successfully imported ${newWords.length} vocabulary words`
      );
      showBulkImport.value = false;
      bulkImportText.value = "";
    } else {
      toast.error("No valid words found to import");
    }
  } catch (error) {
    console.error("Bulk import error:", error);
    toast.error("Failed to import words. Please check the format.");
  }
};
</script>
