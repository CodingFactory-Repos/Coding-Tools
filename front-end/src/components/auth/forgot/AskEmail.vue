<template>
	<section class="w-full mt-24">
		<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
			<div class="w-full dark:bg-dark-mode-primary rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0 glassmorphism">
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
						Forgot password
					</h1>
					<form class="space-y-4 md:space-y-6" @submit.prevent="submitForgetPassword">
						<div class="relative mb-8">
							<label for="email" class="block mb-2 text-sm font-medium text-white">
								Your Email <span class="text-sm text-red-500 required-dot">*</span>
							</label>
							<input
								v-model="email"
								type="email"
								name="email"
								id="email"
								class="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400"
								placeholder="jhon.doe@edu.esiee-it.fr"
								@focus="onNewFocus"
							/>
							<template v-if="emailError">
								<SvgWarning class="absolute right-2 bottom-[10px]" />
								<p class="absolute text-sm text-red-500 -bottom-6">
									{{ errorMessage }}
								</p>
							</template>
						</div>
						<div class="flex justify-center">
							<ButtonDefault
								text="Reset my password"
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
import { ref, reactive, computed } from 'vue';
import { FORMAT_EMAIL } from '@/utils/constants';
import { useAuthStore } from '@/store/modules/auth.store';
import ButtonDefault from '@/components/common/buttons/Default.vue';

const emit = defineEmits<{
	(event: 'nextStep', id: number, email: string): void,
}>()

const authStore = useAuthStore();

const initialState = {
	apiError: false,
	emailInvalid: false,
}

const email = ref("");
const errors = reactive({...initialState});

const emailError = computed(() => errors.apiError || errors.emailInvalid );
const errorMessage = computed(() => {
	const invalid = errors.apiError ? "The email is invalid." : undefined;
	const format = errors.emailInvalid ? "The email is required !" : undefined;
	return invalid || format;
})

const submitForgetPassword = async () => {
	if(!FORMAT_EMAIL.test(email.value) || email.value.length > 70) {
		errors.emailInvalid = true;
	} else {
		errors.emailInvalid = false;
	}

	if(!errors.emailInvalid) {
		const success = await authStore.forgotPassword(email.value);
		if(!success) return errors.apiError = true;
		emit('nextStep', 1, email.value);
	}
}

const onNewFocus = () => {
	Object.assign(errors, {...initialState});
}
</script>