<script lang="ts">
import StudentListComponent from '@/components/RollCallComponents/StudentListComponent.vue';
import GroupsComponent from '@/components/RollCallComponents/GroupsComponent.vue';

export default {
	components: {
		StudentListComponent,
    GroupsComponent,
	},
	data() {
		return {
			url: '',
		};
	},
};
// Generate the link of the QR code using api call
// and pass it to the QrCode component
</script>
<template>
	<StudentListComponent />
  <GroupsComponent />
</template>
