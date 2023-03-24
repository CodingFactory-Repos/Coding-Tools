<script lang="ts">
import StudentList from '../components/RollCallComponents/StudentList.vue';
import QrCode from '../components/RollCallComponents/QrCode.vue';
import Chat from '../components/RollCallComponents/Chat.vue';

export default {
	components: {
		StudentList,
		QrCode,
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
  <div class="flex">
	<QrCode />
	<StudentList />
  <Chat />
  </div>
</template>
