<template>
	<div class="message flex-col snap-align-end z-0 mt-5" v-if="message.type == 'msg'">
		<div class="message_body mb-[-25px] text-gray-400">{{ message.text }}</div>
		<div class="sender text-xs text-justify">{{ message.sender_name }} {{ message.date }}</div>
	</div>
	<div class="message flex-col z-0" v-else-if="message.type == 'gif'">
		<div class="gif_message_body w-1/2 mb-[-20px]">
			<img :src="message.url" alt="gif" class="max-w-50 max-h-50" />
		</div>
		<div class="sender text-xs text-justify">{{ message.sender_name }} {{ message.date }}</div>
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
