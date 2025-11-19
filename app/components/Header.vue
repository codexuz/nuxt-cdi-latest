<template>
    <header class="sticky inset-0 z-50 h-14 gap-3 w-full bg-transparent px-4 backdrop-blur-md"
        style="transform: all; top: 0px;">
        <div class="mx-auto flex h-full items-center justify-between w-[90%] lg:w-[70%]">
            <NuxtLink to="/" class="flex items-center justify-start gap-1 active" data-status="active"
                aria-current="page">
                <img src="/logo2.png" alt="Impulse Study" class="w-28 dark:hidden" />
                <img src="/logo2_dark.png" alt="Impulse Study" class="w-28 hidden dark:inline-block" />
            </NuxtLink>
            <div class="flex items-center justify-end sm:gap-2">
                <!-- Theme Toggle Button -->
                <ClientOnly>
                    <Button variant="ghost" class="rounded-full w-9 h-9" @click="toggleTheme">
                        <template v-if="colorMode.preference === 'light'">
                            <Sun />
                        </template>
                        <template v-else>
                            <Moon />
                        </template>
                    </Button>

                    <NuxtLink to="/owner/dashboard" v-if="isAuthenticated"
                        class="inline-flex [&amp;_svg]:size-4 ml-2 items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
                        type="button">
                        Dashboard
                    </NuxtLink>

                    <NuxtLink to="/login" v-else
                        class="inline-flex [&amp;_svg]:size-4 ml-2 items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
                        type="button">
                        Sign In
                    </NuxtLink>
                </ClientOnly>

            </div>
        </div>
    </header>
</template>

<script setup>
const colorMode = useColorMode()
import { Sun, Moon, Wallet } from "lucide-vue-next";

// Use global authentication state
const { isAuthenticated, user } = useAuth()

// Load profile data if authenticated
if (isAuthenticated.value) {
  try {
    await getProfile()
  } catch (error) {
    // Profile loading failed, user will be logged out by getProfile
    console.error('Failed to load profile:', error)
  }
}

const toggleTheme = () => {
    colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'
}
</script>