<template>
    <div class="flex h-screen w-full flex-col">
    <ExamHeader :title="title"/>
         <slot/>
    </div>
</template>

<script setup>
import ExamHeader from "../components/exam-components/ExamHeader.vue";

defineProps({
    title: String
})
</script>