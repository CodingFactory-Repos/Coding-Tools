<template>
	<ModalOverlay  v-if="showLogoutModal" @close="beforeModalClose" size="lg">
		<template #header>
			<span class="text-lg font-bold pb-2 text-black dark:text-white">Manage the users access</span>
		</template>
		<template #body>
			<div class="flex flex-col w-full h-[400px] overflow-y-scroll gap-2 pt-2 ">
				<template v-if="accessUsers.length > 0">
					<AccessUser
						v-for="(user, index) in accessUsers"
						:key="`user_${index}`"
						:user="user"
						:room-id="roomId"
					/>
				</template>
				<div v-else class="h-full w-full flex justify-center pt-5">
					<span class="text-black dark:text-white">No user found...</span>
				</div>
			</div>
		</template>
	</ModalOverlay>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import ModalOverlay from '@/components/common/Modal.vue';
import { withErrorHandler } from '@/utils/storeHandler';
import { UserCanvasList } from '@/store/interfaces/user.interface';
import { apiTryGetAccessUsers } from '@/api/agility-req';
import AccessUser from '@/components/agility/cards/AccessUser.vue';

const route = useRoute();
const accessUsers = ref<Array<UserCanvasList>>([]);
const roomId = ref(route.path.match(/[^/]+$/)[0]);

const emit = defineEmits(['close']);

const showLogoutModal = ref(false);

const openUserListModal = () => showLogoutModal.value = true;
const closeUserListModal = () => showLogoutModal.value = false;

const beforeModalClose = () => {
	closeUserListModal();
	emit("close");
}

const fetchAccessUsers = withErrorHandler(async function() {
	const res = await apiTryGetAccessUsers(roomId.value);
	if(res.data.status === 'ok') {
		accessUsers.value = res.data.users;
	}
})

fetchAccessUsers();
openUserListModal();
</script>