<template>
  <HeroSection />

  <!-- Key Features Section -->
  <section class="py-24 bg-white dark:bg-gray-950" data-aos="fade-up">
    <div class="container mx-auto px-6 lg:px-12">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Why Centers Choose MOCKMEE
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Everything you need to manage, deliver, and scale your educational center in one powerful platform
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Feature 1: Smart LMS Management -->
        <div class="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <!-- Icon -->
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Users class="w-7 h-7 text-white" />
          </div>
          
          <!-- Content -->
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Smart LMS Management
          </h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            Manage classes, lessons, materials, and attendance effortlessly with our intuitive learning management system.
          </p>

          <!-- Decorative Element -->
          <div class="absolute top-4 right-4 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-300"></div>
        </div>

        <!-- Feature 2: CD IELTS Test Engine -->
        <div class="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <!-- Icon -->
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Monitor class="w-7 h-7 text-white" />
          </div>
          
          <!-- Content -->
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
            CD IELTS Test Engine
          </h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            Run accurate, computer-delivered IELTS mock tests that mirror the real exam experience perfectly.
          </p>

          <!-- Decorative Element -->
          <div class="absolute top-4 right-4 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-300"></div>
        </div>

        <!-- Feature 3: Performance Analytics -->
        <div class="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <!-- Icon -->
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <BarChart class="w-7 h-7 text-white" />
          </div>
          
          <!-- Content -->
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Performance Analytics
          </h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            Track student scores, progress, and improvement with detailed reports and actionable insights.
          </p>

          <!-- Decorative Element -->
          <div class="absolute top-4 right-4 w-20 h-20 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all duration-300"></div>
        </div>

        <!-- Feature 4: Center Growth Tools -->
        <div class="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <!-- Icon -->
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Zap class="w-7 h-7 text-white" />
          </div>
          
          <!-- Content -->
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Center Growth Tools
          </h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            Automate repetitive tasks, save valuable time, and scale your institution with powerful automation tools.
          </p>

          <!-- Decorative Element -->
          <div class="absolute top-4 right-4 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-300"></div>
        </div>
      </div>

      <!-- Additional Info Bar -->
      <div class="mt-16 flex flex-wrap justify-center gap-12 pt-12 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Shield class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">Secure & Reliable</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">99.9% uptime guaranteed</div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Clock class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">24/7 Support</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Always here to help</div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <Globe class="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">Global Standards</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">IELTS certified tests</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Product Showcase Section -->
  <section class="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden" data-aos="fade-up">
    <!-- Background Decorative Elements -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-6 lg:px-12 relative z-10">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left Content -->
        <div class="space-y-8 lg:pr-12">
          <div class="space-y-4">
            <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              A Powerful Platform, Built for
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Modern Education
              </span>
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              From LMS management to realistic CD IELTS mock exams, MOCKMEE gives your center complete control in one system.
            </p>
          </div>

          <!-- Feature List -->
          <div class="space-y-4">
            <div class="flex items-start gap-4 group">
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <LayoutDashboard class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Intuitive dashboard for teachers and admins
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Easy-to-use interface that simplifies daily operations and reduces training time.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4 group">
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Monitor class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Realistic IELTS test interface
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Computer-delivered tests that mirror the actual IELTS exam experience perfectly.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4 group">
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Attendance, groups, payments, salary modules
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  All essential center management tools integrated in one powerful platform.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4 group">
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BarChart class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Detailed reporting and analytics
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Track every metric that matters with comprehensive reports and insights.
                </p>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="pt-4">
            <NuxtLink 
              to="/register" 
              class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <span>Start Free Trial</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Right Dashboard Mockup -->
        <div class="relative lg:block">
          <div class="relative">
            <!-- Main Dashboard Container -->
            <div class="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 border border-gray-200/50 dark:border-gray-800">
              <!-- Dashboard Header -->
              <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <LayoutDashboard class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">MOCKMEE Dashboard</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Admin Overview</div>
                  </div>
                </div>
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              <!-- Stats Cards -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/50">
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-xs font-medium text-blue-600 dark:text-blue-400">Total Students</div>
                    <Users class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">3,247</div>
                  <div class="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    <span>15.3% vs last month</span>
                  </div>
                </div>

                <div class="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30 rounded-2xl p-4 border border-teal-100 dark:border-teal-900/50">
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-xs font-medium text-teal-600 dark:text-teal-400">Active Tests</div>
                    <FileText class="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">124</div>
                  <div class="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    <span>8.7% increase</span>
                  </div>
                </div>
              </div>

              <!-- Chart Section -->
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
                <div class="flex items-center justify-between mb-4">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">Student Performance</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Last 7 days</div>
                </div>
                
                <div class="space-y-3">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-gray-600 dark:text-gray-400">Reading</span>
                      <span class="font-semibold text-gray-900 dark:text-white">87%</span>
                    </div>
                    <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style="width: 87%"></div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-gray-600 dark:text-gray-400">Listening</span>
                      <span class="font-semibold text-gray-900 dark:text-white">92%</span>
                    </div>
                    <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style="width: 92%"></div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-gray-600 dark:text-gray-400">Writing</span>
                      <span class="font-semibold text-gray-900 dark:text-white">78%</span>
                    </div>
                    <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" style="width: 78%"></div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-gray-600 dark:text-gray-400">Speaking</span>
                      <span class="font-semibold text-gray-900 dark:text-white">83%</span>
                    </div>
                    <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" style="width: 83%"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="mt-6 space-y-3">
                <div class="text-xs font-semibold text-gray-900 dark:text-white mb-3">Recent Activity</div>
                
                <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Users class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-medium text-gray-900 dark:text-white truncate">New student enrolled</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</div>
                  </div>
                </div>

                <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <FileText class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-medium text-gray-900 dark:text-white truncate">Mock test completed</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Floating Elements -->
            <div class="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl blur-2xl"></div>
            <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-2xl blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Benefits for Centers Section -->
  <section class="py-24 bg-white dark:bg-gray-950" data-aos="fade-up">
    <div class="container mx-auto px-6 lg:px-12">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Benefits for Centers
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Transform your educational center with tools designed to save time, improve results, and drive growth
        </p>
      </div>

      <!-- Benefits Grid -->
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Benefit 1: Reduce Administrative Work -->
        <div class="group relative bg-white dark:bg-gray-900 rounded-3xl p-10 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <!-- Icon -->
          <div class="relative mb-8">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Clock class="w-10 h-10 text-white" />
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <!-- Content -->
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Reduce Administrative Work
          </h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            Automated processes save hours every week, freeing your team to focus on what matters most—teaching and student success.
          </p>

          <!-- Stats Badge -->
          <div class="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full border border-blue-100 dark:border-blue-900/50">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">70%</div>
            <div class="text-sm text-blue-600 dark:text-blue-400">Time Saved</div>
          </div>

          <!-- Decorative gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        <!-- Benefit 2: Improve Student Results -->
        <div class="group relative bg-white dark:bg-gray-900 rounded-3xl p-10 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <!-- Icon -->
          <div class="relative mb-8">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Target class="w-10 h-10 text-white" />
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <!-- Content -->
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Improve Student Results
          </h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            Data-driven insights help teachers provide better support, identify struggling students early, and deliver personalized learning experiences.
          </p>

          <!-- Stats Badge -->
          <div class="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-full border border-indigo-100 dark:border-indigo-900/50">
            <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">35%</div>
            <div class="text-sm text-indigo-600 dark:text-indigo-400">Score Increase</div>
          </div>

          <!-- Decorative gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        <!-- Benefit 3: Scale With Confidence -->
        <div class="group relative bg-white dark:bg-gray-900 rounded-3xl p-10 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <!-- Icon -->
          <div class="relative mb-8">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingUp class="w-10 h-10 text-white" />
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <!-- Content -->
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Scale With Confidence
          </h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            Manage hundreds of students and tests smoothly without adding overhead. Our platform grows with your center seamlessly.
          </p>

          <!-- Stats Badge -->
          <div class="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-950/30 rounded-full border border-teal-100 dark:border-teal-900/50">
            <div class="text-2xl font-bold text-teal-600 dark:text-teal-400">10x</div>
            <div class="text-sm text-teal-600 dark:text-teal-400">Growth Ready</div>
          </div>

          <!-- Decorative gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="mt-16 text-center">
        <p class="text-gray-600 dark:text-gray-400 mb-6 text-lg">
          Join hundreds of educational centers already transforming their operations
        </p>
        <div class="flex flex-col sm:flex-row gap-4 mt-3 justify-center">
          <NuxtLink 
            to="/register" 
            class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <span>Get Started Free</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </NuxtLink>
          
          <a 
            href="https://t.me/javlon_developer" 
            target="_blank"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200 font-semibold rounded-2xl transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          >
            <span>Schedule a Demo</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900" data-aos="fade-up">
    <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Everything you need to know about MOCKMEE
        </p>
      </div>

      <!-- FAQ Accordion -->
      <Accordion type="single" collapsible class="space-y-4">
        <!-- Question 1 -->
        <AccordionItem value="item-1" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <AccordionTrigger class="py-6 text-left hover:no-underline group">
            <div class="flex items-start gap-4 w-full">
              <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mt-1">
                <HelpCircle class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  How does the CD IELTS mock test work?
                </h3>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent class="pb-6 pl-14">
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our CD IELTS mock tests replicate the official computer-delivered IELTS exam environment. Students complete all four sections (Reading, Listening, Writing, Speaking) on their computers with the same interface, timing, and question formats as the real test. The system automatically scores Reading and Listening sections instantly, while Writing and Speaking are reviewed by certified instructors.
            </p>
          </AccordionContent>
        </AccordionItem>

        <!-- Question 2 -->
        <AccordionItem value="item-2" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <AccordionTrigger class="py-6 text-left hover:no-underline group">
            <div class="flex items-start gap-4 w-full">
              <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mt-1">
                <Building2 class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Can I manage multiple branches?
                </h3>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent class="pb-6 pl-14">
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              Yes! MOCKMEE supports multi-branch management seamlessly. You can create separate dashboards for each location while maintaining centralized oversight. Each branch can have its own staff, students, and schedules, with aggregated reporting at the organization level. Branch managers get customized access to their location's data only.
            </p>
          </AccordionContent>
        </AccordionItem>

        <!-- Question 3 -->
        <AccordionItem value="item-3" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <AccordionTrigger class="py-6 text-left hover:no-underline group">
            <div class="flex items-start gap-4 w-full">
              <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mt-1">
                <Users class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  Do teachers have separate dashboards?
                </h3>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent class="pb-6 pl-14">
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              Absolutely. Teachers have their own customized dashboards showing only their assigned classes, students, and tests. They can track student progress, grade assignments, manage attendance, and communicate with students—all without accessing administrative functions or other teachers' data. Role-based permissions ensure everyone sees only what they need.
            </p>
          </AccordionContent>
        </AccordionItem>

        <!-- Question 4 -->
        <AccordionItem value="item-4" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 px-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <AccordionTrigger class="py-6 text-left hover:no-underline group">
            <div class="flex items-start gap-4 w-full">
              <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mt-1">
                <Shield class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  How secure is student data?
                </h3>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent class="pb-6 pl-14">
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              Security is our top priority. All data is encrypted in transit and at rest using industry-standard AES-256 encryption. We implement role-based access control, regular security audits, automated backups, and comply with international data protection standards. Our servers are hosted in secure data centers with 99.9% uptime SLA and DDoS protection.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <!-- Bottom CTA -->
      <div class="mt-16 text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl border border-blue-100 dark:border-blue-900/50">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Still have questions?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Our team is here to help you get started with MOCKMEE
        </p>
        <a 
          href="https://t.me/javlon_developer" 
          target="_blank"
          class="inline-flex items-center mt-3 gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          <Send class="w-5 h-5" />
          <span>Contact Support</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Final CTA Section -->
  <section class="relative py-32 overflow-hidden" data-aos="fade-up">
    <!-- Gradient Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700"></div>
    
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-6 lg:px-12 relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-white">
            Trusted by 500+ Learning Centers
          </span>
        </div>

        <!-- Main Heading -->
        <h2 class="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to Upgrade Your Center?
        </h2>
        
        <!-- Subtitle -->
        <p class="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
          Start using Mockmee to deliver professional learning and testing experiences that drive real results.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 mt-3 justify-center items-center">
          <a 
            href="https://t.me/javlon_developer" 
            target="_blank"
            class="group relative inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.05] shadow-2xl hover:shadow-white/25"
          >
            <!-- Glow Effect -->
            <div class="absolute inset-0 rounded-2xl bg-white opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-300"></div>
            
            <span class="relative z-10">Book a Demo</span>
            <svg class="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </a>

          <NuxtLink 
            to="/register"
            class="inline-flex items-center gap-2 px-10 py-5 bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/10 text-white font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm"
          >
            <span>Start Free Trial</span>
          </NuxtLink>
        </div>

        <!-- Trust Indicators -->
        <div class="mt-16 flex flex-wrap justify-center items-center gap-8 pt-12 border-t border-white/20">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Shield class="w-6 h-6 text-white" />
            </div>
            <div class="text-left">
              <div class="text-sm font-semibold text-white">Enterprise Security</div>
              <div class="text-sm text-blue-100">Bank-level encryption</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Clock class="w-6 h-6 text-white" />
            </div>
            <div class="text-left">
              <div class="text-sm font-semibold text-white">24/7 Support</div>
              <div class="text-sm text-blue-100">Always here for you</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Zap class="w-6 h-6 text-white" />
            </div>
            <div class="text-left">
              <div class="text-sm font-semibold text-white">Quick Setup</div>
              <div class="text-sm text-blue-100">Up and running in minutes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
 

</template>

<script setup>
useHead({
  title: "Mockmee LMS - Master Your IELTS Journey",
  meta: [
    {
      name: "description",
      content:
        "Experience real IELTS exam conditions with Impulse CD IELTS. Computer-delivered mock tests, instant results, and expert feedback to achieve your target band score.",
    },
    {
      name: "keywords",
      content:
        "IELTS, computer delivered, mock test, practice test, band score, preparation, english test",
    },
  ],
});

const router = useRouter();

import {
  BookOpen,
  Clock,
  Headphones,
  FileText,
  PenTool,
  Edit,
  Mic,
  Volume2,
  Zap,
  Target,
  BarChart,
  Globe,
  Users,
  Shield,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Send,
  Monitor,
  LayoutDashboard,
  TrendingUp,
  HelpCircle,
  Building2,
} from "lucide-vue-next";

definePageMeta({
  layout: "default",
});
</script>
