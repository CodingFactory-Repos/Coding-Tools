<script lang="ts">
import CallsComponent from '@/components/RollCallComponents/CallsComponent.vue';
import StudentListComponent from '@/components/RollCallComponents/StudentListComponent.vue';
import Chat from '@/components/RollCallComponents/Chat.vue';
export default {
	components: {
		CallsComponent,
		StudentListComponent,
		Chat,
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
	<Chat room-id="1" />
</template>
