<template>
	<div
		class="px-2 py-2 w-full flex gap-2 items-center justify-between bg-light-secondary dark:bg-dark-secondary rounded-lg"
	>
		<div class="flex items-center gap-5">
			<img
				:src="userRetro.picture || '/template-no-image.png'"
				class="w-12 h-12 rounded-full border border-dark-secondary"
				alt="profile_picture"
			/>
			<div class="flex flex-col gap-1">
				<span class="text-sm text-black dark:text-white font-bold">{{ userRetro.firstName + " " + userRetro.lastName }}</span>
				<span class="text-black dark:text-white text-[10px]">{{ userRetro.groupName }}</span>
			</div>
		</div>
		<DefaultButton
			@click="!userRetro.pending && success === Success.NULL ? sendInvitation(userRetro.id) : {}"
			class="transition-all min-w-[150px] max-w-[150px]"
			:class="{
				'bg-[#783676] hover:bg-[#a4418b]': !userRetro.pending && success === Success.NULL,
				'bg-[#1f6eb4] cursor-not-allowed': userRetro.pending && success === Success.NULL,
				'bg-[#308129] cursor-not-allowed': success === Success.TRUE,
				'bg-[#a32e2e] cursor-not-allowed': success === Success.FALSE,
			}"
			type="button"
			:text="
				!userRetro.pending && success === Success.NULL ? 'Send an invitation'
				: userRetro.pending && success === Success.NULL ? 'Pending...'
				: success === Success.TRUE ? 'Sent !'
				: 'Failed to send'
			"
			color="text-white hover:text-white"
			text-style="text-white hover:text-white text-xs"
		/>
	</div>
</template>

<script lang="ts" setup>
import DefaultButton from '@/components/common/buttons/Default.vue';
import { UserRetroList } from '@/store/interfaces/user.interface';
import { AxiosError } from 'axios';
import { ref } from 'vue';
import { apiTrySendRetroInvitation } from '@/api/retrospective-req';

const props = defineProps<{
	roomId: string,
	user: UserRetroList,
}>();

enum Success {
	NULL = 0,
	TRUE = 1,
	FALSE = 2,
}

const userRetro = ref(props.user);
const success = ref(Success.NULL);

const sendInvitation = (userId: string) => {
	apiTrySendRetroInvitation(userId, props.roomId)
		.then((res) => {
			if(res.data.status === 'ok') {
				success.value = Success.TRUE;

				const timer = setTimeout(() => {
					userRetro.value.pending = true;
					success.value = Success.NULL;
					clearTimeout(timer);
				}, 1000);
			}
		})
		.catch((err: AxiosError) => {
			if(err instanceof AxiosError) {
				console.error(err.message);
			}

			success.value = Success.FALSE;
			const timer = setTimeout(() => {
				success.value = Success.NULL;
				clearTimeout(timer);
			}, 1000);
		})
};
</script>