<template>
  <div class="ckeditor-wrapper">
    <ckeditor
      :editor="editor"
      :model-value="modelValue"
      @update:modelValue="handleUpdate"
      :config="editorConfig"
    />
  </div>
</template>

<script setup>
import {
  ClassicEditor,
  Bold,
  Italic,
  Link,
  List,
  Essentials,
  Paragraph,
  Undo,
  Table,
  TableToolbar,
  Image,
  ImageToolbar,
  ImageResize,
  ImageInsert,
  Heading,
  Alignment,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Start typing...",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editor = ClassicEditor;
const editorConfig = {
  plugins: [
    Essentials,
    Bold,
    Italic,
    Link,
    Paragraph,
    List,
    Undo,
    Table,
    TableToolbar,
    Image,
    ImageToolbar,
    ImageResize,
    ImageInsert,
    Heading,
    Alignment,
  ],
  toolbar: [
    "undo",
    "redo",
    "|",
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "|",
    "alignment",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "insertTable",
    "insertImage",
  ],
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
    ],
  },
  alignment: {
    options: ["left", "center", "right", "justify"],
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
  image: {
    toolbar: ["imageTextAlternative", "|", "imageResize"],
    insert: {
      integrations: ["url"],
    },
  },
  placeholder: props.placeholder,
  licenseKey: "GPL",
};

const handleUpdate = (value) => {
  emit("update:modelValue", value);
};
</script>

<style>
.ckeditor-wrapper :deep(.ck-editor__editable_inline) {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}
</style>
