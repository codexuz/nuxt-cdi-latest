<template>
  <Collapsible v-model:open="isOpen">
    <Card>
      <CollapsibleTrigger as-child>
        <CardHeader class="cursor-pointer hover:bg-muted/50 transition-colors">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <ChevronRight class="h-4 w-4 transition-transform" :class="isOpen ? 'rotate-90' : ''" />
              <CardTitle class="text-sm">Multiple Choice Question</CardTitle>
            </div>
            <Button variant="ghost" size="icon" @click.stop="confirmDelete" class="hover:bg-destructive/10">
              <Trash2 class="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
      </CollapsibleTrigger>
      <CollapsibleContent>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <Label>Section ID</Label>
        <Input v-model="localData.id" placeholder="qc_001" />
      </div>

      <div class="space-y-2">
        <Label>Title</Label>
        <Input v-model="localData.title" placeholder="e.g., Section Title" />
      </div>

      <div class="space-y-2">
        <Label>Instructions</Label>
        <Textarea
          v-model="localData.condition"
          placeholder="e.g., Choose the correct letter, A, B, or C."
          rows="2"
        />
      </div>

      <!-- Questions List -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <Label class="text-base">Questions</Label>
          <Button size="sm" @click="addQuestion">
            <Plus class="h-4 w-4 mr-1" />
            Add Question
          </Button>
        </div>

        <div v-for="(question, qIndex) in localData.questions" :key="question.id" class="space-y-3">
          <Card>
            <CardHeader>
              <div class="flex justify-between items-center">
                <CardTitle class="text-sm">Question {{ qIndex + 1 }}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="removeQuestion(qIndex)"
                >
                  <Trash2 class="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="space-y-2">
                <Label>Question Text</Label>
                <Textarea
                  v-model="question.question"
                  placeholder="Enter the question..."
                  rows="2"
                />
              </div>

              <!-- Options -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <Label>Options</Label>
                  <Button size="sm" variant="outline" @click="addOption(qIndex)">
                    <Plus class="h-3 w-3 mr-1" />
                    Add Option
                  </Button>
                </div>

                <div v-for="(option, oIndex) in question.options" :key="option.id" class="flex gap-2">
                  <Input
                    v-model="option.value"
                    placeholder="A"
                    class="w-16"
                  />
                  <Input
                    v-model="option.label"
                    placeholder="Option text"
                    class="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="removeOption(qIndex, oIndex)"
                  >
                    <X class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CardContent>
      </CollapsibleContent>
    </Card>
  </Collapsible>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Trash2, ChevronRight } from 'lucide-vue-next';

const isOpen = ref(true);

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'remove']);

const confirmDelete = () => {
  if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
    emit('remove');
  }
};

const localData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const addQuestion = () => {
  if (!localData.value.questions) {
    localData.value.questions = [];
  }
  localData.value.questions.push({
    id: `q_${Date.now()}`,
    question: '',
    options: [
      { id: `opt_${Date.now()}_1`, value: 'A', label: '' },
      { id: `opt_${Date.now()}_2`, value: 'B', label: '' },
      { id: `opt_${Date.now()}_3`, value: 'C', label: '' }
    ]
  });
};

const removeQuestion = (index) => {
  localData.value.questions.splice(index, 1);
};

const addOption = (questionIndex) => {
  const options = localData.value.questions[questionIndex].options;
  const nextLetter = String.fromCharCode(65 + options.length); // A=65, B=66, etc.
  options.push({
    id: `opt_${Date.now()}`,
    value: nextLetter,
    label: ''
  });
};

const removeOption = (questionIndex, optionIndex) => {
  localData.value.questions[questionIndex].options.splice(optionIndex, 1);
};

watch(localData, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });
</script>
