<template>
	<section class="w-full mt-24">
		<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
			<div class="w-full shadow-lg md:mt-0 sm:max-w-md xl:p-0 glassmorphism">
				<div class="w-full p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 class="mb-2 text-2xl font-extrabold tracking-tight text-black leding-tight text-white text-center">
						Change your password
					</h1>
					<p class="font-light text-white text-center">
						We emailed you a link to 
						<span class="font-medium text-black text-white">{{ email }}</span>
						<br/>
						Click on the link to change your password.
					</p>

					<hr class="w-full h-2"/>
					<div class="w-full flex justify-center">
						<ButtonDefault
							text="Send me another email"
							class="w-full flex flex-col sm:flex-row"
							:class="{ 'cursor-not-allowed': !canSendEmail }"
							background="gradiant"
							text-style="text-white"
							@click="sendAnotherEmail"
							:disabled="!canSendEmail"
						>
							<span class="font-light text-white text-center">Email not Received ?</span>
						</ButtonDefault>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/modules/auth.store';
import ButtonDefault from '@/components/common/buttons/Default.vue';

const props = defineProps({
	email: { type: String, required: true },
})

const authStore = useAuthStore();
const canSendEmail = ref(true);

const sendAnotherEmail = () => {
	canSendEmail.value = false;
	authStore.forgotPassword(props.email)
	setTimeout(() => canSendEmail.value = true, 10000);
}
</script>