<template>
	<div
		class="px-2 py-2 w-full flex gap-2 items-center justify-between bg-light-secondary dark:bg-dark-secondary rounded-lg"
	>
		<div class="flex items-center gap-5 h-full">
			<img
				:src="userCanvas.picture || '/template-no-image.png'"
				class="w-12 h-12 rounded-full border border-dark-secondary"
				alt="profile_picture"
			/>
			<div class="flex flex-col gap-1">
				<span class="text-sm text-black dark:text-white font-bold">{{ userCanvas.firstName + " " + userCanvas.lastName }}</span>
				<span class="text-black dark:text-white text-[10px]">{{ userCanvas.groupName }}</span>
			</div>
			<div class="flex items-start justify-start h-full">
				<span
					class="px-2 py-1 rounded-xl text-xs font-bold"
					:class="{ 
						'bg-[#308129] border border-[#308129]': !userCanvas.pending,
						'bg-[#1f6eb4] border border-[#1f6eb4]': userCanvas.pending,
					}"
				>
					{{ userCanvas.pending ? 'pending ...' : 'collaborator' }}
				</span>
			</div>
		</div>
		<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="removeAccess(userCanvas.id)">
			<SvgCross width="22" height="22" class="!fill-gray-400 hover:dark:!fill-red-600"/>
		</IconButton>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { UserCanvasList } from '@/store/interfaces/user.interface';
import IconButton from '@/components/common/buttons/Icon.vue';
import SvgCross from '@/components/common/svg/Cross.vue';
import { AxiosError } from 'axios';
import { STATUS } from '@/store/interfaces/axios.interface';
import { apiTryRemoveUserAccess } from '@/api/agility-req';
import Swal from 'sweetalert2';

const props = defineProps<{
	roomId: string,
	user: UserCanvasList,
}>();

const userCanvas = ref(props.user);

const removeAccess = async (userId: string) => {
	try {
		const res = await apiTryRemoveUserAccess(userId, props.roomId);
		if (res.data.status === STATUS.OK) {

		}
	} catch(err) {
		if (err instanceof AxiosError) {
			console.error(err.message);
		}

		Swal.fire({
			icon: "error",
			title: "Unexepected error happened",
			text: "The user permission on this project could not be removed, please try again"
		})
	}
};
</script>