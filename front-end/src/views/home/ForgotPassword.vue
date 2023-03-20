<template>
	<main class="w-full h-full flex items-center justify-center custom-background">
		<template v-if="token === undefined">
			<AskEmail @nextStep="nextStep" v-if="state === 0" />
			<SendEmail :email="email" v-else-if="state === 1" />
		</template>
		<ResetPassword v-else :token="token"/>
	</main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import AskEmail from '@/components/auth/forgot/AskEmail.vue';
import SendEmail from '@/components/auth/forgot/SendEmail.vue';
import ResetPassword from '@/components/auth/forgot/ResetPassword.vue';

const route = useRoute();

const token = ref<string>(undefined);
const email = ref("");
const state = ref(0);

const nextStep = (value: number, emailUser: string) => {
	state.value = value;
	email.value = emailUser;
};

onMounted(() => {
	if(route.query && typeof route.query.token === "string") {
		token.value = route.query.token;
	}
})
</script>

<style scoped>
main {
	width: 100%;
	display: flex;
}
</style>