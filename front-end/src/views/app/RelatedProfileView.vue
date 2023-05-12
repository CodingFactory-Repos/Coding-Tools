<template>
	<main class="grow relative w-full flex items-start justify-center mb-6">
		<div class="absolute top-0 w-full h-80 z-0">
			<div class="relative w-full h-full flex items-start justify-center overflow-hidden">
				<img class="absolute object-fill w-full" :src="profileBackground" alt="user_background">
			</div>
		</div>
		<div class="sm:mx-6 mt-60 grow w-full calculated-height flex items-center justify-start z-10">
			<div class="grow w-full h-full flex flex-col items-center justify-start bg-light-tertiary dark:bg-dark-tertiary rounded-lg shadow gap-0">
				<AccountHeader
					:profile="profile"
					:schoolProfile="schoolProfile"
					:canEdit="false"
					:edit="false"
				/>
				<div class="w-full h-full p-4 flex flex-row gap-3 items-start justify-start flex-col sm:flex-row min-h-[420px]">
					<AccountProfile
						:profile="profile"
						:schoolProfile="schoolProfile"
						:businessProfile="businessProfile"
						:id="userId"
						:role="role"
					/>

					<div class="flex h-full flex-col gap-3 w-full sm:w-fit">
						<div class="h-full flex flex-col rounded-lg bg-light-primary dark:bg-dark-highlight min-w-[300px] min-h-[388px] overflow-y-scroll p-2 w-full">
							<span class="w-full flex justify-center text-sm pb-2 text-black dark:text-white">{{ schoolProfile.groupName }}</span>
							<hr class="w-full pb-4 dark:border-dark-tertiary"/>
							<template v-if="relatedProfile.length > 0">
								<div
									v-for="(relatedUser, index) in relatedProfile"
									:key="`related_user_${index}`"
									@click="viewRelatedUserProfile(relatedUser.id)"
									class="px-2 py-2 w-full flex gap-5 items-center bg-light-tertiary dark:bg-dark-tertiary rounded-lg cursor-pointer hover:scale-[1.02] transition-transform"
								>
									<img
										:src="relatedUser.picture || '/template-no-image.png'"
										class="w-12 h-12 rounded-full border border-dark-secondary"
										alt="profile_picture"
									/>
									<span class="bold text-sm text-black dark:text-white">{{ relatedUser.firstName + " " + relatedUser.lastName }}</span>
								</div>
							</template>
							<div v-else class="w-full h-full flex justify-center items-center">
								No related profile found..
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import AccountProfile from '@/components/account/AccountProfile.vue';
import AccountHeader from '@/components/account/AccountHeader.vue';
import { UserProfile, UserSchoolProfile, UserBusinessProfile, User } from '@/store/interfaces/auth.interfaces';
import { useUserStore } from '@/store/modules/user.store';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.store';

const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

const userProfileData = computed(() => userStore.relatedUserProfile);
const relatedProfile = computed(() => userProfileData.value.related ?? []);
const user = computed(() => userProfileData.value.user ?? {});
const userId = ref<string>(null);

const role = computed(() => user.value.role);
const profile = computed(() => user.value.profile ?? {} as Partial<UserProfile>);
const schoolProfile = computed(() => user.value.schoolProfile ?? {} as Partial<UserSchoolProfile>);
const businessProfile = computed(() => user.value.businessProfile ?? {} as Partial<UserBusinessProfile>);
const profileBackground = computed(() => profile.value?.background ?? "/template-no-image.png");

const viewRelatedUserProfile = (id: string) => {
	if(id !== authStore.user._id) {
		router.push(`/app/account/${id}`);
	} else {
		router.push("/app/account")
	}
}

onMounted(async () => {
	try {
		const route = useRoute();
		const id = route.path.match(/[^/]+$/)[0];
		userId.value = id;
		userStore.getRelatedUserProfile(id);
	} catch(err) {
		if(err instanceof Error) {
			console.error(err);
		}
	}
})
</script>