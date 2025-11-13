<template>
  <div class="demo-page p-8 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-center">IELTS Question Components Demo</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Completion Question Demo -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-blue-600">Completion Question</h2>
        <CompletionQuestion 
          :question="completionQuestion as any" 
          v-model="completionAnswers" 
        />
      </div>
      
      <!-- Multiple Choice Question Demo -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-blue-600">Multiple Choice Question</h2>
        <MultipleChoiceQuestion 
          :question="multipleChoiceQuestion as any" 
          v-model="multipleChoiceAnswers" 
        />
      </div>
      
      <!-- Multi-Select Question Demo -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-blue-600">Multi-Select Question</h2>
        <MultiSelectQuestion 
          :question="multiSelectQuestion as any" 
          v-model="multiSelectAnswers" 
        />
      </div>
      
      <!-- Selection Question Demo -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-blue-600">Selection Question (YES/NO/NOT GIVEN)</h2>
        <SelectionQuestion 
          :question="selectionQuestion as any" 
          v-model="selectionAnswers" 
        />
      </div>
    </div>
    
    <!-- Audio Player Demo -->
    <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-4 text-blue-600">Audio Player</h2>
      <AudioPlayer :audio-data="audioData" part="PART 1" />
    </div>
    
    <!-- Draggable Selection Demo -->
    <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-4 text-blue-600">Draggable Selection Question</h2>
      <DraggableSelectionQuestion 
        :question="draggableQuestion as any" 
        v-model="draggableAnswers" 
      />
    </div>
    
    <!-- Answer Summary -->
    <div class="mt-8 bg-gray-50 rounded-xl p-6">
      <h2 class="text-2xl font-semibold mb-4">Answer Summary</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="font-medium mb-2">Completion Answers:</h3>
          <pre class="bg-white p-3 rounded text-sm">{{ completionAnswers }}</pre>
        </div>
        <div>
          <h3 class="font-medium mb-2">Multiple Choice Answers:</h3>
          <pre class="bg-white p-3 rounded text-sm">{{ multipleChoiceAnswers }}</pre>
        </div>
        <div>
          <h3 class="font-medium mb-2">Multi-Select Answers:</h3>
          <pre class="bg-white p-3 rounded text-sm">{{ multiSelectAnswers }}</pre>
        </div>
        <div>
          <h3 class="font-medium mb-2">Selection Answers:</h3>
          <pre class="bg-white p-3 rounded text-sm">{{ selectionAnswers }}</pre>
        </div>
        <div>
          <h3 class="font-medium mb-2">Draggable Answers:</h3>
          <pre class="bg-white p-3 rounded text-sm">{{ draggableAnswers }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  CompletionQuestion, 
  MultipleChoiceQuestion, 
  MultiSelectQuestion, 
  SelectionQuestion, 
  DraggableSelectionQuestion,
  AudioPlayer
} from '~/components/question-types'

// Completion Question Data
const completionQuestion = {
  id: 'completion-1',
  type: 'completion',
  title: 'Example Completion Question',
  condition: '<p>Complete the notes below. Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p>',
  content: '<p>Example: The @@ is a @@ animal that lives in @@.</p>'
}

const completionAnswers = ref(['', '', ''])

// Multiple Choice Question Data
const multipleChoiceQuestion = {
  id: 'mc-1',
  type: 'multiple-choice',
  title: 'Example Multiple Choice',
  condition: '<p>Choose the correct letter, <strong>A, B, C,</strong> or <strong>D.</strong></p>',
  questions: [
    {
      id: 'q1',
      question: 'What is the capital of France?',
      options: [
        { id: 'a', value: 'A', label: 'London' },
        { id: 'b', value: 'B', label: 'Berlin' },
        { id: 'c', value: 'C', label: 'Paris' },
        { id: 'd', value: 'D', label: 'Madrid' }
      ]
    }
  ]
}

const multipleChoiceAnswers = ref([''])

// Multi-Select Question Data
const multiSelectQuestion = {
  id: 'ms-1',
  type: 'multi-select',
  title: 'Example Multi-Select',
  condition: 'Choose TWO letters, A–E.',
  options: [
    { id: 'a', value: 'A', label: 'Red' },
    { id: 'b', value: 'B', label: 'Blue' },
    { id: 'c', value: 'C', label: 'Green' },
    { id: 'd', value: 'D', label: 'Yellow' },
    { id: 'e', value: 'E', label: 'Purple' }
  ],
  limit: 2
}

const multiSelectAnswers = ref([])

// Selection Question Data
const selectionQuestion = {
  id: 'sel-1',
  type: 'selection',
  title: 'Example Selection',
  condition: '<p>Do the following statements agree with the information given? Write:<br><strong>YES</strong> if the statement agrees<br><strong>NO</strong> if it contradicts<br><strong>NOT GIVEN</strong> if not mentioned</p>',
  content: '<p>1. The sky is blue. @@<br>2. Elephants can fly. @@</p>',
  options: [
    { id: 'yes', value: 'YES', label: 'if the statement agrees with the information' },
    { id: 'no', value: 'NO', label: 'if the statement contradicts the information' },
    { id: 'ng', value: 'NOT GIVEN', label: 'if there is no information on this' }
  ]
}

const selectionAnswers = ref(['', ''])

// Draggable Selection Question Data
const draggableQuestion = {
  id: 'drag-1',
  type: 'draggable-selection',
  title: 'Example Drag and Drop',
  condition: 'Complete the sentences by dragging the correct words.',
  content: '<p>1. The cat is @@.<br>2. The dog is @@.</p>',
  options: [
    { id: 'big', value: 'big' },
    { id: 'small', value: 'small' },
    { id: 'happy', value: 'happy' },
    { id: 'sad', value: 'sad' }
  ],
  optionsTitle: 'Words'
}

const draggableAnswers = ref(['', ''])

// Audio Data
const audioData = {
  id: 1,
  url: 'https://example.com/sample-audio.mp3',
  fileName: 'Sample Audio File'
}
</script>