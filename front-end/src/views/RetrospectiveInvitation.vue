<template>
	<div class="flex w-full h-full justify-center items-center">
		<div class="flex flex-col justify-center items-center bg-light-primary dark:bg-dark-tertiary rounded-lg w-1/3 h-1/3 p-5">
			<span
				class="text-xl font-bold text-black dark:text-white"
				v-if="isLoading"
			>
				Loading...
			</span>
			<div
				class="flex flex-col gap-2 justify-center items-center w-full"
				v-else-if="success"
			>
				<SvgRoundCheck width="60" height="60" class="!fill-green-500 dakr:!fill-green-500"/>
				<span class="text-xl font-bold text-center text-black dark:text-white">You are now able to access the canvas project</span>
				<DefaultButton
					@click="gotoProject"
					class="mt-5"
					type="button"
					text="Join the project"
					color="text-black dark:text-white"
					text-style="text-black dark:text-white"
					background="bg-green-500 hover:bg-green-500"
				/>
			</div>
			<div
				class="flex flex-col gap-2 justify-center items-center w-full"
				v-else-if="!success"
			>
				<SvgWarning width="60" height="60" class="!fill-red-500 dakr:!fill-red-500"/>
				<span class="text-xl font-bold text-black dark:text-white">An error occured</span>
				<span class="text-center text-black dark:text-white">Please verify that the link you received is correct.</span>
				<span class="text-center text-black dark:text-white">If the problem persist, do not hesitate to contact the user that sent you the invitation.</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router';
import { computed, ref } from 'vue';

import { useAuthStore } from '@/store/modules/auth.store';
import SvgWarning from '@/components/common/svg/Warning.vue';
import SvgRoundCheck from '@/components/common/svg/RoundCheck.vue';
import DefaultButton from '@/components/common/buttons/Default.vue';
import { withErrorHandler } from '@/utils/storeHandler';
import { apiTryVerifyRetroInvitationToken } from '@/api/retrospective-req';
import { STATUS } from '@/store/interfaces/axios.interface';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isAuth = computed(() => authStore.isAuth);

const roomId = ref<string>();
const isLoading = ref(true);
const success = ref(false);

const verifyInvitationToken = withErrorHandler(async function(token: string) {
	const res = await apiTryVerifyRetroInvitationToken(token);
	if(res.data.status === STATUS.OK) {
		roomId.value = res.data.roomId;
		return true;
	}
	return false;
});

const gotoProject = () => {
	router.push(`/app/retrospective/${roomId.value}`);
}

let token: string;

if(isAuth.value && route.query && typeof route.query.token === "string") {
	token = route.query.token;
	const res = await verifyInvitationToken(token);
	success.value = !!res;
	isLoading.value = false;
} else {
	router.push('/app/retrospective');
}
</script>