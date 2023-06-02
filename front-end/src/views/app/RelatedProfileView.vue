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

					<AcccountRelatedProfile
						:groupName="schoolProfile.groupName"
						:relatedProfiles="relatedProfiles"
					/>
				</div>
			</div>
		</div>
	</main>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import AccountProfile from '@/components/account/AccountProfile.vue';
import AccountHeader from '@/components/account/AccountHeader.vue';
import AcccountRelatedProfile from '@/components/account/AccountRelatedProfile.vue';
import { UserProfile, UserSchoolProfile, UserBusinessProfile } from '@/store/interfaces/auth.interfaces';
import { useUserStore } from '@/store/modules/user.store';
import { useRoute } from 'vue-router';

const userStore = useUserStore();

const userProfileData = computed(() => userStore.relatedUserProfile);
const relatedProfiles = computed(() => userProfileData.value.related ?? []);
const user = computed(() => userProfileData.value.user ?? {});
const userId = ref<string>(null);

const role = computed(() => user.value.role);
const profile = computed(() => user.value.profile ?? {} as Partial<UserProfile>);
const schoolProfile = computed(() => user.value.schoolProfile ?? {} as Partial<UserSchoolProfile>);
const businessProfile = computed(() => user.value.businessProfile ?? {} as Partial<UserBusinessProfile>);
const profileBackground = computed(() => profile.value?.background ?? "/template-no-image.png");

const route = useRoute();

watch(route, val => {
	if(val.path === "/app/account") return;

	try {
		const id = val.path.match(/[^/]+$/)[0];
		userId.value = id;
		userStore.getRelatedUserProfile(id);
	} catch(err) {
		if(err instanceof Error) {
			console.error(err);
		}
	}
}, { immediate: true })
</script>