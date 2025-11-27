<template>
  <div class="space-y-6">
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
            <Button variant="ghost" size="icon" @click="$emit('remove-word', index)">
              <X class="h-4 w-4" />
            </Button>
          </div>
          <Input
            :model-value="word.term"
            @update:model-value="(val) => updateWord(index, 'term', val)"
            placeholder="Term"
            class="w-full"
          />
          <Input
            :model-value="word.definition"
            @update:model-value="(val) => updateWord(index, 'definition', val)"
            placeholder="Definition"
            class="w-full"
          />
          <Input
            :model-value="word.example"
            @update:model-value="(val) => updateWord(index, 'example', val)"
            placeholder="Example sentence (optional)"
            class="w-full"
          />
        </div>
      </div>
    </div>
    <Button @click="$emit('add-word')" variant="outline" class="w-full">
      <Plus class="h-4 w-4 mr-2" />
      Add Word
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Plus, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VocabularyWord {
  term: string;
  definition: string;
  example: string;
}

interface VocabularyTabProps {
  vocabularyWords: VocabularyWord[];
}

const props = defineProps<VocabularyTabProps>();
const emit = defineEmits<{
  'update:vocabulary-words': [words: VocabularyWord[]];
  'add-word': [];
  'remove-word': [index: number];
}>();

const updateWord = (index: number, field: string, value: string) => {
  const updated = [...props.vocabularyWords];
  updated[index] = { ...updated[index], [field]: value };
  emit('update:vocabulary-words', updated);
};
</script>
