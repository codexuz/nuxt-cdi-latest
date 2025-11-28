<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium text-gray-700 mb-2 block"
        >Block title</Label
      >
      <Input
        :model-value="block.title"
        @update:model-value="updateTitle"
        placeholder="Enter the title"
        class="w-full"
      />
    </div>
    <div>
      <Label class="text-sm font-medium text-gray-700 mb-2 block"
        >Block content</Label
      >
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <QuillEditor
          v-model:content="localContent"
          @update:content="updateContent"
          contentType="html"
          theme="snow"
          :toolbar="toolbarOptions"
          placeholder="Press / to select a tool"
          class="quill-editor-custom"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditorBlockProps {
  block: {
    id: number;
    type: string;
    title: string;
    content: string;
  };
}

const props = defineProps<EditorBlockProps>();
const emit = defineEmits<{
  "update:block": [block: any];
}>();

const localContent = ref(props.block.content);

// Watch for changes in props.block.content to sync localContent
watch(
  () => props.block.content,
  (newContent) => {
    localContent.value = newContent;
  },
  { immediate: true }
);

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"],
];

const updateTitle = (value: string) => {
  emit("update:block", { ...props.block, title: value });
};

const updateContent = (content: string) => {
  console.log("EditorBlock updateContent called with:", content);
  localContent.value = content;
  emit("update:block", { ...props.block, content: content });
};
</script>

<style scoped>
/* Quill Editor Custom Styles */
:deep(.quill-editor-custom .ql-container) {
  min-height: 200px;
  font-size: 14px;
}

:deep(.quill-editor-custom .ql-editor) {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

:deep(.quill-editor-custom .ql-toolbar) {
  background-color: #f9fafb;
  border: none;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.quill-editor-custom .ql-container) {
  border: none;
}

:deep(.quill-editor-custom .ql-editor.ql-blank::before) {
  color: #9ca3af;
  font-style: normal;
}
</style>
