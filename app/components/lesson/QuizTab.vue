<template>
  <div class="space-y-6">
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
            <Button variant="ghost" size="icon" @click="$emit('remove-question', index)">
              <X class="h-4 w-4" />
            </Button>
          </div>
          <Input
            :model-value="question.text"
            @update:model-value="(val) => updateQuestion(index, 'text', val)"
            placeholder="Enter question"
            class="w-full"
          />
          <div class="space-y-2">
            <Input
              v-for="(option, optIndex) in question.options"
              :key="optIndex"
              :model-value="question.options[optIndex]"
              @update:model-value="(val) => updateOption(index, optIndex, val)"
              :placeholder="`Option ${optIndex + 1}`"
              class="w-full"
            />
          </div>
          <div>
            <Label class="text-xs text-gray-600">Correct Answer</Label>
            <Input
              :model-value="question.correctAnswer"
              @update:model-value="(val) => updateQuestion(index, 'correctAnswer', Number(val))"
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
    <Button @click="$emit('add-question')" variant="outline" class="w-full">
      <Plus class="h-4 w-4 mr-2" />
      Add Question
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Plus, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuizQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizTabProps {
  quizQuestions: QuizQuestion[];
}

const props = defineProps<QuizTabProps>();
const emit = defineEmits<{
  'update:quiz-questions': [questions: QuizQuestion[]];
  'add-question': [];
  'remove-question': [index: number];
}>();

const updateQuestion = (index: number, field: string, value: any) => {
  const updated = [...props.quizQuestions];
  updated[index] = { ...updated[index], [field]: value };
  emit('update:quiz-questions', updated);
};

const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
  const updated = [...props.quizQuestions];
  const options = [...updated[questionIndex].options];
  options[optionIndex] = value;
  updated[questionIndex] = { ...updated[questionIndex], options };
  emit('update:quiz-questions', updated);
};
</script>
