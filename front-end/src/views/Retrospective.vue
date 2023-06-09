<template>
	<div class="pages-retrospective">
		<div>
			<CreateRetro />
		</div>
		<div>
			<PassedRetrospectives />
		</div>
	</div>
</template>

<script lang="ts" setup>
import CreateRetro from '@/components/retrospective/CreateRetro.vue';
import PassedRetrospectives from '@/components/retrospective/PassedRetrospectives.vue'
import { useCourseStore } from '@/store/course.store';

const courseStore = useCourseStore();
courseStore.getAllCourses()

</script>
