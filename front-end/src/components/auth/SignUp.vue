<template>
	<section>
		<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
			<a
				href="#"
				class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
			>
				<img
					class="w-8 h-8 mr-2"
					src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
					alt="logo"
				/>
				LOGO
			</a>
			<div
				class="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700"
			>
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1
						class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
					>
						Create a new account
					</h1>
					<form class="space-y-4 md:space-y-6" @submit.prevent="trySubmit">
						<div>
							<label for="fn" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>Your firstname</label
							>
							<input
								v-model="signup.firstName"
								type="text"
								name="fn"
								id="fn"
								placeholder="Sonia"
								class="bg-gray-50 outline-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								:required="true"
							/>
						</div>
						<div>
							<label for="ln" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>Your lastname</label
							>
							<input
								v-model="signup.lastName"
								type="text"
								name="ln"
								id="ln"
								placeholder="Suresh"
								class="bg-gray-50 outline-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								:required="true"
							/>
						</div>
						<div>
							<label
								for="email"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>Your email</label
							>
							<input
								v-model="signup.email"
								type="email"
								name="email"
								id="email"
								placeholder="name@company.com"
								class="bg-gray-50 outline-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								:required="true"
							/>
						</div>
						<div>
							<label
								for="password"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>Password</label
							>
							<input
								v-model="signup.password"
								type="password"
								name="password"
								id="password"
								placeholder="••••••••"
								class="bg-gray-50 outline-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								:required="true"
							/>
						</div>
						<button
							class="bg-sky-700 hover:bg-sky-600 text-white font-bold mt-5 py-2 px-4 rounded-lg focus:ring-4 focus:outline-none focus:ring-primary-300"
						>
							Button
						</button>
						<p class="text-sm font-light text-gray-500 dark:text-gray-400">
							Already have an account ?
							<router-link
								to="/signin"
								class="font-medium text-primary-600 hover:underline text-sky-800 dark:text-primary-500"
								>Sign in</router-link
							>
						</p>
					</form>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { isEmpty } from '@/utils/helpers/string.helper';
import { defineComponent, reactive } from 'vue';

import { useAuthStore } from '@/store/modules/auth.store';

export default defineComponent({
	setup() {
		const authStore = useAuthStore();

		const defaultReactive = {
			firstName: '',
			lastName: '',
			password: '',
			email: '',
		};

		const error = reactive(defaultReactive);
		const signup = reactive(defaultReactive);

		const trySubmit = () => {
			let isValid = true;

			if (isEmpty(signup.firstName)) {
				error.firstName = 'firstName is invalid';
				isValid = false;
			}

			if (isEmpty(signup.lastName)) {
				error.lastName = 'lastName is invalid';
				isValid = false;
			}

			if (isEmpty(signup.email)) {
				error.email = 'email is invalid';
				isValid = false;
			}

			if (isEmpty(signup.password)) {
				error.password = 'password is invalid';
				isValid = false;
			}

			if (!isValid) return;

			error.email = defaultReactive.email;
			error.password = defaultReactive.password;
			authStore.trySignup({ ...signup, status: 0 });
		};

		return {
			trySubmit,
			isEmpty,
			signup,
			error,
		};
	},
});
</script>
