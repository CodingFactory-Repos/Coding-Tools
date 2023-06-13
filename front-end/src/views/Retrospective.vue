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
import { useCoursStore } from '@/store/modules/course.store';


const courseStore = useCoursStore();
courseStore.getAllCourses()

</script>
