<template>
  <div class="space-y-6">
    <!-- Task 1 -->
    <Card>
      <CardHeader>
        <CardTitle>Task 1</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          <Label class="text-sm font-medium">Student's Answer</Label>
          <div class="mt-2 p-4 bg-muted rounded-lg">
            <p class="whitespace-pre-wrap">
              {{
                writingResults?.answers?.[0]?.task_1_answer ||
                "No answer provided"
              }}
            </p>
          </div>
          <p class="text-sm text-muted-foreground mt-2">
            Word Count: {{ writingResults?.answers?.[0]?.word_count || 0 }}
          </p>
        </div>

        <div>
          <Label for="task1-score">Task 1 Score (0-9)</Label>
          <Input
            id="task1-score"
            v-model.number="scores.task1Score"
            type="number"
            min="0"
            max="9"
            step="0.5"
            class="w-32"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Task 2 -->
    <Card>
      <CardHeader>
        <CardTitle>Task 2</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          <Label class="text-sm font-medium">Student's Answer</Label>
          <div class="mt-2 p-4 bg-muted rounded-lg max-h-96 overflow-y-auto">
            <p class="whitespace-pre-wrap">
              {{
                writingResults?.answers?.[1]?.task_2_answer ||
                "No answer provided"
              }}
            </p>
          </div>
          <p class="text-sm text-muted-foreground mt-2">
            Word Count: {{ writingResults?.answers?.[1]?.word_count || 0 }}
          </p>
        </div>

        <div>
          <Label for="task2-score">Task 2 Score (0-9)</Label>
          <Input
            id="task2-score"
            v-model.number="scores.task2Score"
            type="number"
            min="0"
            max="9"
            step="0.5"
            class="w-32"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Feedback -->
    <Card>
      <CardHeader>
        <CardTitle>Overall Feedback</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          <Label for="feedback">Detailed Feedback</Label>
          <Textarea
            id="feedback"
            v-model="scores.feedback"
            rows="6"
            placeholder="Provide detailed feedback for both tasks..."
          />
        </div>

        <div class="flex justify-end">
          <Button @click="saveScores" :disabled="isSaving" size="lg">
            <Save class="h-4 w-4 mr-2" />
            {{ isSaving ? "Saving..." : "Save Writing Scores" }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Save } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const props = defineProps({
  candidateId: String,
  writingResults: Object,
  centerId: String,
  writingFinal: {
    type: Object,
    default: () => ({}),
  },
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const isSaving = ref(false);

const scores = ref({
  task1Score: props.writingFinal?.task1Score || 0,
  task2Score: props.writingFinal?.task2Score || 0,
  feedback: props.writingFinal?.feedback || "",
});

const saveScores = async () => {
  try {
    isSaving.value = true;

    await $fetch(
      `${config.public.baseURL}/student-tests/centers/${props.centerId}/check-writing/${props.candidateId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: scores.value,
      }
    );

    toast.success("Writing scores saved successfully");
  } catch (error) {
    console.error("Failed to save writing scores:", error);
    toast.error("Failed to save writing scores");
  } finally {
    isSaving.value = false;
  }
};
</script>
