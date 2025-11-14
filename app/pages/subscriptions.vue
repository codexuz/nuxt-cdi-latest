<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <Toaster position="top-center" richColors theme="system" />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          Choose Your Plan
        </h1>
        <p class="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Select the perfect plan for your learning center
        </p>
      </div>

      <!-- Pricing Toggle -->
      <div class="mt-12 flex justify-center">
        <div class="relative bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="flex">
            <button
              @click="billingPeriod = 'monthly'"
              :class="[
                billingPeriod === 'monthly'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
                'relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200'
              ]"
            >
              Monthly
            </button>
            <button
              @click="billingPeriod = 'yearly'"
              :class="[
                billingPeriod === 'yearly'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
                'relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200'
              ]"
            >
              Yearly
              <span class="ml-1 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Starter Plan -->
        <Card class="relative overflow-hidden">
          <CardHeader>
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Starter</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Perfect for small centers</p>
              <div class="mt-4">
                <span class="text-4xl font-extrabold text-gray-900 dark:text-white">
                  ${{ billingPeriod === 'monthly' ? '29' : '24' }}
                </span>
                <span class="text-base font-medium text-gray-500 dark:text-gray-400">
                  /month
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul class="space-y-4">
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Up to 50 students</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">5 test templates</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Basic analytics</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Email support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              @click="selectPlan('starter')" 
              variant="outline" 
              class="w-full"
              :disabled="isProcessing"
            >
              Get Started
            </Button>
          </CardFooter>
        </Card>

        <!-- Professional Plan -->
        <Card class="relative overflow-hidden border-primary shadow-lg scale-105">
          <div class="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
            Most Popular
          </div>
          <CardHeader class="pt-8">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Professional</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Great for growing centers</p>
              <div class="mt-4">
                <span class="text-4xl font-extrabold text-gray-900 dark:text-white">
                  ${{ billingPeriod === 'monthly' ? '79' : '64' }}
                </span>
                <span class="text-base font-medium text-gray-500 dark:text-gray-400">
                  /month
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul class="space-y-4">
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Up to 200 students</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Unlimited test templates</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Advanced analytics</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Priority support</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Custom branding</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              @click="selectPlan('professional')" 
              class="w-full"
              :disabled="isProcessing"
            >
              Choose Professional
            </Button>
          </CardFooter>
        </Card>

        <!-- Enterprise Plan -->
        <Card class="relative overflow-hidden">
          <CardHeader>
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Enterprise</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">For large institutions</p>
              <div class="mt-4">
                <span class="text-4xl font-extrabold text-gray-900 dark:text-white">
                  ${{ billingPeriod === 'monthly' ? '199' : '159' }}
                </span>
                <span class="text-base font-medium text-gray-500 dark:text-gray-400">
                  /month
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul class="space-y-4">
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Unlimited students</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Unlimited everything</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Advanced reporting</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">24/7 support</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">API access</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Dedicated manager</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              @click="selectPlan('enterprise')" 
              variant="outline" 
              class="w-full"
              :disabled="isProcessing"
            >
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>

      <!-- Features Comparison -->
      <div class="mt-20">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Compare Features
        </h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Feature
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Starter
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Professional
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
              <tr>
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Students</td>
                <td class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">50</td>
                <td class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">200</td>
                <td class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Unlimited</td>
              </tr>
              <tr class="bg-gray-50 dark:bg-gray-700">
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Test Templates</td>
                <td class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">5</td>
                <td class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Unlimited</td>
                <td class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Unlimited</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Analytics</td>
                <td class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Basic</td>
                <td class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Advanced</td>
                <td class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Advanced + Reports</td>
              </tr>
              <tr class="bg-gray-50 dark:bg-gray-700">
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Support</td>
                <td class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Email</td>
                <td class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Priority</td>
                <td class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">24/7</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-20 bg-primary text-primary-foreground rounded-2xl px-8 py-16 text-center">
        <h2 class="text-3xl font-bold">Ready to get started?</h2>
        <p class="mt-4 text-lg opacity-90">
          Join thousands of learning centers already using our platform
        </p>
        <Button @click="selectPlan('professional')" size="lg" variant="secondary" class="mt-8">
          Start Your Free Trial
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check } from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useHead({
  title: "Subscription Plans - Testify",
});

const billingPeriod = ref('monthly');
const isProcessing = ref(false);

async function selectPlan(planType) {
  try {
    isProcessing.value = true;
    
    // TODO: Integrate with actual payment processing
    console.log(`Selected plan: ${planType}, billing: ${billingPeriod.value}`);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`${planType.charAt(0).toUpperCase() + planType.slice(1)} plan selected!`);
    
    // Redirect to dashboard after successful subscription
    await navigateTo("/dashboard");
    
  } catch (error) {
    console.error("Plan selection error:", error);
    toast.error("Failed to process subscription. Please try again.");
  } finally {
    isProcessing.value = false;
  }
}

definePageMeta({
  layout: false,
  middleware: "auth",
});
</script>