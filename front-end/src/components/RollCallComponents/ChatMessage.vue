<template>
	<div class="message flex-col snap-align-end">
		<div class="message_body">{{ message.text }}</div>
		<div class="sender text-sm">{{ message.sender_name }} {{ message.date }}</div>
	</div>
</template>
<script>
export default {
	props: {
		message: {
			type: Object,
			required: true,
		},
	},
};
</script>
