<template>
	<div class="flex flex-col justify-center items-center w-full">
		<div class="flex flex-col justify-center items-center w-full gap-2">
			<h1 class="text-2xl font-extrabold leading-tight tracking-tight text-white">
				Verify your email address
			</h1>
			<span class="text-lg font-light text-light-font text-center">
				We emailed you a six-digit code to <span class="font-medium text-white">{{ emailToSend }}</span>.
			</span>
			<span class="text-lg font-light text-light-font text-center">
				Enter the code below to confirm your email address.
			</span>
		</div>
		<form class="w-full max-w-md" @submit.prevent="submitCheckCode">
			<div class="flex mb-6 mt-2 space-x-2 sm:space-x-4 justify-center items-center">
				<div v-for="index in activationToken.length"
					:key="`n_${index}`"
				>
					<label :for="`code-${index}`" class="sr-only">
						Number {{ index }}
					</label>
					<input
						:id="`code-${index}`"
						:value="activationToken[index-1]"
						maxlength="1"
						type="text"
						required
						class="block text-white w-10 h-10 sm:w-14 sm:h-14 text-2xl sm:text-4xl font-extrabold text-center bg-transparent border border-light-primary rounded-lg py-3 sm:py-4 focus:ring-primary-500 focus:border-primary-500"
						@input="addCode($event, index - 1)"
						@keydown="keysHandler($event, index - 1)"
					>
				</div>
			</div>
			<p class="p-2 mb-4 text-sm text-white rounded-lg bg-red-500 text-center">
				Make sure to keep this window open while you retrieve the code in your email inbox. (You can copy/paste)
			</p>
			<div class="flex flex-col-reverse sm:flex-row justify-center items-center gap-4">
				<ButtonDefault
					@click.stop="sendAnotherEmail"
					type="button"
					text="Send me another Email"
					class="w-full flex flex-col gap-0"
					text-style="text-black font-bold text-xs"
					background="bg-light-primary hover:bg-light-secondary"
					:disabled="disableRequestEmail"
				>
					<span class="text-black font-bold text-xs">Email not received ?</span>
				</ButtonDefault>
				<ButtonDefault
					text="Verify Account"
					type="submit"
					class="w-full h-12"
					:class="{ 'cursor-not-allowed': !canVerifyAccount, 'gradiant': canVerifyAccount }"
					text-style="text-white font-bold text-sm"
					background="bg-light-primary"
					:disabled="!canVerifyAccount"
				/>
			</div>
		</form>
	</div>
</template>

<script lang="ts" setup>
import Swal from 'sweetalert2';
import { computed, ref, onMounted, nextTick, onUnmounted, watch } from 'vue';

import { useAuthStore } from '@/store/modules/auth.store';
import ButtonDefault from '@/components/common/buttons/Default.vue';
import { isEmpty } from '@/utils/string.helper';

const emit = defineEmits<{
	(event: 'nextStep', id: number): void
}>();

const authStore = useAuthStore();

const emailToSend = computed(() => authStore.tempEmailUser);

const canVerifyAccount = ref(false);
const disableRequestEmail = ref(false);
const activationToken = ref(["", "", "", "", "", ""]);

watch(activationToken, val => {
	const code = val.join("");
	canVerifyAccount.value = code.length === 6;
})

const addCode = (ev: Event, index: number) => {
	const input = <HTMLInputElement> ev.target;
	const next = <HTMLDivElement> input.parentNode.nextSibling;
	const isInRange = index >= 0 && index < activationToken.value.length;
	const empty = isEmpty(input.value);

	if (!empty && isInRange) {
		activationToken.value[index] = input.value;

		if(next && index < activationToken.value.length - 1) {
			nextTick(() => {
				const childInput = <HTMLInputElement> next.children[1];
				childInput.focus();
			})
		}
	}
	else if (empty) {
		activationToken.value[index] = "";
	}
};

const keysHandler = (ev: KeyboardEvent, index: number) => {
	const key = ev.key;
	const input = <HTMLInputElement> ev.target;
	const prev = <HTMLDivElement> input.parentNode.previousSibling;
	const next = <HTMLDivElement> input.parentNode.nextSibling;
	const isInRange = index >= 0 && index < activationToken.value.length;

	if(key === "ArrowRight" && next) {
		const childInput = <HTMLInputElement> next.children[1];
		childInput.focus();
		return;
	} else if (key === "ArrowLeft" && prev) {
		const childInput = <HTMLInputElement> prev.children[1];
		childInput.focus();
		return;
	}

	if (key === "Backspace" && isInRange) {
		ev.preventDefault();
		activationToken.value.splice(index, 1, "");

		if(prev && index > 0) {
			nextTick(() => {
				const childInput = <HTMLInputElement> prev.children[1];
				childInput.focus();
			});
		}
	}
};

const submitCheckCode = async () => {
	const token = activationToken.value.join("");
	if(token.length !== 6) return;

	const success = await authStore.verifyCodeToken(token);
	if(success) {
		emit('nextStep', 3)
	} else {
		Swal.fire({
			title: "Invalid code",
			text: "The code you provided is not valid !",
			icon: 'error'
		});
	}
}

const onPasteCode = (ev: ClipboardEvent) => {
	const value = ev.clipboardData.getData('text')?.trim();
	if(isEmpty(value) || value.length < 6) return;

	if(value.length > 6) {
		Swal.fire({
			title: "Code length is too short.",
			text: "Go back to your email and copy the 6 characters verification code.",
			icon: 'error'
		});
		return;
	}

	activationToken.value = value.split("");
}

onMounted(() => {
	window.addEventListener("paste", onPasteCode);
})

onUnmounted(() => {
	window.removeEventListener("paste", onPasteCode);
}) 

const sendAnotherEmail = async () => {
	await authStore.sendAnotherEmail(emailToSend.value);
	disableRequestEmail.value = true;
	setTimeout(() => disableRequestEmail.value = false, 10000);
};
</script>
