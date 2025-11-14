<template>
  <Card>
    <CardHeader>
      <div class="flex justify-between items-center">
        <CardTitle class="text-sm">Completion Question</CardTitle>
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
        <Label>Title</Label>
        <Input v-model="localData.title" placeholder="e.g., Form Completion" />
      </div>

      <div class="space-y-2">
        <Label>Instructions (HTML supported)</Label>
        <Textarea
          v-model="localData.condition"
          placeholder="e.g., Complete the form below. Write NO MORE THAN TWO WORDS for each answer."
          rows="3"
        />
      </div>

      <div class="space-y-2">
        <Label>
          Question Content (HTML supported, use @@ for blank spaces)
        </Label>
        <Textarea
          v-model="localData.content"
          placeholder="e.g., <p>Tour: Vietnam</p><p>Cost: £ @@</p>"
          rows="10"
          class="font-mono text-sm"
        />
        <p class="text-xs text-muted-foreground">
          Tip: Use @@ where students should fill in answers. Each @@ becomes a blank input field.
        </p>
      </div>

      <!-- Preview -->
      <div class="space-y-2">
        <Label>Preview</Label>
        <Card class="bg-muted/50">
          <CardContent class="p-4">
            <div v-if="localData.title" class="font-semibold mb-2">{{ localData.title }}</div>
            <div v-if="localData.condition" class="text-sm text-muted-foreground mb-3" v-html="localData.condition"></div>
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
import { X } from 'lucide-vue-next';

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

const previewContent = computed(() => {
  let questionNumber = 1;
  return localData.value.content.replace(/@@/g, () => {
    return `<span class="inline-block mx-1 px-3 py-1 border-2 border-dashed border-blue-300 rounded bg-blue-50 text-blue-600 font-mono text-sm min-w-24 text-center">[${questionNumber++}]</span>`;
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
