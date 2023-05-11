<template>
	<div class="w-full flex relative shadow bg-light-primary dark:bg-dark-secondary rounded-lg flex-col md:flex-row gap-0">
		<div class="relative min-w-[15rem] w-full md:max-w-[19rem] h-[4rem] sm:h-[6.5rem] flex justify-center items-center z-0">
			<ButtonIcon
				@click="() => !edit ? $emit('open') : $emit('close')"
				class="absolute gradiant left-4 bottom-0 md:bottom-[unset] bg-[#24292E] hover:bg-[#24292E99] shadow"
			>
				<SvgCross class="!fill-light-primary" v-if="edit"/>
				<SvgEdit class="!fill-light-primary" v-else/>
			</ButtonIcon>
			<div class="absolute flex items-center justify-center w-44 h-44 border-8 border-light-secondary dark:border-dark-tertiary rounded-full overflow-hidden shadow-md top-[-88px]">
				<img class="object-cover h-full w-full" :src="pictureUrl || tempPicture || profilePicture" alt="user_profile">
				<FileUploader
					v-if="edit"
					ref="fileUploaderREF"
					@onFileChange="imageChanged"
					@onFileUploaded="imageUploaded"
				/>
			</div>
		</div>
		<div class="w-full sm:h-[6.5rem] flex justify-between py-4 px-4 md:pl-8 md:pr-4 gap-5 md:ml-[-5rem] z-10">
			<div class="flex flex-col h-full gap-0 items-start">
				<span class="text-black dark:text-dark-font font-bold text-lg">{{ firstName }} {{ lastName }}</span>
				<span v-if="groupName" class="text-black dark:text-dark-font text-sm">{{ groupName }}</span>
				<span v-if="age" class="text-black dark:text-dark-font text-sm">{{ age }} ans</span>
			</div>
			<div class="flex h-full grow gap-3 justify-end items-center">
				<div class="flex flex-col h-full gap-2 justify-between items-end">
					<template v-if="!edit">
						<div class="flex gap-3 justify-end">
							<ButtonIcon
								v-if="githubProfile"
								:url="githubProfile"
								:foreign-link="true"
								rel="noreferrer"
								target="_blank"
								class="bg-light-tertiary dark:bg-dark-highlight"
							>
								<SvgGithub class="dark:fill-white-icon"/>
							</ButtonIcon>
							<ButtonIcon
								v-if="linkedinProfile"
								:url="linkedinProfile"
								:foreign-link="true"
								rel="noreferrer"
								target="_blank"
								class="bg-light-tertiary dark:bg-dark-highlight"
							>
								<SvgLinkedin class="dark:fill-white-icon"/>
							</ButtonIcon>
						</div>
						<div class="flex gap-1 justify-center items-center" v-if="discordTag">
							<span class="dark:text-dark-font text-black text-sm">{{ discordTag }}</span>
							<SvgDiscord class="mb-[.15rem]"/>
						</div>
					</template>
					<template v-else>
						<ButtonDefault
							@click="preSaveProfile"
							text="Save your profile"
							class="w-full"
							background="bg-[#b54593]"
							text-style="text-white"
						/>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { UserProfile, UserSchoolProfile } from '@/store/interfaces/auth.interfaces';
import ButtonIcon from '@/components/common/buttons/Icon.vue';
import SvgGithub from '@/components/common/svg/Github.vue';
import SvgLinkedin from '@/components/common/svg/Linkedin.vue';
import SvgEdit from '@/components/common/svg/Edit.vue';
import SvgDiscord from '@/components/common/svg/Discord.vue';
import FileUploader from '@/components/common/FileUploader.vue';
import ButtonDefault from '@/components/common/buttons/Default.vue';
import SvgCross from '@/components/common/svg/Cross.vue';
import { useUserStore } from '@/store/modules/user.store';
import { useAccountImageUpload } from '@/composables/useAccountImageUpload';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/store/modules/auth.store';
import { mergeObjects } from '@/utils/mergeObjects';

const props = defineProps<{
	profile: Partial<UserProfile>,
	schoolProfile: Partial<UserSchoolProfile>,
	edit: boolean,
}>();

const {
	fileUploaderREF, tempPicture, pictureUrl,
	resetTempPicture, imageChanged, imageUploaded, addTo
} = useAccountImageUpload();
addTo("profile", "picture");

const authStore = useAuthStore();
const userStore = useUserStore();
const emits = defineEmits<{(e: 'close'), (e: 'open')}>();

const editable = computed(() => props.edit);
const profile = computed(() => props?.profile);
const schoolProfile = computed(() => props?.schoolProfile);

const firstName = computed(() => profile.value?.firstName ?? "Required Signup");
const lastName = computed(() => profile.value?.lastName ?? "Required Signup");
const linkedinProfile = computed(() => profile.value?.linkedinProfile);
const githubProfile = computed(() => profile.value?.githubProfile);
const discordTag = computed(() => profile.value?.discordTag);
const profilePicture = computed(() => profile.value?.picture ?? "/template-no-image.png");
const birthDate = computed(() => new Date(profile.value?.birthDate));
const groupName = computed(() => schoolProfile.value?.groupName);

const age = computed(() => {
	if(!isNaN(+birthDate.value)) {
		const today = new Date();
		const currentTimestamp = today.getTime();
		const birthdayTimestamp = birthDate.value.getTime();
		const ageInMilliseconds = currentTimestamp - birthdayTimestamp;
		return Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
	} else {
		return undefined;
	}
});

watch(editable, () => {
	resetTempPicture();
})

let timeout: NodeJS.Timeout = null;
const preSaveProfile = () => {
	Swal.showLoading()
	userStore.saveActionTriggered = true;
	setTimeout(() => saveProfile(), 100);
}

const saveProfile = async () => {
	if(!userStore.uploadFinished) {
		timeout = setTimeout(saveProfile, 100);
	} else {
		clearTimeout(timeout);
		timeout = undefined;

		const res = await userStore.saveProfile();
		postSaveProfile(res);
	}
}

const postSaveProfile = (res: boolean | string | Array<string>) => {
	Swal.close();
	if(res === true) {
		Swal.fire({
			position: 'top-end',
			icon: 'success',
			text: 'Your profile has been saved',
			showConfirmButton: false,
			timer: 1500
		})
		authStore.user = mergeObjects(authStore.user, userStore.temporaryProfileUser);
		emits("close");
	} else {
		const errors = res as Array<string>;
		Swal.fire({
			icon: 'error',
			title: 'The profile payload is invalid',
			html: `${errors.map(el => el.replace(/profile.|businessProfile.|schoolProfile./, "")).join("<br/>")}`,
		})
	}

	userStore.reset();
}
</script>