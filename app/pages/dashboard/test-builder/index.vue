<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <Toaster position="top-center" richColors theme="system" />

    <div class="mb-6">
      <h1
        class="scroll-m-20 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl"
      >
        Create IELTS Test
      </h1>
      <p class="text-muted-foreground mt-2">
        Build a comprehensive IELTS test by combining listening and reading
        sections
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FileText class="h-5 w-5" />
          Test Details
        </CardTitle>
        <CardDescription>
          Provide basic information about your IELTS test
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <!-- Test Title -->
        <div class="space-y-2">
          <Label for="title" class="flex items-center gap-2">
            Test Title
            <span class="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            v-model="formData.title"
            placeholder="IELTS Academic Test - Practice Set 1"
            required
          />
          <p class="text-xs text-muted-foreground">
            Enter a descriptive title for this test
          </p>
        </div>

        <!-- Test Description -->
        <div class="space-y-2">
          <Label for="description" class="flex items-center gap-2">
            Description
            <span class="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            v-model="formData.description"
            placeholder="This is a comprehensive IELTS Academic test designed for intermediate to advanced students..."
            rows="4"
            required
          />
          <p class="text-xs text-muted-foreground">
            Provide a detailed description of the test content and target
            audience
          </p>
        </div>

        <!-- For CDI Toggle -->
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div class="space-y-0.5">
            <Label class="text-base font-medium">CDI Test</Label>
            <p class="text-sm text-muted-foreground">
              Mark this test as an official CDI assessment
            </p>
          </div>
          <Switch
            :checked="formData.for_cdi"
            @update:checked="formData.for_cdi = $event"
          />
        </div>

        <!-- Info Alert -->
        <Alert>
          <Info class="h-4 w-4" />
          <AlertTitle>Next Steps</AlertTitle>
          <AlertDescription>
            After creating the test, you can add listening and reading sections
            separately from the test management page.
          </AlertDescription>
        </Alert>
      </CardContent>

      <CardFooter class="flex gap-3">
        <Button
          variant="outline"
          @click="navigateTo('/test-builder')"
          class="flex-1"
        >
          Cancel
        </Button>
        <Button
          @click="createTest"
          :disabled="!isFormValid || isCreating"
          class="flex-1"
        >
          <span v-if="isCreating">Creating Test...</span>
          <span v-else>Create Test</span>
        </Button>
      </CardFooter>
    </Card>

  </div>
</template>

<script setup>
import { FileText, Info, CheckCircle } from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "Create IELTS Test - Testify",
});

const isCreating = ref(false);

const formData = ref({
  title: "",
  description: "",
  for_cdi: false,
});

const isFormValid = computed(() => {
  return formData.value.title && formData.value.description;
});

const createTest = async () => {
  try {
    isCreating.value = true;

    const token = useCookie("access_token");

    const payload = {
      title: formData.value.title,
      description: formData.value.description,
      for_cdi: formData.value.for_cdi,
    };

    const response = await $fetch("https://edumoacademy.uz/ielts/tests", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    console.log("Test created:", response);
    toast.success("IELTS test created successfully!");

    // Redirect to test list or test detail page
    await navigateTo("/test-builder");
  } catch (error) {
    console.error("Failed to create test:", error);

    if (error.statusCode === 400) {
      toast.error("Invalid data provided. Please check all fields.");
    } else if (error.statusCode === 404) {
      toast.error("Selected section not found. Please refresh and try again.");
    } else {
      toast.error("Failed to create test. Please try again.");
    }
  } finally {
    isCreating.value = false;
  }
};

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>
