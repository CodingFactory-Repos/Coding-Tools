<template>
	<main class="relative w-full h-full flex items-center justify-center">
		<div class="absolute top-0 w-full h-80 z-0">
			<div class="relative w-full h-full flex items-start justify-center overflow-hidden">
				<img class="absolute object-fill w-full" :src="profileBackground" alt="user_background">
			</div>
		</div>
		<div class="flex items-start justify-center px-6 pt-56 h-full w-full z-10">
			<div class="grow w-full flex flex-col items-center justify-start bg-light-tertiary dark:bg-dark-tertiary rounded-lg shadow gap-0">
				<AccountHeader
					:profile="profile"
					:schoolProfile="schoolProfile"
					@edit="openAccountForm"
				/>
				<AccountProfile
					v-if="!editActive"
					:profile="profile"
					:businessProfile="businessProfile"
				/>
				<AccountForm
					v-else
					:profile="profile"
					:schoolProfile="schoolProfile"
					:businessProfile="businessProfile"
					@edit="closeAccountForm"
				/>
			</div>
		</div>
	</main>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useAuthStore } from '@/store/modules/auth.store';
import AccountProfile from '@/components/account/AccountProfile.vue';
import AccountForm from '@/components/account/AccountForm.vue';
import AccountHeader from '@/components/account/AccountHeader.vue';

const authStore = useAuthStore();

const user = computed(() => authStore.user);
const profile = computed(() => user.value.profile);
const schoolProfile = computed(() => user.value.schoolProfile);
const businessProfile = computed(() => user.value.businessProfile);
const profileBackground = computed(() => profile.value?.profileBackground || "https://weraveyou.com/wp-content/uploads/2022/08/Underground-Party-Rave.jpg");

const editActive = ref(false);
const openAccountForm = () => {
	editActive.value = true;
}
const closeAccountForm = () => {
	editActive.value = false;
}
</script>

<style>
.h-64 {
	height: 16rem;
}
</style>