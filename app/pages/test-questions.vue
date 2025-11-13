<template>
  <div class="test-questions-page">
    <!-- Header -->
    <div class="header bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">IELTS Question Components Test</h1>
            <p class="text-gray-600 mt-1">Testing all question types with real IELTS data</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="showAnswers = !showAnswers"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              {{ showAnswers ? 'Hide' : 'Show' }} Answers
            </button>
            <button
              @click="showGlobalSummary = !showGlobalSummary"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              {{ showGlobalSummary ? 'Hide' : 'Show' }} Summary
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <p class="text-gray-600">Loading test data...</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <h3 class="text-red-800 font-semibold">Error Loading Test Data</h3>
            <p class="text-red-600 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Test Navigation -->
      <div class="test-navigation mb-8">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="section in sections"
              :key="section.id"
              @click="activeSection = section.id"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeSection === section.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ section.title }}
              <span class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                {{ section.parts?.length || 0 }} parts
              </span>
            </button>
          </nav>
        </div>
      </div>
      
      <!-- Active Section Content -->
      <div v-if="currentSection" class="section-content">
        <div class="section-header mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{{ currentSection.title }}</h2>
          <p v-if="currentSection.description" class="text-gray-600 mt-2">
            {{ currentSection.description }}
          </p>
        </div>
        
        <!-- Parts -->
        <div class="parts-container space-y-12">
          <div
            v-for="(part, partIndex) in currentSection.parts"
            :key="part.id"
            class="part-section"
          >
            <!-- Part Header -->
            <div class="part-header mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 class="text-xl font-semibold text-gray-900">
                {{ part.part.replace('_', ' ') }}
              </h3>
              <p class="text-gray-600 mt-1">
                {{ part.question.numberOfQuestions }} questions
              </p>
            </div>
            
            <!-- Question Renderer -->
            <QuestionRenderer
              :question-content="part.question.content"
              :audio="part.audio"
              :passage="part.passage"
              :part="part.part"
              v-model="answers[`${activeSection}_${part.id}`]"
              :show-answers="showAnswers"
              :show-global-summary="false"
            />
          </div>
        </div>
      </div>
      
      <!-- Global Answer Summary -->
      <div v-if="showGlobalSummary" class="global-summary mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 class="text-2xl font-bold mb-6">Complete Test Summary</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            v-for="section in sections"
            :key="section.id"
            class="section-summary bg-white rounded-lg p-4 border"
          >
            <h3 class="text-lg font-semibold mb-3">{{ section.title }}</h3>
            <div class="space-y-3">
              <div
                v-for="(part, partIndex) in section.parts"
                :key="part.id"
                class="part-summary p-3 bg-gray-50 rounded"
              >
                <h4 class="font-medium mb-2">{{ part.part.replace('_', ' ') }}</h4>
                <div class="text-sm text-gray-600">
                  Answers: {{ getAnswerCount(`${section.id}_${part.id}`) }} / {{ part.question.numberOfQuestions }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QuestionRenderer from '~/components/question-types/QuestionRenderer.vue';

// Define interfaces
interface TestData {
  id: number;
  title: string;
  description: string;
  listening?: {
    id: number;
    title: string;
    description: string;
    parts: any[];
  };
  reading?: {
    id: number;
    parts: any[];
  };
}

// Reactive state
const loading = ref(true);
const error = ref<string | null>(null);
const testData = ref<TestData | null>(null);
const activeSection = ref('listening');
const showAnswers = ref(false);
const showGlobalSummary = ref(false);
const answers = ref<Record<string, any[]>>({});

// Computed properties
const sections = computed(() => {
  if (!testData.value) return [];
  
  const sectionList = [];
  
  if (testData.value.listening) {
    sectionList.push({
      id: 'listening',
      title: 'Listening Test',
      description: testData.value.listening.description,
      parts: testData.value.listening.parts
    });
  }
  
  if (testData.value.reading) {
    sectionList.push({
      id: 'reading',
      title: 'Reading Test',
      description: 'IELTS Reading Test',
      parts: testData.value.reading.parts
    });
  }
  
  return sectionList;
});

const currentSection = computed(() => {
  return sections.value.find(section => section.id === activeSection.value);
});

// Methods
const loadTestData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // In a real app, this would be an API call
    // For now, we'll import the JSON data
    const { default: data } = await import('~/testDataIELTSZONE.json');
    testData.value = data as TestData;
    
    // Initialize answers object
    initializeAnswers();
    
  } catch (err) {
    console.error('Error loading test data:', err);
    error.value = 'Failed to load test data. Please check the console for details.';
  } finally {
    loading.value = false;
  }
};

const initializeAnswers = () => {
  if (!testData.value) return;
  
  const newAnswers: Record<string, any[]> = {};
  
  // Initialize listening answers
  if (testData.value.listening) {
    testData.value.listening.parts.forEach(part => {
      const key = `listening_${part.id}`;
      newAnswers[key] = new Array(part.question.content.length).fill([]);
    });
  }
  
  // Initialize reading answers
  if (testData.value.reading) {
    testData.value.reading.parts.forEach(part => {
      const key = `reading_${part.id}`;
      newAnswers[key] = new Array(part.question.content.length).fill([]);
    });
  }
  
  answers.value = newAnswers;
};

const getAnswerCount = (key: string): number => {
  const sectionAnswers = answers.value[key];
  if (!sectionAnswers) return 0;
  
  return sectionAnswers.reduce((count, answerSet) => {
    if (Array.isArray(answerSet)) {
      return count + answerSet.filter(answer => answer && answer.trim()).length;
    } else {
      return count + (answerSet && String(answerSet).trim() ? 1 : 0);
    }
  }, 0);
};

// Page meta
useHead({
  title: 'IELTS Question Components Test',
  meta: [
    {
      name: 'description',
      content: 'Testing all IELTS question type components with real test data'
    }
  ]
});

// Load data on mount
onMounted(() => {
  loadTestData();
});
</script>

<style scoped>
.test-questions-page {
  min-height: 100vh;
  background-color: #f9fafb;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
}

.part-section {
  border-radius: 12px;
  background: white;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-summary {
  transition: transform 0.2s ease;
}

.section-summary:hover {
  transform: translateY(-2px);
}

/* Custom scrollbar for better UX */
:deep(.prose) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

:deep(.prose)::-webkit-scrollbar {
  width: 6px;
}

:deep(.prose)::-webkit-scrollbar-track {
  background: #f1f5f9;
}

:deep(.prose)::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
</style>