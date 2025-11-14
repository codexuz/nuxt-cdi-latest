<template>
  <div class="space-y-4">
    <!-- Filters and Search -->
    <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div class="relative w-full sm:w-80">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search..."
          class="pl-10 bg-white dark:bg-gray-950"
          v-model="searchQuery"
        />
      </div>
      
      <div class="flex gap-4 w-full sm:w-auto">
        <Select v-model="selectedGroup">
          <SelectTrigger class="w-full sm:w-48 bg-white dark:bg-gray-950">
            <SelectValue placeholder="Select groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            <SelectItem value="demo">Demo</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        
        <Button @click="navigateTo('/dashboard/students/add')" class="whitespace-nowrap">
          <Plus class="h-4 w-4 mr-2" />
          Add student
        </Button>
      </div>
    </div>

    <!-- Students Table -->
    <div class="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800">
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">№</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Contact</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Age</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Group</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Notes</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(student, index) in filteredStudents" 
              :key="student.id"
              class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <td class="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                {{ index + 1 }}
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center space-x-3">
                  <Avatar class="h-9 w-9">
                    <AvatarImage :src="student.avatar" :alt="student.name" />
                    <AvatarFallback class="bg-primary text-primary-foreground text-sm font-semibold">
                      {{ student.initials }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white hover:underline cursor-pointer">
                      {{ student.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      ID: {{ student.studentId }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                {{ student.contact }}
              </td>
              <td class="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                {{ student.age }}
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <Folder class="h-4 w-4 text-gray-400" />
                  <span>{{ student.group }}</span>
                </div>
              </td>
              <td class="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                {{ student.notes || '-' }}
              </td>
              <td class="py-4 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="viewStudent(student)">
                      <Eye class="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="editStudent(student)">
                      <Edit class="mr-2 h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="viewProgress(student)">
                      <BarChart3 class="mr-2 h-4 w-4" />
                      View Progress
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="deleteStudent(student)" class="text-red-600">
                      <Trash2 class="mr-2 h-4 w-4" />
                      Remove Student
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Showing {{ filteredStudents.length > 0 ? '1' : '0' }}–{{ filteredStudents.length }} of {{ filteredStudents.length }}
        </div>
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft class="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button variant="outline" size="sm" class="bg-primary text-primary-foreground hover:bg-primary/90">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
            <ChevronRight class="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  BarChart3,
  Trash2,
  Folder,
  ChevronLeft,
  ChevronRight
} from "lucide-vue-next";

useHead({
  title: "Students - Testify",
});

const searchQuery = ref('');
const selectedGroup = ref('all');

// Mock data - replace with actual API call
const students = ref([
  {
    id: 1,
    name: 'Kumush Rasulova',
    initials: 'KU',
    studentId: '9075',
    contact: '+998 88 068-17-38',
    age: '16 y.o. (2009-04-15)',
    group: 'Demo',
    notes: '',
    avatar: null,
  },
  {
    id: 2,
    name: 'Alice Johnson',
    initials: 'AJ',
    studentId: '8234',
    contact: '+998 91 234-56-78',
    age: '18 y.o. (2007-08-22)',
    group: 'Advanced',
    notes: 'Top performer',
    avatar: null,
  },
  {
    id: 3,
    name: 'Bob Smith',
    initials: 'BS',
    studentId: '7456',
    contact: '+998 93 456-78-90',
    age: '17 y.o. (2008-03-10)',
    group: 'Intermediate',
    notes: '',
    avatar: null,
  },
  {
    id: 4,
    name: 'Carol Brown',
    initials: 'CB',
    studentId: '6789',
    contact: '+998 97 789-01-23',
    age: '19 y.o. (2006-11-30)',
    group: 'Beginner',
    notes: 'Needs extra support',
    avatar: null,
  },
  {
    id: 5,
    name: 'David Wilson',
    initials: 'DW',
    studentId: '5678',
    contact: '+998 99 567-89-01',
    age: '16 y.o. (2009-05-18)',
    group: 'Advanced',
    notes: '',
    avatar: null,
  },
]);

const filteredStudents = computed(() => {
  let filtered = students.value;
  
  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(student => 
      student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.studentId.includes(searchQuery.value) ||
      student.contact.includes(searchQuery.value)
    );
  }
  
  // Filter by group
  if (selectedGroup.value !== 'all') {
    filtered = filtered.filter(student => 
      student.group.toLowerCase() === selectedGroup.value.toLowerCase()
    );
  }
  
  return filtered;
});

const viewStudent = (student) => {
  console.log('View student:', student);
  // TODO: Navigate to student profile
};

const editStudent = (student) => {
  console.log('Edit student:', student);
  // TODO: Navigate to edit page
};

const viewProgress = (student) => {
  console.log('View progress:', student);
  // TODO: Navigate to progress page
};

const deleteStudent = (student) => {
  console.log('Delete student:', student);
  // TODO: Show confirmation dialog and delete
};

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>