<template>
  <HeroSection />

  <!-- IELTS Modules Section -->
  <section class="px-6 py-20 bg-white/50 dark:bg-gray-800/50">
    <div class="container mx-auto max-w-6xl">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Complete IELTS Test Modules
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Practice all four skills with our authentic computer-delivered format
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Listening Module -->
        <Card
          class="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        >
          <CardContent class="p-6 text-center">
            <div
              class="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <Headphones class="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle class="text-xl font-semibold mb-2">Listening</CardTitle>
            <CardDescription class="text-gray-600 dark:text-gray-400 mb-4">
              30 minutes • 40 questions
            </CardDescription>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Audio recordings with various accents and realistic exam scenarios
            </p>
            <Button
              @click="() => router.push('/exams')"
              variant="outline"
              class="w-full"
            >
              <Clock class="mr-2 h-4 w-4" />
              Practice Now
            </Button>
          </CardContent>
        </Card>

        <!-- Reading Module -->
        <Card
          class="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        >
          <CardContent class="p-6 text-center">
            <div
              class="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <BookOpen class="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle class="text-xl font-semibold mb-2">Reading</CardTitle>
            <CardDescription class="text-gray-600 dark:text-gray-400 mb-4">
              60 minutes • 40 questions
            </CardDescription>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Academic and General Training passages with various question types
            </p>
            <Button
              @click="() => router.push('/exams')"
              variant="outline"
              class="w-full"
            >
              <FileText class="mr-2 h-4 w-4" />
              Practice Now
            </Button>
          </CardContent>
        </Card>

        <!-- Writing Module -->
        <Card
          class="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        >
          <CardContent class="p-6 text-center">
            <div
              class="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <PenTool class="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle class="text-xl font-semibold mb-2">Writing</CardTitle>
            <CardDescription class="text-gray-600 dark:text-gray-400 mb-4">
              60 minutes • 2 tasks
            </CardDescription>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Task 1 & 2 with automated scoring and detailed feedback
            </p>
            <Button
              @click="() => router.push('/exams')"
              variant="outline"
              class="w-full"
            >
              <Edit class="mr-2 h-4 w-4" />
              Practice Now
            </Button>
          </CardContent>
        </Card>

        <!-- Speaking Module -->
        <Card
          class="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        >
          <CardContent class="p-6 text-center">
            <div
              class="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <Mic class="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle class="text-xl font-semibold mb-2">Speaking</CardTitle>
            <CardDescription class="text-gray-600 dark:text-gray-400 mb-4">
              11-14 minutes • 3 parts
            </CardDescription>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              AI-powered speaking assessment with pronunciation analysis
            </p>
            <Button
              @click="() => router.push('/exams')"
              variant="outline"
              class="w-full"
            >
              <Volume2 class="mr-2 h-4 w-4" />
              Practice Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="px-6 py-20">
    <div class="container mx-auto max-w-6xl">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Why Choose Impulse CD IELTS?
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Advanced features for comprehensive IELTS preparation
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="text-center">
          <div
            class="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Zap class="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Instant Results
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Get your band scores immediately after completing each section with
            detailed performance analysis.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Target class="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Precise Scoring
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Our AI-powered scoring system matches official IELTS standards with
            98% accuracy.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-20 h-20 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <BarChart class="h-10 w-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Progress Tracking
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Monitor your improvement with detailed analytics and personalized
            study recommendations.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-20 h-20 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Globe class="h-10 w-10 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Authentic Format
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Experience the exact same interface and timing as the official
            computer-delivered IELTS test.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-20 h-20 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Users class="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Expert Support
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Get guidance from certified IELTS trainers and access premium study
            materials.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Shield class="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Secure Platform
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Your data and test results are protected with bank-level security
            and privacy measures.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer Section -->
  <footer class="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
    <!-- Main Footer Content -->
    <div class="px-6 py-16">
      <div class="container mx-auto max-w-6xl">
        <div class="flex flex-col md:flex-row justify-between">
          <!-- Company Info -->
          <div class="space-y-6 max-w-md mb-6 md:mb-0">
            <div class="flex items-center space-x-2">
              <div class="w-28 flex items-center justify-center">
                <img
                  src="/logo_icon_black.png"
                  class="h-full w-full dark:hidden text-white"
                />
                <img
                  src="/logo_icon_dark.png"
                  class="h-full hidden dark:inline w-full text-white"
                />
              </div>
            </div>
            <p class="text-gray-400 leading-relaxed">
              Your trusted partner for IELTS success. We provide authentic
              computer-delivered mock tests and comprehensive preparation
              materials to help you achieve your target band score.
            </p>
            <div class="flex space-x-4">
              <a
                href="https://t.me/impulse_lc"
                target="_blank"
                class="w-10 h-10 bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Send class="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/impulsestudy_lc"
                target="_blank"
                class="w-10 h-10 bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Instagram class="h-5 w-5" />
              </a>
              <a
                href="#"
                class="w-10 h-10 bg-gray-200 hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Youtube class="h-5 w-5" />
              </a>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold">Contact Us</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <MapPin class="h-5 w-5 text-blue-400 mt-0.5" />
                <div class="text-gray-400">
                  <p class="font-medium text-slate-800 dark:text-white">
                    Impulse Study
                  </p>
                  <p>Toshkent shahri, Sergeli 5a, Mehrigiyo koʻchasi</p>
                  <p>Mo'ljal: Sergeli 3-metro bekati</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <Phone class="h-5 w-5 text-blue-400" />
                <div class="text-gray-400">
                  <p>+998 (95) 525-99-66</p>
                  <p>+998 (99) 525-99-44</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <Clock class="h-5 w-5 text-blue-400" />
                <div class="text-gray-400">
                  <p class="font-medium text-slate-800 dark:text-white">
                    Working Hours
                  </p>
                  <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div class="bg-gray-100 dark:bg-gray-950 px-6 py-6">
      <div class="container mx-auto max-w-6xl">
        <div
          class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div
            class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-700 dark:text-gray-400"
          >
            <p>&copy; 2025 Impulse CD IELTS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
useHead({
  title: "Impulse CD IELTS - Master Your IELTS Journey",
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

import { motion } from "motion-v";
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
} from "lucide-vue-next";
</script>
