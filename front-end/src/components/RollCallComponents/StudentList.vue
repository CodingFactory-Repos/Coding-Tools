<script>
import StudentCell from '../RollCallComponents/StudentCell.vue';

export default {
	name: 'StudentList',
	components: {
		StudentCell,
	},
};
</script>
<template>
	<div v-for="student in testStudentList" :key="student.name">
		<div class="flex flex-row">
			<StudentCell v-bind:studentname="student.name" v-bind:status="student.status" />
		</div>
	</div>
</template>
