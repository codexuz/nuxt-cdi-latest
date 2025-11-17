<template>
  <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
    <!-- Subtle Background Shapes -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Soft Gradient Orbs -->
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl"></div>
      
      <!-- Subtle Grid Pattern -->
      <div class="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(99, 102, 241) 1px, transparent 0); background-size: 50px 50px;"></div>
      </div>
    </div>
    
    <div class="container mx-auto px-6 lg:px-12 py-20 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <!-- Left Content -->
        <div class="space-y-8 max-w-2xl">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 dark:border-blue-800/50">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-blue-700 dark:text-blue-300">
              Built for Educational Centers
            </span>
          </div>
          
          <!-- Main Heading -->
          <div class="space-y-6">
            <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
              MOCKMEE
              <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-400">
                LMS + CD IELTS
              </span>
              <br />
              <span class="text-4xl lg:text-5xl xl:text-6xl">
                Platform
              </span>
            </h1>
            
            <p class="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Manage classes, run CD IELTS mock tests, track progress, and scale your center effortlessly.
            </p>
          </div>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink 
              to="/register" 
              class="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </NuxtLink>
            
            <a 
              href="https://t.me/javlon_developer" 
              target="_blank"
              class="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200 font-semibold rounded-2xl transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>Book Demo</span>
            </a>
          </div>
          
          <!-- Trust Indicators -->
          <div class="pt-8 space-y-4">
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span>No credit card required • Free trial available</span>
            </div>
            
            <div class="flex flex-wrap gap-6 pt-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">500+</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Active Centers</div>
                </div>
              </div>
              
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Tests Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Dashboard Mockup -->
        <div class="relative lg:block">
          <div class="relative">
            <!-- Main Dashboard Card -->
            <div class="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-800 backdrop-blur-sm">
              <!-- Dashboard Header -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">Analytics Overview</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Last 30 days</div>
                  </div>
                </div>
                <div class="flex gap-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
              
              <!-- Stats Grid -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/50">
                  <div class="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Active Students</div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">2,847</div>
                  <div class="text-xs text-green-600 dark:text-green-400 mt-1">↑ 12.5%</div>
                </div>
                
                <div class="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30 rounded-2xl p-4 border border-teal-100 dark:border-teal-900/50">
                  <div class="text-xs font-medium text-teal-600 dark:text-teal-400 mb-1">Tests Today</div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">156</div>
                  <div class="text-xs text-green-600 dark:text-green-400 mt-1">↑ 8.2%</div>
                </div>
              </div>
              
              <!-- Chart Representation -->
              <div class="space-y-3">
                <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Performance Trend</span>
                  <span class="text-green-600 dark:text-green-400">+23% this month</span>
                </div>
                
                <div class="space-y-2">
                  <div class="flex items-center gap-3">
                    <div class="w-16 text-xs text-gray-600 dark:text-gray-400">Mon</div>
                    <div class="flex-1 h-8 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg" style="width: 70%"></div>
                    <div class="text-xs font-medium text-gray-900 dark:text-white">78</div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-16 text-xs text-gray-600 dark:text-gray-400">Tue</div>
                    <div class="flex-1 h-8 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-lg" style="width: 85%"></div>
                    <div class="text-xs font-medium text-gray-900 dark:text-white">92</div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-16 text-xs text-gray-600 dark:text-gray-400">Wed</div>
                    <div class="flex-1 h-8 bg-gradient-to-r from-teal-500 to-teal-400 rounded-lg" style="width: 95%"></div>
                    <div class="text-xs font-medium text-gray-900 dark:text-white">104</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Floating Cards -->
            <div class="absolute -right-6 -top-6 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 border border-gray-200/50 dark:border-gray-800 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-xs font-semibold text-gray-900 dark:text-white">CD IELTS Ready</span>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Mock tests running smoothly</div>
            </div>
            
            <div class="absolute -left-6 bottom-12 w-44 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 border border-gray-200/50 dark:border-gray-800 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <span class="text-xs font-semibold text-gray-900 dark:text-white">Live Session</span>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">24 students online</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No additional imports needed
</script>

<style scoped>
/* Smooth animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Gradient text shimmer effect */
@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
</style>