<script lang="ts">
import StudentListComponent from '@/components/RollCallComponents/StudentListComponent.vue';
import GroupsComponent from '@/components/RollCallComponents/GroupsComponent.vue';
import Chat from '@/components/RollCallComponents/Chat.vue';
import ReturnButtonComponent from "@/components/RollCallComponents/ReturnButtonComponent.vue";

export default {
	components: {
		ReturnButtonComponent,
		Chat,
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
	<ReturnButtonComponent />
	<StudentListComponent />
	<GroupsComponent />
	<Chat room-id="1" />
</template>
