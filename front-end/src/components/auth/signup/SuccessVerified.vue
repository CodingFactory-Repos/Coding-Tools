<template>
	<div class="flex flex-col justify-center items-center w-full">
		<SvgGuard class="w-16 h-16 mb-2"/>
		<div class="flex flex-col justify-center items-center w-full gap-2">
			<h1 class="text-2xl font-extrabold leading-tight tracking-tight text-white">
				Verified
			</h1>
			<span class="text-lg font-light text-light-font text-center">
				You have successfully verified your account.
			</span>
		</div>
		<ButtonDefault
			@click="signIn"
			type="button"
			text="Log in to your account"
			text-style="text-black font-bold text-sm"
			background="bg-light-primary"
		/>
	</div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.store';
import SvgGuard from '@/components/common/svg/Guard.vue';
import ButtonDefault from '@/components/common/buttons/Default.vue';

const authStore = useAuthStore();
const router = useRouter();

const signIn = async () => {
	const success = await authStore.getCurrentUser();
	if(!success) return;
	router.push("/app/account");
}
</script>