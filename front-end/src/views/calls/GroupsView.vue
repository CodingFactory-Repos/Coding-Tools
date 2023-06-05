<script lang="ts">
import StudentListComponent from '@/components/RollCallComponents/StudentListComponent.vue';
import GroupsComponent from '@/components/RollCallComponents/GroupsComponent.vue';
import Chat from '@/components/RollCallComponents/Chat.vue';

export default {
	components: {
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
	<StudentListComponent />
	<GroupsComponent />
	<Chat room-id="1" />
</template>
