<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Page Header -->
    <section class="px-6 py-8">
      <div class="container mx-auto max-w-6xl">
         <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink>
                        <NuxtLink to="/">
                            Home
                        </NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>My Tests</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-4">
          <div>
            <h1 class="scroll-m-20 text-xl sm:text-2xl font-bold tracking-tight md:text-3xl mb-2">My Tests</h1>
          </div>
        </div>
      </div>
    </section>

    <!-- Tests List Section -->
    <section class="px-6 pb-8">
      <div class="container mx-auto max-w-6xl">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Test Item -->
          <Card 
            v-for="test in tests" 
            :key="test.id" 
            class="p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col"
          >
           
            <!-- Test Info -->
            <div class="flex flex-col items-center justify-center gap-y-3">
            
           <!-- Test Type Icon -->
            <div class="flex items-start gap-x-4 justify-start mb-4">
              <div class="w-6 h-6 rounded-lg flex items-start justify-start" :class="getTestTypeStyle(test.type)">
                <component :is="getTestIcon(test.type)" class="h-8 w-8" />
              </div>
                  <!-- Large Title -->
              <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {{ test.title }}
              </h2>
            </div>

          
              
              
              <!-- See Details Button -->
              <Button 
                class="bg-blue-600 row-span-1 self-end cursor-pointer hover:bg-blue-700 text-white w-full"
              >
                <Eye class="mr-2 h-4 w-4" />
                See Details
              </Button>
            </div>

          </Card>

          <!-- Empty State -->
          <div v-if="tests.length === 0" class="text-center py-12">
            <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText class="h-12 w-12 text-gray-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tests found</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Start your IELTS preparation journey by taking your first practice test.</p>
            <Button class="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus class="mr-2 h-4 w-4" />
              Take Your First Test
            </Button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
          <div class="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <ChevronLeft class="h-4 w-4" />
            </Button>
            
            <span class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            
            <Button 
              variant="outline" 
              size="sm" 
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Plus,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  FileText
} from 'lucide-vue-next'

// Use global authentication state
const { isAuthenticated, user } = useAuth()

// Page meta
useHead({
  title: 'My Tests - Impulse CD IELTS',
  meta: [
    {
      name: 'description',
      content: 'Track your IELTS test history, review scores, and monitor your preparation progress with detailed analytics.'
    }
  ]
})

// Page middleware
definePageMeta({
  middleware: 'auth'
})

// Reactive data
const currentPage = ref(1)
const itemsPerPage = 10

// Mock test data
const tests = ref([
  {
    id: 1,
    title: 'Full Test',
    type: 'full-test',
    status: 'completed',
    score: 7.5,
    duration: 180,
    date: new Date('2024-01-15'),
    attempts: 2,
    progress: 100
  },
  {
    id: 2,
    title: 'Listening',
    type: 'listening',
    status: 'completed',
    score: 8.0,
    duration: 30,
    date: new Date('2024-01-20'),
    attempts: 1,
    progress: 100
  },
  {
    id: 3,
    title: 'Reading',
    type: 'reading',
    status: 'in-progress',
    score: null,
    duration: 60,
    date: new Date('2024-01-22'),
    attempts: 0,
    progress: 65
  },
  {
    id: 4,
    title: 'Writing Task 1',
    type: 'writing',
    status: 'completed',
    score: 6.5,
    duration: 60,
    date: new Date('2024-01-18'),
    attempts: 3,
    progress: 100
  },
  {
    id: 5,
    title: 'Speaking',
    type: 'speaking',
    status: 'not-started',
    score: null,
    duration: 15,
    date: new Date('2024-01-25'),
    attempts: 0,
    progress: 0
  },
  {
    id: 6,
    title: 'IELTS Full Test',
    type: 'full-test',
    status: 'completed',
    score: 6.0,
    duration: 180,
    date: new Date('2024-01-10'),
    attempts: 1,
    progress: 100
  },
  {
    id: 7,
    title: 'Reading',
    type: 'reading',
    status: 'completed',
    score: 7.0,
    duration: 60,
    date: new Date('2024-01-12'),
    attempts: 2,
    progress: 100
  },
  {
    id: 8,
    title: 'Listening ',
    type: 'listening',
    status: 'not-started',
    score: null,
    duration: 30,
    date: new Date('2024-01-28'),
    attempts: 0,
    progress: 0
  }
])

// Computed properties
const totalPages = computed(() => {
  return Math.ceil(tests.value.length / itemsPerPage)
})

// Helper methods
const getTestIcon = (type) => {
  const icons = {
    'listening': Headphones,
    'reading': BookOpen,
    'writing': PenTool,
    'speaking': Mic,
    'full-test': FileText
  }
  return icons[type] || FileText
}

const getTestTypeStyle = (type) => {
  const styles = {
    'listening': 'text-blue-600 dark:text-blue-400',
    'reading': 'text-green-600 dark:text-green-400',
    'writing': 'text-purple-600 dark:text-purple-400',
    'speaking': 'text-orange-600 dark:text-orange-400',
    'full-test': 'text-gray-600 dark:text-gray-400'
  }
  return styles[type] || styles['full-test']
}

const getStatusVariant = (status) => {
  const variants = {
    'completed': 'default',
    'in-progress': 'secondary',
    'not-started': 'outline'
  }
  return variants[status] || 'outline'
}

const getScoreColor = (score) => {
  if (score >= 7.5) return 'text-green-600 dark:text-green-400'
  if (score >= 6.5) return 'text-blue-600 dark:text-blue-400'
  if (score >= 5.5) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

// New formatting methods
const formatDateDDMMYY = (date) => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  return `${day}-${month}-${year}`
}

const formatStatus = (status) => {
  const statusMap = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'not-started': 'Not Started'
  }
  return statusMap[status] || status
}
</script>