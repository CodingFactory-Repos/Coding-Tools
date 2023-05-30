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
		<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="openConfirmModal">
			<SvgCross width="22" height="22" class="!fill-gray-400 hover:dark:!fill-red-600"/>
		</IconButton>
	</div>
	<ModalOverlay v-if="showConfirmModal" @close="closeConfirmModal" size="sm">
		<template #body>
			<div class="flex flex-col gap-4 items-center justify-center pt-3">
				<h2 class="font-bold text-black dark:text-light-font text-center pt-3">This action is not reversible, are you sure you want to remove the project access of this user ?</h2>
				<div class="flex gap-5">
					<DefaultButton
						@click="closeConfirmModal"
						text="Cancel"
						text-style="text-black dark:text-black font-bold text-sm"
						background="bg-light-secondary hover:bg-light-tertiary"
					/>
					<DefaultButton
						@click="removeAccess(userCanvas.id)"
						text="Yes"
						text-style="text-white dark:text-white font-bold text-sm"
						background="bg-red-500 hover:bg-red-600"
					/>
				</div>
			</div>
		</template>
	</ModalOverlay>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { AxiosError } from 'axios';
import Swal from 'sweetalert2';

import { UserCanvasList } from '@/store/interfaces/user.interface';
import IconButton from '@/components/common/buttons/Icon.vue';
import SvgCross from '@/components/common/svg/Cross.vue';
import { STATUS } from '@/store/interfaces/axios.interface';
import { apiTryRemoveUserAccess } from '@/api/agility-req';
import DefaultButton from '@/components/common/buttons/Default.vue';
import ModalOverlay from '@/components/common/Modal.vue';

const props = defineProps<{
	roomId: string,
	user: UserCanvasList,
}>();

const emits = defineEmits<{
	(e: 'remove-access', user: UserCanvasList)
}>();

const userCanvas = ref(props.user);
const showConfirmModal = ref(false);
const openConfirmModal = () => { showConfirmModal.value = true };
const closeConfirmModal = () => { showConfirmModal.value = false };

const removeAccess = async (userId: string) => {
	try {
		const res = await apiTryRemoveUserAccess(userId, props.roomId);
		if (res.data.status === STATUS.OK) {
			emits("remove-access", userCanvas.value);
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