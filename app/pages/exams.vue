<script setup lang="ts">
import { Info } from 'lucide-vue-next';
import ListeningCards from '~/components/exam-components/ListeningCards.vue'
import WritingCards from '~/components/exam-components/WritingCards.vue';
import ReadingCards from '~/components/exam-components/ReadingCards.vue';

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Exams - Impulse CD IELST',
});

const tabs = [
    {
        id: 'full',
        name: "Full Tests"
    },
    {
        id: 'listening',
        name: 'Listening',
    },
    {
        id: 'reading',
        name: 'Reading',
    },
    {
        id: 'writing',
        name: 'Writing',
    }
]
</script>

<template>
    <section class="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink>
                        <NuxtLink to="/">
                            Home
                        </NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Online Exams</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <div class="py-6 flex items-center space-x-2">
            <h1 class="scroll-m-20 text-xl sm:text-2xl font-bold tracking-tight md:text-3xl">Avaible Mock Tests</h1>
            <Popover>
                <PopoverTrigger>
                    <Info class="text-indigo-600 w-6 h-6 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent>
                    Please, fill your balance! Then you can purchase any section or the full version of the CD mock test
                    online.
                </PopoverContent>
            </Popover>
        </div>

        <div class="max-w-2xl">
            <p class="text-md text-gray-600 dark:text-gray-200">
                All test content is fully authentic, reflecting the same rigorous standards as the official IELTS exam.
                Every candidate’s responses are evaluated with the highest level of reliability, combining professional
                expertise and advanced security technology to ensure fairness and accuracy. With an automated results
                system, online test takers receive their scores instantly, accompanied by a comprehensive performance
                report and personalised feedback designed to support continuous improvement.
            </p>
        </div>

        <ClientOnly>

        <Tabs default-value="full" class="w-full py-6 mt-3">
            <TabsList class="grid w-full lg:w-[500px] grid-cols-4 gap-3">
                <TabsTrigger :value="tab.id" v-for="tab in tabs">
                    {{ tab.name}}
                </TabsTrigger>
            </TabsList>

            <TabsContent value="full">
                <div class="py-8 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-start">
                    <Card
                        class="w-full cursor-pointer transition  duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                        v-for="(i, index) in 6">
                        <CardContent>
                            <h1 class="text-2xl font-bold">Test {{ index + 1 }}</h1>
                        </CardContent>
                        <CardFooter class="flex flex-wrap gap-2">
                            <Badge class="border dark:border-blue-500 dark:text-blue-600" variant="outline">Authentic
                            </Badge>
                            <Badge class="border dark:border-orange-500 dark:text-orange-500" variant="outline">Real
                                Exam Timing
                            </Badge>
                            <Badge class="border dark:border-red-600 dark:text-red-600" variant="outline">Instant
                                Results
                            </Badge>
                            <Badge class="border dark:border-emerald-500 dark:text-emerald-500" variant="outline">Expert
                                Feedback</Badge>
                        </CardFooter>
                    </Card>
                </div>

            </TabsContent>

            <TabsContent value="listening">
               <ListeningCards/>
            </TabsContent>

             <TabsContent value="reading">
               <ReadingCards/>
            </TabsContent>

             <TabsContent value="writing">
               <WritingCards/>
            </TabsContent>

        </Tabs>
</ClientOnly>
    </section>
</template>
