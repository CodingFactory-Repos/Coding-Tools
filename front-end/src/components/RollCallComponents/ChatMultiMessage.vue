<template>
	<div class="message flex-col snap-align-end z-0" v-if="message.type == 'msg'">
		<div class="message_body">{{ message.text }}</div>
		<div class="sender text-sm">{{ message.sender_name }} {{ message.date }}</div>
	</div>
	<div class="message items-center z-0" v-else-if="message.type == 'gif'">
		<div class="gif_message_body w-50 h-50">
			<img :src="message.url" alt="gif" class="w-50 h-50" />
		</div>
		<div class="sender text-sm">{{ message.sender_name }} {{ message.date }}</div>
	</div>
</template>
<script>
export default {
	props: {
		message: {
			message: Object,
			required: true,
		},
	},
};
</script>
