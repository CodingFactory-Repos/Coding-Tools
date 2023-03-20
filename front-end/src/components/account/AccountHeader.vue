<template>
	<div class="w-full flex relative shadow bg-light-primary dark:bg-dark-secondary rounded-lg flex-col md:flex-row gap-0">
		<div class="relative min-w-[15rem] w-full md:max-w-[19rem] h-24 flex justify-center items-center z-0">
			<ButtonIcon
				@click="$emit('edit')"
				class="absolute gradiant left-4 bottom-0 md:bottom-[unset] bg-[#24292E] hover:bg-[#24292E99] shadow"
			>
				<SvgEdit class="!fill-light-primary"/>
			</ButtonIcon>
			<div class="absolute w-44 h-44 border-8 border-light-secondary dark:border-dark-tertiary rounded-full overflow-hidden shadow-md top-[-88px]">
				<img class="object-cover h-full w-full" :src="profilePicture" alt="user_profile">
			</div>
		</div>
		<div class="w-full flex justify-between py-4 px-4 md:pl-8 md:pr-4 gap-5 md:ml-[-5rem] z-10">
			<div class="flex flex-col h-full gap-0 items-start">
				<span class="text-black dark:text-dark-font font-bold text-lg">{{ firstName }} {{ lastName }}</span>
				<span v-if="groupeName" class="text-black dark:text-dark-font text-sm">{{ groupeName }}</span>
				<span v-if="age" class="text-black dark:text-dark-font text-sm">{{ age }} ans</span>
			</div>
			<div class="flex h-full grow gap-3 justify-end items-center">
				<div class="flex flex-col h-full gap-2 justify-between">
					<div class="flex gap-3 justify-end">
						<ButtonIcon
							:url="githubProfile"
							:foreign-link="true"
							rel="noreferrer"
							class="bg-light-tertiary dark:bg-dark-highlight"
						>
							<SvgGithub class="dark:fill-white-icon"/>
						</ButtonIcon>
						<ButtonIcon
							:url="linkedinProfile"
							:foreign-link="true"
							rel="noreferrer"
							class="bg-light-tertiary dark:bg-dark-highlight"
						>
							<SvgLinkedin class="dark:fill-white-icon"/>
						</ButtonIcon>
					</div>
					<div class="flex gap-1 justify-center items-center">
						<span class="dark:text-dark-font text-black text-sm">{{ discordId }}</span>
						<SvgDiscord class="mb-[.15rem]"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { UserProfile, UserSchoolProfile } from '@/store/interfaces/auth.interfaces';
import ButtonIcon from '@/components/common/buttons/Icon.vue';
import SvgGithub from '@/components/common/svg/Github.vue';
import SvgLinkedin from '@/components/common/svg/Linkedin.vue';
import SvgEdit from '@/components/common/svg/Edit.vue';
import SvgDiscord from '@/components/common/svg/Discord.vue';

const props = defineProps<{
	profile: UserProfile,
	schoolProfile: UserSchoolProfile,
}>();

const profile = computed(() => props?.profile || {});
const schoolProfile = computed(() => props?.schoolProfile);

const firstName = computed(() => profile.value?.firstName || "unknown");
const lastName = computed(() => profile.value?.lastName || "unknown");
const linkedinProfile = computed(() => profile.value?.linkedinProfile || "#");
const githubProfile = computed(() => profile.value?.githubProfile || "#");
const discordId = computed(() => profile.value?.discordId || "#unknown:XXXX");
const profilePicture = computed(() => profile.value?.profilePicture || "https://avatars.githubusercontent.com/u/91219719?v=4");
const birthDate = computed(() => new Date(profile.value?.birthDate));
const age = computed(() => {
	if(!isNaN(+birthDate.value)) {
		const today = new Date();
		const currentTimestamp = today.getTime();
		const birthdayTimestamp = birthDate.value.getTime();
		const ageInMilliseconds = currentTimestamp - birthdayTimestamp;
		return ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
	} else {
		return undefined;
	}
});

const groupeName = computed(() => schoolProfile.value?.groupeName);
</script>