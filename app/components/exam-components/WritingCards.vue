<template>
     <div class="py-8 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-start">

            <Card class="w-full cursor-pointer transition  duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" v-for="(i, index) in 6">
                <CardContent>
                    <Badge variant="outline">
                        <PencilLine/> Writing
                    </Badge>
                    <h1 class="text-2xl font-bold">Test {{ index + 1 }}</h1>
                </CardContent>
                <CardFooter class="flex flex-wrap gap-2">
                   <Button class="bg-blue-600 text-white transition duration-400 hover:bg-blue-700"><ShoppingCart/>Buy Test</Button>
                </CardFooter>
            </Card>
        </div>
</template>

<script setup>
import { ShoppingCart, PencilLine } from 'lucide-vue-next';

</script>