<template>
  <Card>
    <Collapsible v-model:open="isOpen">
      <CollapsibleTrigger class="w-full">
        <CardHeader class="cursor-pointer hover:bg-muted/50 transition-colors">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <ChevronRight
                class="h-4 w-4 transition-transform"
                :class="{ 'rotate-90': isOpen }"
              />
              <CardTitle class="text-sm">Completion Question</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              @click.stop="confirmDelete"
              class="hover:bg-destructive/10 hover:text-destructive"
            >
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
            <Input v-model="localData.title" placeholder="e.g.Questions 1-6" />
          </div>

          <div class="space-y-2">
            <Label>Instructions</Label>
            <Textarea
              v-model="localData.condition"
              placeholder="e.g., Complete the form below. Write NO MORE THAN TWO WORDS for each answer."
              rows="3"
            />
          </div>

          <div class="space-y-2">
            <Label> Question Content (Use @@ for blank spaces) </Label>
            <QuillEditor
              style="min-height: 300px"
              placeholder="e.g., <p>Tour: Vietnam</p><p>Cost: £ @@</p>"
              contentType="html"
              theme="snow"
              v-model:content="localData.content"
            />
            <p class="text-xs text-muted-foreground">
              Tip: Use @@ where students should fill in answers. Each @@ becomes
              a blank input field.
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
                {{ showPreview ? "Hide" : "Show" }}
              </Button>
            </div>
            <Card v-if="showPreview" class="bg-muted/50">
              <CardContent class="p-4">
                <div v-if="localData.title" class="font-semibold mb-2">
                  {{ localData.title }}
                </div>
                <div
                  v-if="localData.condition"
                  class="text-sm text-muted-foreground mb-3"
                  v-html="localData.condition"
                ></div>
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
import { computed, watch, ref } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, EyeOff, ChevronRight } from "lucide-vue-next";

const showPreview = ref(false);
const isOpen = ref(true);

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "remove"]);

const confirmDelete = () => {
  if (
    confirm(
      "Are you sure you want to delete this question? This action cannot be undone."
    )
  ) {
    emit("remove");
  }
};

const localData = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const previewContent = computed(() => {
  let questionNumber = 1;
  return localData.value.content.replace(/@@/g, () => {
    return `<span class="inline-block mx-1 px-3 py-1 border-2 border-dashed border-blue-300 rounded bg-blue-50 text-blue-600 font-mono text-sm min-w-24 text-center">[${questionNumber++}]</span>`;
  });
});

watch(
  localData,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);
</script>

<style scoped>
.preview-content :deep(p) {
  margin-bottom: 0.5rem;
}
</style>
