<template>
    <div v-if="course">
        <h1>{{ course.tag }}</h1>
        <p>{{ course.description }}</p>
    </div>
    <div v-else>
        <p>Chargement...</p>
    </div>
</template>

<script lang="ts">
import { useCourseStore } from '@/store/modules/course.store';
import { defineComponent } from 'vue';

export default defineComponent({
    async beforeRouteEnter(to, from, next) {
        const store = useCourseStore();
        await store.getAllCourses();
        next(true);
    },
    setup() {
       const store = useCourseStore();

        return {
            course: store.course,
        };
    },
});
</script>
