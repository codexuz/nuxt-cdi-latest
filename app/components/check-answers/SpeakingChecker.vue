<template>
  <div class="space-y-6">
    <!-- Speaking Evaluation Form -->
    <div class="space-y-6">
      <!-- Score Card -->
      <Card>
        <CardHeader>
          <CardTitle>Speaking Evaluation</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Band Scores -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="fluency">Fluency & Coherence (0-9)</Label>
              <Input
                id="fluency"
                v-model.number="scores.fluencyCoherence"
                type="number"
                min="0"
                max="9"
                step="0.5"
              />
            </div>
            <div>
              <Label for="lexical">Lexical Resource (0-9)</Label>
              <Input
                id="lexical"
                v-model.number="scores.lexicalResource"
                type="number"
                min="0"
                max="9"
                step="0.5"
              />
            </div>
            <div>
              <Label for="grammatical"
                >Grammatical Range & Accuracy (0-9)</Label
              >
              <Input
                id="grammatical"
                v-model.number="scores.grammaticalRange"
                type="number"
                min="0"
                max="9"
                step="0.5"
              />
            </div>
            <div>
              <Label for="pronunciation">Pronunciation (0-9)</Label>
              <Input
                id="pronunciation"
                v-model.number="scores.pronunciation"
                type="number"
                min="0"
                max="9"
                step="0.5"
              />
            </div>
          </div>

          <!-- Feedback -->
          <div>
            <Label for="feedback">Detailed Feedback</Label>
            <Textarea
              id="feedback"
              v-model="scores.feedback"
              rows="6"
              placeholder="Provide detailed feedback on the student's speaking performance..."
            />
          </div>

          <!-- Overall Score (Calculated) -->
          <div class="bg-muted p-4 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">
                  Overall Speaking Band Score
                </p>
                <p class="text-3xl font-bold">{{ overallScore }}</p>
              </div>
              <Badge class="text-lg px-4 py-2">
                Band {{ overallScore }}/9
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Speaking Rubric Reference -->
      <Card>
        <CardHeader>
          <CardTitle>IELTS Speaking Band Descriptors</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4 text-sm">
            <div>
              <h4 class="font-semibold">Fluency & Coherence</h4>
              <p class="text-muted-foreground">
                Ability to speak at length without noticeable effort, coherent
                and logical flow of ideas.
              </p>
            </div>
            <div>
              <h4 class="font-semibold">Lexical Resource</h4>
              <p class="text-muted-foreground">
                Range of vocabulary used, accuracy in word choice, and ability
                to paraphrase.
              </p>
            </div>
            <div>
              <h4 class="font-semibold">Grammatical Range & Accuracy</h4>
              <p class="text-muted-foreground">
                Variety of grammatical structures used and accuracy of grammar.
              </p>
            </div>
            <div>
              <h4 class="font-semibold">Pronunciation</h4>
              <p class="text-muted-foreground">
                Clarity of speech, appropriate intonation, stress, and rhythm.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Save Button -->
      <div class="flex justify-end">
        <Button @click="saveScores" :disabled="isSaving" size="lg">
          <Save class="h-4 w-4 mr-2" />
          {{ isSaving ? "Saving..." : "Save Speaking Scores" }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Save } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const props = defineProps({
  candidateId: String,
  centerId: String,
  speakingFinal: {
    type: Object,
    default: () => ({}),
  },
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const isSaving = ref(false);

const scores = ref({
  fluencyCoherence: props.speakingFinal?.fluencyCoherence || 0,
  lexicalResource: props.speakingFinal?.lexicalResource || 0,
  grammaticalRange: props.speakingFinal?.grammaticalRange || 0,
  pronunciation: props.speakingFinal?.pronunciation || 0,
  feedback: props.speakingFinal?.feedback || "",
});

// Calculate overall score (average of all band scores)
const overallScore = computed(() => {
  const avg =
    (scores.value.fluencyCoherence +
      scores.value.lexicalResource +
      scores.value.grammaticalRange +
      scores.value.pronunciation) /
    4;
  return Math.round(avg * 2) / 2; // Round to nearest 0.5
});

// Save scores
const saveScores = async () => {
  try {
    isSaving.value = true;

    const payload = {
      overall: overallScore.value,
      fluencyCoherence: scores.value.fluencyCoherence,
      lexicalResource: scores.value.lexicalResource,
      grammaticalRange: scores.value.grammaticalRange,
      pronunciation: scores.value.pronunciation,
      feedback: scores.value.feedback,
    };

    await $fetch(
      `${config.public.baseURL}/student-tests/centers/${props.centerId}/check-speaking/${props.candidateId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );

    toast.success("Speaking scores saved successfully");
  } catch (error) {
    console.error("Failed to save speaking scores:", error);
    toast.error("Failed to save speaking scores");
  } finally {
    isSaving.value = false;
  }
};
</script>
