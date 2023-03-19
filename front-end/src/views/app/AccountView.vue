<template>
	<main class="relative w-full h-full flex items-center justify-center">
		<div class="absolute top-0 w-full h-80 z-0">
			<div class="relative w-full h-full flex items-start justify-center overflow-hidden">
				<img class="absolute object-fill w-full" :src="profileBackground" alt="user_background">
			</div>
		</div>
		<div class="flex items-start justify-center px-6 pt-56 h-full w-full z-10">
			<div class="grow w-full flex flex-col items-center justify-start bg-light-tertiary dark:bg-dark-tertiary rounded-lg shadow gap-0">
				<div class="w-full flex relative shadow bg-light-primary dark:bg-dark-secondary rounded-lg flex-col md:flex-row gap-0">
					<div class="relative min-w-[15rem] w-full md:max-w-[19rem] h-24 flex justify-center items-center z-0">
						<ButtonIcon class="absolute gradiant left-4 bottom-0 md:bottom-[unset] bg-[#24292E] hover:bg-[#24292E99] shadow">
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
										:href="githubProfile"
										:foreign-link="true"
										rel="noreferrer"
										class="bg-light-tertiary dark:bg-dark-highlight"
									>
										<SvgGithub class="dark:fill-white-icon"/>
									</ButtonIcon>
									<ButtonIcon
										:href="linkedinProfile"
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
				<div class="w-full h-full p-4 flex-col flex-wrap gap-3 items-start">
					<div class="h-fit flex flex-col w-full sm:w-80 rounded-lg p-4 bg-light-primary dark:bg-dark-highlight gap-5">
						<span class="text-sm font-light text-black dark:text-dark-font">
							{{ profileResume }}
						</span>
						<template v-if="phone || location || !isNaN(+birthDate)">
							<hr class="w-full h-[1px] border-light-tertiary dark:border-dark-tertiary"/>
							<div class="grow w-full flex flex-col justify-start items-start gap-2">
								<div class="flex gap-2 justify-center items-center" v-if="phone">
									<SvgPhone width="30" height="30" class="dark:fill-lighter-icon"/>
									<span class="text-sm text-black dark:text-dark-font">{{ phone }}</span>
								</div>
								<div class="flex gap-2 justify-center items-center" v-if="!isNaN(+birthDate)">
									<SvgCalendar width="30" height="30" class="dark:fill-lighter-icon"/>
									<span class="text-sm text-black dark:text-dark-font">{{ birthDate.toDateString() }}</span>
								</div>
								<div class="flex gap-2 justify-center items-center" v-if="location">
									<SvgMarker width="30" height="30" class="dark:fill-lighter-icon"/>
									<span class="text-sm text-black dark:text-dark-font">{{ location }}</span>
								</div>
							</div>
						</template>
					</div>
					<div
						v-if="companyJob || companyName || season"
						class="h-fit flex justify-between w-full sm:w-80 rounded-lg p-4 bg-light-primary dark:bg-dark-highlight gap-5"
					>
						<div class="flex flex-col items-start gap-1">
							<span class="text-sm text-black font-bold dark:text-dark-font" v-if="companyJob">
								{{ companyJob }}
							</span>
							<span class="text-sm text-black font-light dark:text-dark-font" v-if="companyName">
								{{ companyName }}
							</span>
							<span class="text-sm text-black font-light dark:text-dark-font" v-if="season">
								{{ season }}
							</span>
						</div>
						<div class="flex items-center justify-center" v-if="companyLink || companyLogo">
							<a :href="companyLink" rel="noreferrer" class="w-16 h-16 rounded-lg bg-light-tertiary dark:bg-dark-tertiary flex items-center justify-center cursor-pointer">
								<img v-if="companyLogo" :href="companyLogo" class="w-[45px] h-[45px]"/>
								<SvgLink v-else width="45" height="45"/>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useAuthStore } from '@/store/modules/auth.store';
import ButtonIcon from '@/components/common/buttons/Icon.vue';
import SvgGithub from '@/components/common/svg/Github.vue';
import SvgLinkedin from '@/components/common/svg/Linkedin.vue';
import SvgEdit from '@/components/common/svg/Edit.vue';
import SvgDiscord from '@/components/common/svg/Discord.vue';
import SvgPhone from '@/components/common/svg/Phone.vue';
import SvgCalendar from '@/components/common/svg/Calendar.vue';
import SvgMarker from '@/components/common/svg/Marker.vue';
import SvgLink from '@/components/common/svg/Link.vue';

const authStore = useAuthStore();

const user = computed(() => authStore.user);
const profile = computed(() => user.value.profile);
const schoolProfile = computed(() => user.value.schoolProfile);
const businessProfile = computed(() => user.value.businessProfile);

const firstName = computed(() => profile.value?.firstName || "unknown");
const lastName = computed(() => profile.value?.lastName || "unknown");
const linkedinProfile = computed(() => profile.value?.linkedinProfile || "#");
const githubProfile = computed(() => profile.value?.githubProfile || "#");
const discordId = computed(() => profile.value?.discordId || "#unknown:XXXX");
const profilePicture = computed(() => profile.value?.profilePicture || "https://avatars.githubusercontent.com/u/91219719?v=4");
const profileBackground = computed(() => profile.value?.profileBackground || "https://weraveyou.com/wp-content/uploads/2022/08/Underground-Party-Rave.jpg");
const profileResume = computed(() => profile.value?.profileResume || "A profile without a resume is boring");
const birthDate = computed(() => new Date(profile.value?.birthDate));
const location = computed(() => profile.value?.location);
const phone = computed(() => profile.value?.phone);
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
const companyJob = computed(() => businessProfile.value?.companyJob);
const companyName = computed(() => businessProfile.value?.companyName);
const companyLink = computed(() => businessProfile.value?.companyLink || "#");
const companyLogo = computed(() => businessProfile.value?.companyLogo);
const season = computed(() => {
	const workingFrom = new Date(businessProfile.value?.workingFrom);
	const workingTo = new Date(businessProfile.value?.workingTo);
	if(isNaN(+workingFrom) || isNaN(+workingTo)) {
		return undefined
	}

	return `${workingFrom.getFullYear()}-${workingTo.getFullYear()}`;
})
</script>

<style>
.h-64 {
	height: 16rem;
}
</style>