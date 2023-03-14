<template>
	<section class="w-full mt-24">
		<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
			<div class="w-full shadow-lg md:mt-0 sm:max-w-md xl:p-0 glassmorphism">
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
						Your new password
					</h1>
					<form class="space-y-4 md:space-y-6" @submit.prevent="submitNewPassword">
						<div class="relative mb-8">
							<label for="password" class="block mb-2 text-sm font-medium text-white">
								Your Email <span class="text-sm text-red-500 required-dot">*</span>
							</label>
							<input
								v-model="password"
								type="password"
								name="password"
								id="password"
								class="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400"
								placeholder="jhon.doe@edu.esiee-it.fr"
								@focus="onNewFocus"
							/>
							<template v-if="passwordError">
								<SvgWarning class="absolute right-2 bottom-[10px]" />
								<p class="absolute text-sm text-red-500 -bottom-6">
									{{ errorMessage }}
								</p>
							</template>
						</div>
						<div class="flex justify-center">
							<ButtonDefault
								text="Confirm"
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
	</section>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { FORMAT_PASSWORD } from '@/utils/constants';
import { useAuthStore } from '@/store/modules/auth.store';
import ButtonDefault from '@/components/common/buttons/Default.vue';

const props = defineProps({
	token: { type: String, required: true },
})

const authStore = useAuthStore();
const router = useRouter();

const initialState = {
	apiError: false,
	passwordInvalid: false,
}

const password = ref("");
const errors = reactive({...initialState});

const passwordError = computed(() => errors.apiError || errors.passwordInvalid );
const errorMessage = computed(() => {
	const invalid = errors.apiError ? "The password is invalid." : undefined;
	const format = errors.passwordInvalid ? "The password is required !" : undefined;
	return invalid || format;
})

const submitNewPassword = async () => {
	if(!FORMAT_PASSWORD.test(password.value) || password.value.length > 50) {
		errors.passwordInvalid = true;
	} else {
		errors.passwordInvalid = false;
	}

	if(!errors.passwordInvalid) {
		const success = authStore.sendNewPassword(password.value, props.token);
		if(!success) return errors.apiError = true;
		router.push('/signin');
	}
}

const onNewFocus = () => {
	Object.assign(errors, {...initialState});
}
</script>