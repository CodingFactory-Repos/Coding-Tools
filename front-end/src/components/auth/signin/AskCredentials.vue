<template>
	<div class="w-full flex items-center justify-center px-6 py-8 mx-auto lg:py-0 h-full">
		<div class="w-full rounded-lg dark:bg-dark-mode-primary shadow-lg md:mt-0 sm:max-w-md xl:p-0 glassmorphism">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white mb-8">
					Sign into your account
				</h1>
				<form class="space-y-4 md:space-y-6 h-fit" @submit.prevent="submitSignin">
					<div class="relative mb-8">
						<label for="email" class="block mb-2 text-sm font-medium text-white">
							Your email <span class="text-sm text-red-500 required-dot">*</span>
						</label>
						<input
							v-model="email"
							type="email"
							name="email"
							id="email"
							class="bg-light-secondary border text-black sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400"
							placeholder="jhon.doe@edu.esiee-it.fr"
							@focus="onNewFocus"
						/>
						<template v-if="errors.emailInvalid">
							<SvgWarning class="fill-red dark:fill-red absolute right-2 bottom-[10px]" />
							<p class="absolute text-sm text-red-500 -bottom-6">
								A correct email is required !
							</p>
						</template>
					</div>
					<div class="relative mb-8">
						<label for="password" class="block mb-2 text-sm font-medium text-white">
							Your password <span class="text-sm text-red-500 required-dot">*</span>
						</label>
						<input
							v-model="password"
							type="password"
							name="password"
							id="password"
							class="bg-light-secondary border text-black sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400"
							placeholder="••••••••"
							@focus="onNewFocus"
						>
						<template v-if="errors.passwordInvalid">
							<SvgWarning class="fill-red dark:fill-red absolute right-2 bottom-[10px]" />
							<p class="absolute text-sm text-red-500 -bottom-6">
								The password is required !
							</p>
						</template>
					</div>
					<p class="text-sm font-light text-white">
						Forgot your password ?
						<RouterLink to="/forgot-password" class="font-medium text-white hover:underline dark:text-white underline">
							Go here
						</RouterLink>
					</p>
					<p v-if="errors.apiError" class="w-full text-center text-sm text-red-500 -bottom-6">
						The password or the email is invalid.
					</p>
					<div class="flex justify-center">
						<ButtonDefault
							text="Sign me in"
							type="submit"
							class="w-full"
							background="gradiant"
							text-style="text-white"
						/>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/store/modules/auth.store';
import { FORMAT_EMAIL, FORMAT_PASSWORD } from '@/utils/constants';
import ButtonDefault from '@/components/common/buttons/Default.vue';
import SvgWarning from '@/components/common/svg/Warning.vue';

const router = useRouter();
const authStore = useAuthStore();

const initialState = {
	apiError: false,
	emailInvalid: false,
	passwordInvalid: false,
}

const errors = reactive({...initialState});
const password = ref("");
const email = ref("");

const submitSignin = async () => {
	if (!FORMAT_EMAIL.test(email.value) || email.value.length > 70) {
		errors.emailInvalid = true;
	} else {
		errors.emailInvalid = false;
	}

	if (!FORMAT_PASSWORD.test(password.value) || password.value.length > 50) {
		errors.passwordInvalid = true;
	} else {
		errors.passwordInvalid = false;
	}

	if (!errors.emailInvalid && !errors.passwordInvalid) {
		const success = await authStore.signin({
			email: email.value,
			password: password.value
		})

		if(!success) return errors.apiError = true;
		router.push('/app/account');
	}
}

const onNewFocus = () => {
	Object.assign(errors, {...initialState});
}
</script>