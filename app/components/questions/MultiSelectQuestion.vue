<template>
  <Card>
    <CardHeader>
      <div class="flex justify-between items-center">
        <CardTitle class="text-sm">Multi-Select Question</CardTitle>
        <Button variant="ghost" size="icon" @click="$emit('remove')">
          <X class="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <Label>Section ID</Label>
        <Input v-model="localData.id" placeholder="qc_001" />
      </div>

      <div class="space-y-2">
        <Label>Title (optional)</Label>
        <Input v-model="localData.title" placeholder="e.g., Section Title" />
      </div>

      <div class="space-y-2">
        <Label>Instructions</Label>
        <Textarea
          v-model="localData.condition"
          placeholder="e.g., Choose TWO letters, A–E.\nWhich TWO things does Arthur say people should focus on?"
          rows="3"
        />
      </div>

      <div class="space-y-2">
        <Label>Selection Limit</Label>
        <Input
          type="number"
          v-model.number="localData.limit"
          placeholder="2"
          min="1"
        />
        <p class="text-xs text-muted-foreground">
          Maximum number of options students can select
        </p>
      </div>

      <!-- Options -->
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <Label class="text-base">Options</Label>
          <Button size="sm" @click="addOption">
            <Plus class="h-4 w-4 mr-1" />
            Add Option
          </Button>
        </div>

        <div v-for="(option, index) in localData.options" :key="option.id" class="flex gap-2">
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
            @click="removeOption(index)"
          >
            <Trash2 class="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed, watch } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'remove']);

const localData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const addOption = () => {
  if (!localData.value.options) {
    localData.value.options = [];
  }
  const nextLetter = String.fromCharCode(65 + localData.value.options.length);
  localData.value.options.push({
    id: `opt_${Date.now()}`,
    value: nextLetter,
    label: ''
  });
};

const removeOption = (index) => {
  localData.value.options.splice(index, 1);
};

watch(localData, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });
</script>
