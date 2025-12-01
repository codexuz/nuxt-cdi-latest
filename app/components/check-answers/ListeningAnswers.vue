<template>
  <div class="space-y-6">
    <!-- Score Summary -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center justify-between">
          <span>Listening Score</span>
          <Badge class="text-lg px-4 py-1">
            Band {{ listeningFinal?.score || 0 }}/9
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ listeningFinal?.correct || 0 }}
            </p>
            <p class="text-sm text-muted-foreground">Correct</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">
              {{ listeningFinal?.incorrect || 0 }}
            </p>
            <p class="text-sm text-muted-foreground">Incorrect</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold">
              {{ listeningFinal?.totalQuestions || 0 }}
            </p>
            <p class="text-sm text-muted-foreground">Total</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Parts -->
    <div
      v-for="part in answersComparison?.parts"
      :key="part.partId"
      class="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>{{ part.part }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
              v-for="question in part.questions"
              :key="question.questionNumber"
              class="flex items-center justify-between p-3 rounded-lg"
              :class="
                question.isCorrect
                  ? 'bg-green-50 dark:bg-green-950/30'
                  : 'bg-red-50 dark:bg-red-950/30'
              "
            >
              <div class="flex items-center gap-4">
                <span class="font-medium">Q{{ question.questionNumber }}</span>
                <div>
                  <p class="text-sm">
                    <span class="text-muted-foreground">Student:</span>
                    <span class="font-medium ml-2">{{
                      question.studentAnswer
                    }}</span>
                  </p>
                  <p class="text-sm">
                    <span class="text-muted-foreground">Correct:</span>
                    <span class="font-medium ml-2">{{
                      question.correctAnswer
                    }}</span>
                  </p>
                </div>
              </div>
              <Badge :variant="question.isCorrect ? 'default' : 'destructive'">
                {{ question.isCorrect ? "Correct" : "Incorrect" }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const props = defineProps({
  answersComparison: Object,
  listeningFinal: Object,
});
</script>
