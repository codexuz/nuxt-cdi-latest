<template>
  <Card>
    <CardHeader>
      <div class="flex justify-between items-center">
        <CardTitle class="text-sm">Draggable Selection Question</CardTitle>
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
        <Input v-model="localData.title" placeholder="e.g., Flow Chart" />
      </div>

      <div class="space-y-2">
        <Label>Instructions</Label>
        <Textarea
          v-model="localData.condition"
          placeholder="e.g., Complete the flow-chart below. Choose answers from the box and drag to the correct letter."
          rows="3"
        />
      </div>

      <div class="space-y-2">
        <Label>Options Pool Title</Label>
        <Input v-model="localData.optionsTitle" placeholder="e.g., Available Options" />
      </div>

      <!-- Options -->
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <Label class="text-base">Draggable Options</Label>
          <Button size="sm" @click="addOption">
            <Plus class="h-4 w-4 mr-1" />
            Add Option
          </Button>
        </div>

        <div v-for="(option, index) in localData.options" :key="option.id" class="flex gap-2">
          <Input
            v-model="option.value"
            placeholder="e.g., seeds, plants, nutrients"
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

      <div class="space-y-2">
        <Label>
          Question Content (HTML supported, use @@ for drop zones)
        </Label>
        <Textarea
          v-model="localData.content"
          placeholder="e.g., <p>Choose a reforestation area with plenty of @@</p><p>Take a lot of suitable @@</p>"
          rows="8"
          class="font-mono text-sm"
        />
        <p class="text-xs text-muted-foreground">
          Tip: Use @@ where students should drag and drop answers. Each @@ becomes a drop zone.
        </p>
      </div>

      <!-- Preview -->
      <div class="space-y-2">
        <Label>Preview</Label>
        <Card class="bg-muted/50">
          <CardContent class="p-4">
            <div v-if="localData.title" class="font-semibold mb-2">{{ localData.title }}</div>
            <div v-if="localData.condition" class="text-sm text-muted-foreground mb-3 whitespace-pre-line">
              {{ localData.condition }}
            </div>
            <div class="mb-3">
              <div class="font-medium text-sm mb-2">{{ localData.optionsTitle || 'Options' }}</div>
              <div class="flex flex-wrap gap-2">
                <Badge v-for="option in localData.options" :key="option.id" variant="secondary">
                  {{ option.value }}
                </Badge>
              </div>
            </div>
            <div class="preview-content" v-html="previewContent"></div>
          </CardContent>
        </Card>
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
import { Badge } from '@/components/ui/badge';
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
  localData.value.options.push({
    id: `opt_${Date.now()}`,
    value: ''
  });
};

const removeOption = (index) => {
  localData.value.options.splice(index, 1);
};

const previewContent = computed(() => {
  let zoneNumber = 1;
  return localData.value.content.replace(/@@/g, () => {
    return `<span class="inline-block mx-1 px-3 py-1 border-2 border-dashed border-purple-300 rounded bg-purple-50 text-purple-600 font-mono text-sm min-w-24 text-center">[Drop ${zoneNumber++}]</span>`;
  });
});

watch(localData, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });
</script>

<style scoped>
.preview-content :deep(p) {
  margin-bottom: 0.5rem;
}
</style>
