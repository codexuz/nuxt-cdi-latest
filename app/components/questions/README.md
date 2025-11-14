# Question Builder Components

Vue 3 components for **building and creating** IELTS question types in the test builder interface. These are form components with editable fields that generate the JSON structure matching `testDataIELTSZONE.json`.

## Components Overview

All components use `v-model` for two-way binding and emit `remove` event for deletion.

### 1. CompletionQuestion.vue
**Type:** `completion`

Builder for fill-in-the-blank questions with `@@` markers.

**Features:**
- Section ID input
- Title input  
- Instructions textarea (HTML supported)
- Content textarea with `@@` placeholders
- Live preview showing how blanks will appear

**Usage:**
```vue
<CompletionQuestion 
  v-model="questionData"
  @remove="handleRemove"
/>
```

### 2. MultipleChoiceQuestion.vue
**Type:** `multiple-choice`

Builder for single-answer multiple choice questions.

**Features:**
- Section ID and title inputs
- Instructions textarea
- Add/remove questions dynamically
- Add/remove options (A, B, C, D) per question
- Editable question text and option labels

**Usage:**
```vue
<MultipleChoiceQuestion 
  v-model="questionData"
  @remove="handleRemove"
/>
```

### 3. MultiSelectQuestion.vue
**Type:** `multi-select`

Builder for questions requiring multiple selections.

**Features:**
- Section ID and optional title
- Instructions textarea
- Selection limit input (e.g., "Choose TWO")
- Add/remove options with letter values
- Editable option labels

**Usage:**
```vue
<MultiSelectQuestion 
  v-model="questionData"
  @remove="handleRemove"
/>
```

### 4. DraggableSelectionQuestion.vue
**Type:** `draggable-selection`

Builder for drag-and-drop questions.

**Features:**
- Section ID and optional title
- Instructions textarea
- Options pool title
- Add/remove draggable options
- Content textarea with `@@` for drop zones
- Live preview showing drop zones

**Usage:**
```vue
<DraggableSelectionQuestion 
  v-model="questionData"
  @remove="handleRemove"
/>
```

### 5. SelectionQuestion.vue
**Type:** `selection`

Builder for dropdown/matching questions (True/False, Yes/No, Headings).

**Features:**
- Section ID and title
- Instructions textarea (HTML supported)
- Toggle to show/hide options list
- Options section title
- Add/remove selection options
- Content textarea with `@@` for dropdowns
- Live preview with dropdown fields

**Usage:**
```vue
<SelectionQuestion 
  v-model="questionData"
  @remove="handleRemove"
/>
```

## Integration with Test Builder

### In `test-builder/index.vue`

```vue
<template>
  <div>
    <!-- Question Type Selector -->
