<template>
	<div>
		<div v-if="userStatus==0">
			<Courses />
		</div>	

	</div>
</template>

<script lang="ts" setup>
import Courses from '@/components/courses/Courses.vue';
import detail from '@/components/courses/CoursesDetail.vue';

const userStatus = 0;

</script>
