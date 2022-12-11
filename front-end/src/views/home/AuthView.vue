<template>
	<div class="grid w-full h-full content-center justify-items-center">
		<SignIn v-if="isSignIn" />
		<SignUp v-else />
	</div>
</template>

<script lang="ts" setup>
import SignIn from '@/components/auth/SignIn.vue';
import SignUp from '@/components/auth/SignUp.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isSignIn = computed(() => route.path === '/signin');
</script>
