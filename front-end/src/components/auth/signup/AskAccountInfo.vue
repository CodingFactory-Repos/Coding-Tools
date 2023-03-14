<template>
	<div class="flex flex-col justify-center items-center w-full">
		<h1 class="text-2xl font-extrabold leading-tight tracking-tight text-white">
			Account details
		</h1>
		<form class="w-full max-w-md" @submit.prevent="submitSignup">
			<div class="grid gap-5 sm:grid-cols-1 mb-4">
				<div class="relative mb-4">
					<label for="email" class="block mb-2 text-sm font-medium text-white">
						Your email <span class="text-sm text-red-500 required-dot">*</span>
					</label>
					<input
						v-model="email"
						type="email"
						name="email"
						id="email"
						class="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400"
						placeholder="jhon.doe@edu.esiee-it.fr"
						required
						@focus="onNewFocus"
					>
					<template v-if="errors.emailInvalid">
						<SvgWarning class="absolute right-2 bottom-[10px]" />
						<p class="absolute text-sm text-red-500 -bottom-6">
							A correct email is required !
						</p>
					</template>
				</div>
				<div class="relative mb-4">
					<label
						for="password"
						class="block mb-2 text-sm font-medium text-white"
					>
						Password <span class="text-sm text-red-500 required-dot">*</span>
					</label>
					<input
						v-model="password"
						type="password"
						name="password"
						id="password"
						placeholder="••••••••"
						class="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400"
						required
						@focus="onNewFocus"
					>
					<template v-if="errors.passwordInvalid">
						<SvgWarning class="absolute right-2 bottom-[10px]" />
						<p class="absolute text-sm text-red-500 -bottom-6">
							A correct password is required !
						</p>
					</template>
				</div>
				<div class="relative mb-4">
					<label
						for="confirm-password"
						class="block mb-2 text-sm font-medium text-white"
					>
						Confirm password <span class="text-sm text-red-500 required-dot">*</span>
					</label>
					<input
						v-model="confirmPassword"
						type="password"
						name="confirm-password"
						id="confirm-password"
						placeholder="••••••••"
						class="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400"
						required
						@focus="onNewFocus"
					>
					<template v-if="errors.passwordInequal">
						<SvgWarning class="absolute right-2 bottom-[10px]" />
						<p class="absolute text-sm text-red-500 -bottom-6">
							The passwords doesn't match !
						</p>
					</template>
				</div>
				<p v-if="errors.apiError" class="w-full text-center text-sm text-red-500 -bottom-6 mb-6">
					The email or the password is not valid.
				</p>
			</div>
			<div class="flex space-x-3">
				<ButtonDefault
					@click="$emit('nextStep', 0)"
					type="button"
					text="Prev: Profile Info"
					class="w-full"
					text-style="text-gray-700 font-bold text-sm"
					background="bg-white hover:bg-gray-200"
				/>

				<ButtonDefault
					type="submit"
					text="Next: Confirmation"
					class="w-full"
					:class="{ 'cursor-not-allowed': !canSubmitForm, 'gradiant': canSubmitForm }"
					text-style="text-white font-bold text-sm"
					background="bg-white"
					:disabled="!canSubmitForm"
				/>
			</div>
		</form>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, reactive, computed } from 'vue';

import { useAuthStore } from '@/store/modules/auth.store';
import { FORMAT_EMAIL, FORMAT_PASSWORD } from '@/utils/constants';
import ButtonDefault from '@/components/common/buttons/Default.vue';
import SvgWarning from '@/components/common/svg/Warning.vue';

const emit = defineEmits<{
	(event: 'nextStep', id: number): void
}>();

const authStore = useAuthStore();

const initialState = {
	apiError: false,
	emailInvalid: false,
	passwordInvalid: false,
	passwordInequal: false,
}

const errors = reactive({...initialState});
const confirmPassword = ref("");
const password = ref("");
const email = ref("");

const canSubmitForm = computed(() => email.value && password.value && confirmPassword.value);

watch(email, value => { authStore.tempAuthUser.email = value });
watch(password, value => { authStore.tempAuthUser.password = value });

const submitSignup = async () => {
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

	if (confirmPassword.value !== password.value) {
		errors.passwordInequal = true;
	} else {
		errors.passwordInequal = false;
	}

	if (!errors.emailInvalid && !errors.passwordInvalid && !errors.passwordInequal) {
		authStore.tempAuthUser.email = email.value;
		authStore.tempAuthUser.password = password.value;

		const success = await authStore.signup({
			email: email.value,
			password: password.value,
			userType: authStore.tempAuthUser.userType,
		})

		if(!success) return errors.apiError = true;
		emit('nextStep', 2);
	}
}

onMounted(() => {
	email.value = authStore.tempAuthUser?.email || "";
	password.value = authStore.tempAuthUser?.password || "";
})

const onNewFocus = () => {
	Object.assign(errors, {...initialState});
}
</script>