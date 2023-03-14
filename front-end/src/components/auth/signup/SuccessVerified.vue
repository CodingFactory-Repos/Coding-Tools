<template>
	<div class="flex flex-col justify-center items-center w-full">
		<SvgGuard class="w-16 h-16 mb-2"/>
		<div class="flex flex-col justify-center items-center w-full gap-2">
			<h1 class="text-2xl font-extrabold leading-tight tracking-tight text-white">
				Verified
			</h1>
			<span class="text-lg font-light text-gray-300 text-center">
				You have successfully verified your account.
			</span>
		</div>
		<ButtonDefault
			@click="signIn"
			type="button"
			text="Log in to your account"
			text-style="text-gray-700 font-bold text-sm"
			background="bg-white"
		/>
	</div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/store/modules/auth.store';
import SvgGuard from '@/components/common/svg/Guard.vue';
import ButtonDefault from '@/components/common/buttons/Default.vue';

const authStore = useAuthStore();

const signIn = async () => {
	await authStore.getCurrentUser();
}
</script>