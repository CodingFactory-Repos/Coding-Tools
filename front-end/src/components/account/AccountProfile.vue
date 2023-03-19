<template>
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
					<img v-if="companyLogo" :src="companyLogo" class="w-[45px] h-[45px]" alt="company_logo"/>
					<SvgLink v-else width="45" height="45"/>
				</a>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { UserBusinessProfile, UserProfile } from '@/store/interfaces/auth.interfaces';
import SvgPhone from '@/components/common/svg/Phone.vue';
import SvgCalendar from '@/components/common/svg/Calendar.vue';
import SvgMarker from '@/components/common/svg/Marker.vue';
import SvgLink from '@/components/common/svg/Link.vue';

const props = defineProps<{
	profile: UserProfile,
	businessProfile: UserBusinessProfile,
}>();

const profile = computed(() => props?.profile);
const businessProfile = computed(() => props?.businessProfile)

const birthDate = computed(() => new Date(profile.value?.birthDate));
const profileResume = computed(() => profile.value?.profileResume || "A profile without a resume is boring");
const location = computed(() => profile.value?.location);
const phone = computed(() => profile.value?.phone);

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