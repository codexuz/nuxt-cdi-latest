<template>
  <Card>
    <CardHeader class="border-b">
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="flex items-center gap-2">
            <BookMarked class="h-5 w-5" />
            Vocabulary
          </CardTitle>
          <CardDescription
            >Manage vocabulary items for this lesson</CardDescription
          >
        </div>
        <Button @click="openAddDialog" size="sm">
          <Plus class="h-4 w-4 mr-2" />
          Add Word
        </Button>
      </div>
    </CardHeader>
    <CardContent class="p-6">
      <!-- Empty State -->
      <div v-if="items.length === 0" class="text-center py-8">
        <BookMarked class="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 class="font-semibold mb-1">No vocabulary yet</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Add vocabulary items to help students learn
        </p>
        <Button @click="openAddDialog" size="sm">
          <Plus class="h-4 w-4 mr-2" />
          Add First Word
        </Button>
      </div>

      <!-- Vocabulary List -->
      <div v-else class="space-y-3">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h4 class="font-semibold text-lg">{{ item.word }}</h4>
              <Badge variant="outline" class="text-xs">{{
                item.part_of_speech
              }}</Badge>
            </div>
            <p class="text-sm text-muted-foreground mb-2">
              {{ item.definition }}
            </p>
            <div
              v-if="item.example"
              class="text-sm italic text-muted-foreground pl-3 border-l-2"
            >
              "{{ item.example }}"
            </div>
            <div v-if="item.translation" class="text-sm text-blue-600 mt-1">
              {{ item.translation }}
            </div>
          </div>
          <div
            class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8"
              @click="editItem(item)"
            >
              <Pencil class="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8"
              @click="confirmDelete(item)"
            >
              <Trash2 class="h-3 w-3 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Add/Edit Dialog -->
  <Dialog v-model:open="dialogOpen">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{{
          editingItem ? "Edit Vocabulary" : "Add Vocabulary"
        }}</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <div class="space-y-2">
          <Label>Word *</Label>
          <Input v-model="form.word" placeholder="Enter word" />
        </div>
        <div class="space-y-2">
          <Label>Part of Speech</Label>
          <Select v-model="form.part_of_speech">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="noun">Noun</SelectItem>
              <SelectItem value="verb">Verb</SelectItem>
              <SelectItem value="adjective">Adjective</SelectItem>
              <SelectItem value="adverb">Adverb</SelectItem>
              <SelectItem value="pronoun">Pronoun</SelectItem>
              <SelectItem value="preposition">Preposition</SelectItem>
              <SelectItem value="conjunction">Conjunction</SelectItem>
              <SelectItem value="interjection">Interjection</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="space-y-2">
          <Label>Definition *</Label>
          <Textarea
            v-model="form.definition"
            rows="2"
            placeholder="Enter definition"
          />
        </div>
        <div class="space-y-2">
          <Label>Example Sentence</Label>
          <Textarea
            v-model="form.example"
            rows="2"
            placeholder="Enter example sentence"
          />
        </div>
        <div class="space-y-2">
          <Label>Translation (Optional)</Label>
          <Input v-model="form.translation" placeholder="Enter translation" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="dialogOpen = false">Cancel</Button>
        <Button @click="saveItem">{{ editingItem ? "Update" : "Add" }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Delete Dialog -->
  <AlertDialog v-model:open="deleteDialogOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Vocabulary</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete "{{ itemToDelete?.word }}"?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          @click="deleteItem"
          class="bg-destructive hover:bg-destructive/90"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { BookMarked, Plus, Pencil, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  lessonId: string;
}

const props = defineProps<Props>();

const config = useRuntimeConfig();
const API_BASE_URL = config.public.baseURL as string;
const authStore = useAuthStore();

const items = ref<any[]>([]);
const dialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const editingItem = ref<any>(null);
const itemToDelete = ref<any>(null);

const form = ref({
  word: "",
  part_of_speech: "noun",
  definition: "",
  example: "",
  translation: "",
});

const getAuthHeaders = () => ({
  Authorization: `Bearer ${authStore.token}`,
  "Content-Type": "application/json",
});

const fetchItems = async () => {
  try {
    const response = await $fetch(
      `${API_BASE_URL}/lms/lessons/${props.lessonId}/vocabulary`,
      {
        headers: getAuthHeaders(),
      }
    );
    items.value = response;
  } catch (error) {
    console.error("Failed to fetch vocabulary:", error);
  }
};

const openAddDialog = () => {
  editingItem.value = null;
  form.value = {
    word: "",
    part_of_speech: "noun",
    definition: "",
    example: "",
    translation: "",
  };
  dialogOpen.value = true;
};

const editItem = (item: any) => {
  editingItem.value = item;
  form.value = { ...item };
  dialogOpen.value = true;
};

const saveItem = async () => {
  if (!form.value.word || !form.value.definition) {
    toast.error("Please fill in required fields");
    return;
  }

  try {
    const payload = { ...form.value };

    if (editingItem.value) {
      await $fetch(`${API_BASE_URL}/lms/vocabulary/${editingItem.value.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: payload,
      });
      toast.success("Vocabulary updated");
    } else {
      await $fetch(`${API_BASE_URL}/lms/lessons/${props.lessonId}/vocabulary`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: payload,
      });
      toast.success("Vocabulary added");
    }

    dialogOpen.value = false;
    await fetchItems();
  } catch (error) {
    toast.error("Failed to save vocabulary");
  }
};

const confirmDelete = (item: any) => {
  itemToDelete.value = item;
  deleteDialogOpen.value = true;
};

const deleteItem = async () => {
  try {
    await $fetch(`${API_BASE_URL}/lms/vocabulary/${itemToDelete.value.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    toast.success("Vocabulary deleted");
    deleteDialogOpen.value = false;
    await fetchItems();
  } catch (error) {
    toast.error("Failed to delete vocabulary");
  }
};

onMounted(() => {
  fetchItems();
});
</script>
