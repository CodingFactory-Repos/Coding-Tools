<template>
	<main class="grow relative w-full flex items-start justify-center mb-6">
		<div class="absolute top-0 w-full h-80 z-0">
			<div class="relative w-full h-full flex items-start justify-center overflow-hidden">
				<img class="absolute object-fill w-full" :src="pictureUrl || tempPicture || profileBackground" alt="user_background">
				<FileUploader
					class="z-20"
					v-if="editActive"
					ref="fileUploaderREF"
					@onFileChange="imageChanged"
					@onFileUploaded="imageUploaded"
				/>
			</div>
		</div>
		<div class="sm:mx-6 mt-60 grow w-full calculated-height flex items-center justify-start z-10">
			<div class="grow w-full h-full flex flex-col items-center justify-start bg-light-tertiary dark:bg-dark-tertiary rounded-lg shadow gap-0">
				<AccountHeader
					:profile="profile"
					:schoolProfile="schoolProfile"
					:canEdit="true"
					:edit="editActive"
					@open="toggleAccountForm(true)"
					@close="toggleAccountForm(false)"
				/>
				<div class="w-full h-full p-4 flex flex-row gap-3 items-start justify-start flex-col sm:flex-row min-h-[420px]" v-if="!editActive">
					<AccountProfile
						:profile="profile"
						:schoolProfile="schoolProfile"
						:businessProfile="businessProfile"
						:id="userId"
						:role="role"
					/>

					<div class="flex h-full flex-col gap-3 w-full sm:w-fit ">
						<!-- <div class="stat-svg grow" v-html="svgGithubLanguages"/> -->
						<div class="h-full flex flex-col rounded-lg bg-light-primary dark:bg-dark-highlight min-w-[300px] min-h-[388px] overflow-y-scroll p-2 w-full">
							<span class="w-full flex justify-center text-sm pb-2">{{ schoolProfile.groupName }}</span>
							<template v-if="relatedProfile.length > 0">
								<div
									v-for="(relatedUser, index) in relatedProfile"
									:key="`related_user_${index}`"
									@click="viewRelatedUserProfile(relatedUser.id)"
									class="px-2 py-2 w-full flex gap-5 items-center bg-dark-tertiary rounded-lg cursor-pointer hover:scale-[1.02] transition-all"
								>
									<img
										:src="relatedUser.picture || '/template-no-image.png'"
										class="w-12 h-12 rounded-full"
										alt="profile_picture"
									/>
									<span class="bold text-sm">{{ relatedUser.firstName + " " + relatedUser.lastName }}</span>
								</div>
							</template>
							<div v-else class="w-full h-full flex justify-center items-center">
								No related profile found..
							</div>
						</div>
					</div>
				</div>
				<AccountForm
					v-else
					:profile="profile"
					:schoolProfile="schoolProfile"
					:businessProfile="businessProfile"
					:role="role"
					@close="toggleAccountForm(false)"
				/>
			</div>
		</div>
	</main>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from 'vue';

import { useAuthStore } from '@/store/modules/auth.store';
import AccountProfile from '@/components/account/AccountProfile.vue';
import AccountForm from '@/components/account/AccountForm.vue';
import AccountHeader from '@/components/account/AccountHeader.vue';
import FileUploader from '@/components/common/FileUploader.vue';
import { UserProfile, UserSchoolProfile, UserBusinessProfile } from '@/store/interfaces/auth.interfaces';
import { useAccountImageUpload } from '@/composables/useAccountImageUpload';
import { useUserStore } from '@/store/modules/user.store';
import { useRouter } from 'vue-router';

const {
	fileUploaderREF, tempPicture, pictureUrl,
	resetTempPicture, imageChanged, imageUploaded, addTo,
} = useAccountImageUpload();
addTo("profile", "background");

const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

const editActive = ref(false);
const user = computed(() => authStore.user);
const role = computed(() => user.value.role);
const userId = computed(() => user.value._id);
const profile = computed(() => user.value.profile ?? {} as Partial<UserProfile>);
const schoolProfile = computed(() => user.value.schoolProfile ?? {} as Partial<UserSchoolProfile>);
const businessProfile = computed(() => user.value.businessProfile ?? {} as Partial<UserBusinessProfile>);
const profileBackground = computed(() => profile.value?.background ?? "/template-no-image.png");
const relatedProfile = computed(() => userStore.relatedProfiles);

const toggleAccountForm = (value: boolean) => {
	editActive.value = value;
}

watch(editActive, () => {
	resetTempPicture();
})

const viewRelatedUserProfile = (id: string) => {
	router.push(`/app/account/${id}`);
}

const svgGithubLanguages = ref<string>();
onMounted(() => {
	// http.get("users/github/languages")
	// .then(response => svgGithubLanguages.value = response.data)
	// .catch((err: AxiosError) => { console.error(err.message) });

	if(userStore.relatedProfiles.length === 0) {
		userStore.relatedGroupProfile();
	}
})
</script>

<style lang="scss">
.h-64 {
	height: 16rem;
}

.calculated-height {
	height: calc(100% - 15rem);
}

.stat-svg > svg {
	border-radius: 0.5rem;
	& * .lang-name {
		fill: #9ca3af;
	}

	& * .header {
		fill: #b54593;
	}

	& > rect {
		fill: #434556;
		stroke: none;
	}
}
</style>