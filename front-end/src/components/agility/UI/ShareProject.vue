te<template>
	<ModalOverlay  v-if="showLogoutModal" @close="beforeModalClose" size="lg">
		<template #header>
			<FormField
				class="pb-3"
				label="Search a user"
				:limit="true"
				:char-limit="50"
				:char-number="userInput.length"
			>
				<input
					@input="onUserInput"
					v-model="userInput"
					maxlength="50"
					class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
				/>
			</FormField>
		</template>
		<template #body>
			<div class="flex flex-col w-full h-[400px] overflow-y-scroll gap-2 pt-2 ">
				<template v-if="filteredUser.length > 0">
					<div
						v-for="(user, index) in filteredUser"
						:key="`user_${index}`"
						class="px-2 py-2 w-full flex gap-2 items-center justify-between bg-light-secondary dark:bg-dark-secondary rounded-lg"
					>
						<div class="flex items-center gap-5">
							<img
								:src="user.picture || '/template-no-image.png'"
								class="w-12 h-12 rounded-full border border-dark-secondary"
								alt="profile_picture"
							/>
							<div class="flex flex-col gap-1">
								<span class="bold text-sm text-black dark:text-white font-bold">{{ user.firstName + " " + user.lastName }}</span>
								<span class="bold text-sm text-black dark:text-white text-[10px]">{{ user.groupName }}</span>
							</div>
						</div>
						<DefaultButton
							@click="sendInvitation(user.id)"
							type="button"
							text="Send invitation"
							color="text-white hover:text-white"
							text-style="text-white hover:text-white"
							background="bg-[#783676] hover:bg-[#a4418b]"
						/>
					</div>
				</template>
				<div v-else class="h-full w-full flex justify-center pt-5">
					<span>No user found...</span>
				</div>
			</div>
		</template>
	</ModalOverlay>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import DefaultButton from '@/components/common/buttons/Default.vue';
import ModalOverlay from '@/components/common/Modal.vue';
import FormField from '@/components/common/FormField.vue';
import { withErrorHandler } from '@/utils/storeHandler';
import { apiTryFetchUserListByRoom } from '@/api/user-req';
import { UserProfileList } from '@/store/interfaces/user.interface';

const route = useRoute();
const userInput = ref<string>("");
const filteredUser = ref<Array<UserProfileList>>([]);
const roomId = ref(route.path.match(/[^/]+$/)[0]);
let timer: NodeJS.Timeout;

const emit = defineEmits(['close']);

const showLogoutModal = ref(false);

const openUserListModal = () => showLogoutModal.value = true;
const closeUserListModal = () => showLogoutModal.value = false;

const beforeModalClose = () => {
	closeUserListModal();
	emit("close");
}

const sendInvitation = (userId: string) => {

}

const fetchQueryUser =  withErrorHandler(async function(user: string) {
	const res = await apiTryFetchUserListByRoom(roomId.value, user);
	if(res.data.status === 'ok') {
		filteredUser.value = res.data.users;
	}
})

const onUserInput = () => {
	if(userInput.value.length > 50)
		userInput.value = userInput.value.substring(0,50);

	clearTimeout(timer);
	timer = setTimeout(() => {
		clearTimeout(timer);
		timer = undefined;
		
		const user = userInput.value.trim().toLowerCase().replace(/ /g, '');
		if(user !== '') {
			fetchQueryUser(user);
		} else {
			filteredUser.value = [];
		}
	}, 300);
}

openUserListModal();
</script>