<script lang="ts">
import CallsComponent from '@/components/RollCallComponents/CallsComponent.vue';
import StudentListComponent from '@/components/RollCallComponents/StudentListComponent.vue';
import MakeGroupsComponent from '@/components/RollCallComponents/MakeGroupsComponent.vue';

export default {
	components: {
		CallsComponent,
		StudentListComponent,
		MakeGroupsComponent,
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
	<CallsComponent />
	<StudentListComponent />
	<MakeGroupsComponent />
</template>
