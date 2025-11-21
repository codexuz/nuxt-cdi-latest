<template>
  <Card>
    <Collapsible v-model:open="isOpen">
      <CollapsibleTrigger class="w-full">
        <CardHeader class="cursor-pointer hover:bg-muted/50 transition-colors">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <ChevronRight class="h-4 w-4 transition-transform" :class="{ 'rotate-90': isOpen }" />
              <CardTitle class="text-sm">Selection Question (Dropdown/Matching)</CardTitle>
            </div>
            <Button variant="ghost" size="icon" @click.stop="confirmDelete" class="hover:bg-destructive/10 hover:text-destructive">
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardContent class="space-y-4 pt-0">
      <div class="space-y-2">
        <Label>Section ID</Label>
        <Input v-model="localData.id" placeholder="qc_001" />
      </div>

      <div class="space-y-2">
        <Label>Title</Label>
        <Input v-model="localData.title" placeholder="e.g. Questions 1-6" />
      </div>

      <div class="space-y-2">
        <Label>Instructions</Label>
        <Textarea
          v-model="localData.condition"
          placeholder="e.g., Choose the correct heading for each paragraph"
          rows="3"
        />
      </div>

      <div class="flex items-center space-x-2">
        <Checkbox 
          :checked="localData.showOptions" 
          @update:checked="(val) => localData.showOptions = val"
          id="showOptions"
        />
        <Label for="showOptions">Show options list to students</Label>
      </div>

      <div v-if="localData.showOptions" class="space-y-2">
        <Label>Options Section Title</Label>
        <Input v-model="localData.optionsTitle" placeholder="e.g., List of Headings, OPTIONS" />
      </div>

      <!-- Options -->
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <Label class="text-base">Selection Options</Label>
          <Button size="sm" @click="addOption">
            <Plus class="h-4 w-4 mr-1" />
            Add Option
          </Button>
        </div>

        <div v-for="(option, index) in localData.options" :key="option.id" class="flex gap-2">
          <Input
            v-model="option.value"
            placeholder="I, II, A, B, YES, NO"
            class="w-32"
          />
          <Input
            v-model="option.label"
            placeholder="Option description (optional for YES/NO)"
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
          Question Content (Use @@ for dropdown selectors)
        </Label>
        <QuillEditor style="min-height: 300px;"           
         placeholder="e.g., <p>Tour: Vietnam</p><p>Cost: £ @@</p>"
         contentType="html"  theme="snow" v-model:content="localData.content" />
        <p class="text-xs text-muted-foreground">
          Tip: Use @@ where students should select from dropdown. Each @@ becomes a select field.
        </p>
      </div>

      <!-- Preview -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label>Preview</Label>
          <Button 
            variant="outline" 
            size="sm" 
            @click="showPreview = !showPreview"
            class="text-xs border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
          >
            <Eye v-if="!showPreview" class="h-3 w-3 mr-1" />
            <EyeOff v-else class="h-3 w-3 mr-1" />
            {{ showPreview ? 'Hide' : 'Show' }}
          </Button>
        </div>
        <Card v-if="showPreview" class="bg-muted/50">
          <CardContent class="p-4">
            <div v-if="localData.title" class="font-semibold mb-2">{{ localData.title }}</div>
            <div v-if="localData.condition" class="text-sm text-muted-foreground mb-3" v-html="localData.condition"></div>
            <div v-if="localData.showOptions && localData.options.length" class="mb-3 p-3 border rounded">
              <div class="font-medium text-sm mb-2">{{ localData.optionsTitle || 'Options' }}</div>
              <div class="space-y-1 text-sm">
                <div v-for="option in localData.options" :key="option.id">
                  <span class="font-semibold">{{ option.value }}</span>
                  <span v-if="option.label" class="ml-2">{{ option.label }}</span>
                </div>
              </div>
            </div>
            <div class="preview-content" v-html="previewContent"></div>
          </CardContent>
        </Card>
      </div>
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  </Card>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Eye, EyeOff, ChevronRight } from 'lucide-vue-next';

const showPreview = ref(false);
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

const addOption = () => {
  if (!localData.value.options) {
    localData.value.options = [];
  }
  localData.value.options.push({
    id: `opt_${Date.now()}`,
    value: '',
    label: ''
  });
};

const removeOption = (index) => {
  localData.value.options.splice(index, 1);
};

const previewContent = computed(() => {
  let selectNumber = 1;
  return localData.value.content.replace(/@@/g, () => {
    const optionsHtml = localData.value.options.map(opt => 
      `<option value="${opt.value}">${opt.value}${opt.label ? ' - ' + opt.label : ''}</option>`
    ).join('');
    return `<select class="inline-block mx-1 px-2 py-1 border border-gray-300 rounded-md bg-white min-w-24">
      <option value="">Select ${selectNumber++}</option>
      ${optionsHtml}
    </select>`;
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

.preview-content :deep(select) {
  display: inline-block;
  margin: 0 0.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  min-width: 6rem;
}
</style>
