<template>
	<ModalOverlay  v-if="showLogoutModal" @close="beforeModalClose" size="sm">
		<template #body>
			<div class="flex flex-col items-center justify-center pt-3">
				<h2 class="font-bold">Confirm that you want to logout</h2>
				<div class="flex gap-5">
					<ButtonDefault
						@click="beforeModalClose"
						text="Cancel"
						text-style="text-black dark:text-black font-bold text-sm"
						background="bg-light-secondary hover:bg-light-tertiary"
					/>
					<ButtonDefault
						@click="logout"
						text="Logout"
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
import { useRouter } from 'vue-router';

import ButtonDefault from '@/components/common/buttons/Default.vue';
import ModalOverlay from '@/components/common/Modal.vue';
import { useAuthStore } from '@/store/modules/auth.store';

const emit = defineEmits(['close']);

const router = useRouter();
const authStore = useAuthStore();

const showLogoutModal = ref(false);

const openMetaModal = () => showLogoutModal.value = true;
const closeMetaModal = () => showLogoutModal.value = false;

const beforeModalClose = () => {
	closeMetaModal();
	emit("close");
}

const logout = async () => {
	await authStore.logout();
	beforeModalClose();
	router.push('/signin')
}

openMetaModal();
</script>