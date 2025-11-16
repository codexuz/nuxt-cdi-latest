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
        <!-- Loading State -->
        <template v-if="isLoading">
          <Card v-for="i in 2" :key="i" class="relative overflow-hidden">
            <CardHeader>
              <div class="text-center space-y-4">
                <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div v-for="j in 4" :key="j" class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </template>

        <!-- API Plans -->
        <template v-else>
          <Card 
            v-for="(plan, index) in plans" 
            :key="plan.id"
            :class="[
              'relative overflow-hidden',
              index === 1 ? 'border-primary shadow-lg scale-105' : ''
            ]"
          >
            <div 
              v-if="index === 1" 
              class="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium"
            >
              Most Popular
            </div>
            <CardHeader :class="index === 1 ? 'pt-8' : ''">
              <div class="text-center">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ plan.name }}</h3>
                <p class="mt-2 text-gray-600 dark:text-gray-400">{{ plan.description }}</p>
                <div class="mt-4">
                  <span class="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {{ formatPrice(billingPeriod === 'monthly' ? plan.price_month : plan.price_year) }}
                  </span>
                  <span class="text-base font-medium text-gray-500 dark:text-gray-400">
                    {{ plan.currency }}/{{ billingPeriod === 'monthly' ? 'month' : 'year' }}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul class="space-y-4">
                <li v-for="(feature, fIndex) in getFeaturesList(plan.features)" :key="fIndex" class="flex items-center">
                  <Check class="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                @click="selectPlan(plan.id, plan.name)" 
                :variant="index === 1 ? 'default' : 'outline'"
                class="w-full"
                :disabled="isProcessing"
              >
                {{ index === 1 ? 'Choose ' + plan.name : 'Get Started' }}
              </Button>
            </CardFooter>
          </Card>
        </template>

        <!-- Enterprise Plan -->
        <Card class="relative overflow-hidden">
          <CardHeader>
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Enterprise</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">For large institutions</p>
              <div class="mt-4">
                <span class="text-4xl font-extrabold text-gray-900 dark:text-white">
                  {{ formatPrice(billingPeriod === 'monthly' ? '700000' : '6720000') }} UZS
                </span>
                <span class="text-base font-medium text-gray-500 dark:text-gray-400">
                   UZS/{{ billingPeriod === 'monthly' ? 'month' : 'year' }}
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
                <span class="text-gray-700 dark:text-gray-300">24/7 support</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Branding</span>
              </li>
              <li class="flex items-center">
                <Check class="h-5 w-5 text-green-500 mr-3" />
                <span class="text-gray-700 dark:text-gray-300">Dedicated hosting</span>
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

      <!-- CTA Section -->
      <div class="mt-20 bg-primary text-primary-foreground rounded-2xl px-8 py-16 text-center">
        <h2 class="text-3xl font-bold">Ready to get started?</h2>
        <p class="mt-4 text-lg opacity-90">
          Join thousands of learning centers already using our platform
        </p>
        <Button 
          @click="selectPlan(plans[1]?.id || plans[0]?.id, 'Professional')" 
          size="lg" 
          variant="secondary" 
          class="mt-8"
          :disabled="isProcessing || isLoading || plans.length === 0"
        >
          Start 30 Days Free Trial
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check } from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import { useAuthStore } from "~/stores/auth";
import { useCenters } from "~/composables/useCenters";

useHead({
  title: "Subscription Plans - Mockmee LMS",
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { activeCenter } = useCenters();

const billingPeriod = ref('monthly');
const isProcessing = ref(false);
const isLoading = ref(true);
const plans = ref([]);

// Fetch plans from API
async function fetchPlans() {
  try {
    isLoading.value = true;
    const response = await fetch(`${config.public.baseURL}/subscriptions/plans`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }

    const data = await response.json();
    plans.value = data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    toast.error('Failed to load subscription plans');
  } finally {
    isLoading.value = false;
  }
}

// Format price with thousand separators
function formatPrice(price) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice);
}

// Convert features object to readable list
function getFeaturesList(features) {
  const featureList = [];
  
  if (features.max_students) {
    featureList.push(features.max_students >= 10000 ? 'Unlimited students' : `Up to ${features.max_students} students`);
  }
  if (features.max_users) {
    featureList.push(features.max_users >= 10000 ? 'Unlimited users' : `Up to ${features.max_users} users`);
  }
  if (features.ielts) {
    featureList.push('IELTS test builder');
  }
  if (features.groups) {
    featureList.push('Group management');
  }
  if (features.attendance) {
    featureList.push('Attendance tracking');
  }
  if (features.payments) {
    featureList.push('Payment processing');
  }
  if (features.salary) {
    featureList.push('Salary management');
  }
  if (features.leads) {
    featureList.push('Lead management');
  }
  
  return featureList;
}

// Fetch plans on component mount
onMounted(() => {
  fetchPlans();
});

async function selectPlan(planId, planName) {
  try {
    isProcessing.value = true;
    
    if (!activeCenter.value) {
      toast.error('No active center found. Please create a center first.');
      return;
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    const trialEndsAt = new Date();
    const renewsAt = new Date();
    
    // Set end date based on billing period
    if (billingPeriod.value === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
      renewsAt.setMonth(renewsAt.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
      renewsAt.setFullYear(renewsAt.getFullYear() + 1);
    }
    
    // Set trial end date (30 days from now)
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);

    // Format dates to YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];

    const subscriptionData = {
      center_id: activeCenter.value.id,
      plan_id: planId,
      status: 'active',
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      trial_ends_at: formatDate(trialEndsAt),
      renews_at: formatDate(renewsAt),
      cancel_at_period_end: false
    };

    const response = await fetch(`${config.public.baseURL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscriptionData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to create subscription');
    }

    const result = await response.json();
    console.log('Subscription created:', result);
    
    toast.success(`${planName} plan activated successfully!`);
    
    // Redirect to dashboard after successful subscription
    await navigateTo("/dashboard");
    
  } catch (error) {
    console.error("Plan selection error:", error);
    toast.error(error.message || "Failed to process subscription. Please try again.");
  } finally {
    isProcessing.value = false;
  }
}

definePageMeta({
  layout: "dashboard",
});
</script>