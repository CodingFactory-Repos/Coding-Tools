<template>
	<div :class="['message flex-col z-0 mb-3']" v-if="message.type == 'msg'">
		<div :class="['message_body text-2xl font text-gray-400 text-center mb-1']">
			{{ message.text }}
		</div>
		<div class="sender text-xs font-thin text-gray-500 text-center">
			{{ message.sender_name }} {{ message.date }}
		</div>
	</div>
	<div :class="['message flex-col flex z-0 items-center mb-3']" v-else-if="message.type == 'gif'">
		<div class="gif_message_body w-[200px] h-[200px flex align-center]">
			<img :src="message.url" alt="gif" class="w-full h-full" />
		</div>
		<div class="sender text-xs font-thin text-gray-500 text-center">
			{{ message.sender_name }} {{ message.date }}
		</div>
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
