<template>
	<div class="w-full h-full flex flex-col gap-3 items-start justify-start">
		<div class="h-full w-full flex-col flex-wrap gap-3 items-start">
			<div class="h-fit flex w-full justify-center rounded-lg p-4 bg-light-primary dark:bg-dark-highlight gap-5">
				<p class="text-sm italic text-black dark:text-dark-font">
					{{ profileResume }}
				</p>
			</div>
		</div>
		<div
			class="w-full flex gap-3 flex-wrap flex-row grow"
			v-if="phone || location || !isNaN(+birthDate)"
		>
			<div class="grow basis-60 w-full flex flex-col rounded-lg p-4 bg-light-primary dark:bg-dark-highlight gap-5">
				<div class="grow w-full flex flex-col justify-start items-start gap-2">
					<div class="flex gap-2 justify-center items-center" v-if="phone">
						<SvgPhone width="30" height="30" class="dark:fill-lighter-icon"/>
						<span class="text-sm text-black dark:text-dark-font">+33 {{ phone.replace(/^(.)(..?)?(..?)?(..?)?(..?)?$/g, "$1 $2 $3 $4 $5")?.trim() }}</span>
					</div>
					<div class="flex gap-2 justify-center items-center" v-if="!isNaN(+birthDate)">
						<SvgCalendar width="30" height="30" class="dark:fill-lighter-icon"/>
						<span class="text-sm text-black dark:text-dark-font">{{ birthDate.toLocaleDateString() }}</span>
					</div>
					<div class="flex gap-2 justify-center items-center" v-if="location">
						<SvgMarker width="30" height="30" class="dark:fill-lighter-icon"/>
						<span class="text-sm text-black dark:text-dark-font">{{ location }}</span>
					</div>
				</div>
			</div>
			<div
				v-if="companyJob || companyName || season || companyLink || companyLogo"
				class="grow basis-60 w-full flex justify-between w-full rounded-lg p-4 bg-light-primary dark:bg-dark-highlight gap-5"
			>
				<div class="flex flex-col items-start gap-3">
					<span class="text-sm text-black font-bold dark:text-dark-font" v-if="companyName">
						{{ companyName }}
					</span>
					<span class="text-sm text-black font-light dark:text-dark-font" v-if="companyJob">
						{{ companyJob }}
					</span>
					<span class="text-sm text-black font-light dark:text-dark-font" v-if="season">
						{{ season }}
					</span>
				</div>
				<div class="flex items-center justify-center" v-if="companyLink || companyLogo">
					<a :href="companyLink" rel="noreferrer" class="w-24 h-24 rounded-lg bg-light-tertiary dark:bg-dark-tertiary flex items-center justify-center cursor-pointer">
						<img v-if="companyLogo" :src="companyLogo" class="w-[85%] h-[85%] rounded-lg object-cover" alt="company_logo"/>
						<SvgLink v-else width="85%" height="85%"/>
					</a>
				</div>
			</div>
		</div>
		<div
			class="stat-svg-dark absolute mt-3.5 mr-3.5 sm:mt-0 sm:mr-2 md:mt-10 md:mr-6 top-0 right-0"
			v-if="svgGithubStat !== undefined"
			v-html="svgGithubStat"
		/>
		<div
			class="w-full flex gap-3 flex-wrap flex-row grow"
			v-if="disciplinesLiked.length > 0 || disciplinesTaught.length > 0"
		>
			<div
				class="grow basis-60 flex flex-col rounded-lg p-4 bg-light-primary dark:bg-dark-highlight gap-3"
				v-if="disciplinesLiked.length > 0"
			>
				<span class="text-ligh-font dark:text-dark-font pb-2 text-sm font-bold">Disciplines Liked</span>
				<ul class="w-full flex flex-wrap gap-2 justify-center items-center">
					<li v-for="(value, index) in disciplinesLiked" :key="`${value}_${index}`">
						<span class="flex items-center justify-center gap-1.5 bg-[#b54593] px-[5px] py-[1px] rounded">{{ value }}</span>
					</li>
				</ul>
			</div>
			<div
				class="grow basis-60 flex flex-col rounded-lg p-4 bg-light-primary dark:bg-dark-highlight gap-3"
				v-if="role !== Roles.PRODUCT_OWNER && disciplinesTaught.length > 0"
			>
				<span class="text-ligh-font dark:text-dark-font pb-2 text-sm font-bold">Disciplines Taught</span>
				<ul class="w-full flex flex-wrap gap-2 justify-center items-center">
					<li v-for="(value, index) in disciplinesTaught" :key="`${value}_${index}`">
						<span class="flex items-center justify-center gap-1.5 bg-[#79518e] px-[5px] py-[1px] rounded">{{ value }}</span>
					</li>
				</ul>
			</div>
			<!-- <div class="grow basis-60 flex flex-col rounded-lg p-4 bg-light-primary dark:bg-dark-highlight"></div> -->
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { Roles, UserBusinessProfile, UserProfile, UserSchoolProfile } from '@/store/interfaces/auth.interfaces';
import SvgPhone from '@/components/common/svg/Phone.vue';
import SvgCalendar from '@/components/common/svg/Calendar.vue';
import SvgMarker from '@/components/common/svg/Marker.vue';
import SvgLink from '@/components/common/svg/Link.vue';
import { AxiosError } from 'axios';
import { http } from '@/api/network/axios';

const props = defineProps<{
	profile: Partial<UserProfile>,
	schoolProfile: Partial<UserSchoolProfile>,
	businessProfile: Partial<UserBusinessProfile>,
	id: string,
	role: Roles,
}>();

const profile = computed(() => props?.profile);
const schoolProfile = computed(() => props?.schoolProfile);
const businessProfile = computed(() => props?.businessProfile)

const birthDate = computed(() => new Date(profile.value?.birthDate));
const profileResume = computed(() => profile.value?.resume || "Nothing to see there yet");
const location = computed(() => schoolProfile.value?.campus);
const phone = computed(() => profile.value?.phone);

const companyJob = computed(() => businessProfile.value?.companyJob);
const companyName = computed(() => businessProfile.value?.companyName);
const companyLink = computed(() => businessProfile.value?.companyLink);
const companyLogo = computed(() => businessProfile.value?.companyLogo);
const disciplinesLiked = computed(() => profile.value?.disciplinesLiked ?? []);
const disciplinesTaught = computed(() => businessProfile.value?.disciplinesTaught ?? []);
const season = computed(() => {
	try {
		const workingFrom = new Date(businessProfile.value?.workingFrom);
		const workingTo = new Date(businessProfile.value?.workingTo);
		if(isNaN(+workingFrom) || isNaN(+workingTo)) {
			return undefined
		}

		return `${workingFrom.getFullYear()}-${workingTo.getFullYear()}`;
	} catch {
		return undefined
	}
})

const svgGithubStat = ref<string>();
onMounted(() => {
	if(profile.value.githubProfile) {
		http.get(`users/github/stats/${props.id}`)
			.then(response => svgGithubStat.value = response.data)
			.catch((err: AxiosError) => { console.error(err.message) });
	}
})
</script>

<style lang="scss">
.stat-svg-dark > svg {
	width: 375px !important;
	height: 147px !important;

	@media (min-width: 640px) and (max-width: 767px) {
		width: 330px !important;
		// height: px !important;
	}

	@media (max-width: 640px) {
		width: 235px !important;
		height: 100px !important;
	}

	& * .stat, & * .rank-text {
		fill: #9ca3af;
	}

	& * .header {
		fill: #b54593;
	}

	& * .rank-circle-rim, & * .rank-circle {
		stroke: #b54593;
	}

	& > rect {
		fill: #21222b;
	}
}
</style>