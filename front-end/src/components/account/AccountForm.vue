<template>
	<div class="w-full h-full p-4 flex flex-col gap-3 items-start">
		<div class="w-full flex gap-3 flex-wrap items-start justify-start">
			<div class="grow flex flex-col w-full sm:w-[18rem] min-h-[315px] rounded-lg p-4 bg-light-primary dark:bg-dark-highlight gap-3 justify-start items-start">
				<FormField
					label="Resume"
					:limit="true"
					:char-limit="300"
					:char-number="profileForm.profile.resume.length"
				>
					<textarea
						v-model.trim="profileForm.profile.resume"
						class="bg-transparent w-full outline-none shadow-none ring-offset-0 focus:ring-0 resize-none rounded text-black dark:text-white"
						rows="5"
						maxlength="300"
					></textarea>
				</FormField>
				<FormField
					label="Campus location"
					:limit="false"
				>
					<SimpleSelect
						:data="CAMPUS_LIST"
						v-model:value="profileForm.schoolProfile.campus"
						@selected="campusSelected"
					/>
				</FormField>
			</div>
			<div class="grow flex flex-col w-full sm:w-[18rem] min-h-[315px] rounded-lg p-4 bg-light-primary dark:bg-dark-highlight gap-3 justify-start items-start">
				<FormField
					label="Anniversary"
					:limit="false"
				>
					<VueDatePicker
						v-model="profileForm.profile.birthDate"
						:is-24="false"
						class="dp_input__theme_custom"
						:class="{ 'dp_input__light_theme_custom': !isDark, 'dp_input__dark_theme_custom': isDark }"
						:max-date="thirteenYearsAgo"
						:min-date="ninetyYearAgo"
						:start-date="thirteenYearsAgo"
						:dark="isDark"
					/>
				</FormField>
				<FormField
					label="Phone number"
					:limit="true"
					:char-limit="9"
					:char-number="profileForm.profile.phone.length"
				>
					<!--  maz-ui and libphonenumber if you wish to scale this input -->
					<div class="w-full relative flex items-center text-black dark:text-white">
						<input
							v-model="phoneFormat"
							@input="numberFormat"
							class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 pr-2 pl-[3.1rem] rounded"
						/>
						<span class="h-full absolute border-r border-r-[#6B7280] flex items-center px-2">+33</span>
					</div>
				</FormField>
				<FormField
					label="Discord tag"
					:limit="true"
					:char-limit="62"
					:char-number="discordTagFormat.length + discordUsername.length"
				>
					<div class="w-full relative flex items-center text-black dark:text-white">
						<input
							v-model="discordUsername"
							class="bg-transparent w-full outline-none border border-[#6B7280] discord-border py-1.5 pr-[45.5%] pl-[3rem] rounded"
							maxlength="32"
						/>
						<div class="flex absolute items-center w-[45%] right-0">
							<span class="absolute left-0 pl-1">@</span>
							<input
								v-model="discordTagFormat"
								class="w-full bg-transparent outline-none border border-[#6B7280] number-border py-1.5 pr-2 pl-6 rounded-r"
								maxlength="32"
							/>
						</div>
						<div class="h-full absolute border-r border-r-[#6B7280] flex items-center px-2">
							<SvgDiscord/>
						</div>
					</div>
				</FormField>
			</div>
			<div class="grow flex flex-col w-full sm:w-[18rem] min-h-[315px] rounded-lg p-4 bg-light-primary dark:bg-dark-highlight gap-3 justify-start items-start">
				<FormField
					label="Profile Github"
					:limit="true"
					:char-limit="75"
					:char-number="profileForm.profile.githubProfile.length"
				>
					<input
						v-model="profileForm.profile.githubProfile"
						maxlength="75"
						class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
					/>
				</FormField>
				<FormField
					label="Profile Linkedin"
					:limit="true"
					:char-limit="75"
					:char-number="profileForm.profile.linkedinProfile.length"
				>
					<input
						v-model="profileForm.profile.linkedinProfile"
						maxlength="75"
						class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
					/>
				</FormField>
				<FormField
					label="Show github stats (github profile required)"
					:limit="false"
				>
					<div class="toggle color cursor-pointer text-black dark:text-white">
						<input id="github-stat-switch" v-model="profileForm.profile.showGithubStat" class="toggle-checkbox hidden" type="checkbox">
						<label for="github-stat-switch" class="toggle-label relative before:absolute before:block before:bg-white block w-12 h-6 rounded-full transition-color duration-150 ease-out cursor-pointer"></label>
					</div>
				</FormField>
			</div>
		</div>
		<div class="w-full flex gap-3 flex-wrap items-start justify-start">
			<div class="grow flex flex-wrap sm:flex-row sm:flex-nowrap w-full sm:w-[25rem] min-h-[315px] rounded-lg p-4 bg-light-primary dark:bg-dark-highlight gap-6 justify-start items-start">
				<div class="flex flex-col gap-1 w-full h-full min-w-[8rem]">
					<FormField
						label="Company name"
						:limit="true"
						:char-limit="50"
						:char-number="profileForm.businessProfile.companyName.length"
					>
						<input
							v-model="profileForm.businessProfile.companyName"
							class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
							maxlength="50"
						/>
					</FormField>
					<FormField
						label="Position in the company"
						:limit="true"
						:char-limit="75"
						:char-number="profileForm.businessProfile.companyJob.length"
					>
						<input
							v-model="profileForm.businessProfile.companyJob"
							maxlength="75"
							class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
						/>
					</FormField>
					<FormField
						label="Company website"
						:limit="true"
						:char-limit="75"
						:char-number="profileForm.businessProfile.companyLink.length"
					>
						<input
							v-model="profileForm.businessProfile.companyLink"
							maxlength="75"
							class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
						/>
					</FormField>
				</div>
				<div class="flex flex-col gap-3 w-full h-full min-w-[8rem]">
					<FormField
						label="Job period"
						:limit="false"
					>
						<VueDatePicker
							v-model="profileForm.businessProfile.workingDuration"
							class="dp_input__theme_custom"
							:class="{ 'dp_input__light_theme_custom': !isDark, 'dp_input__dark_theme_custom': isDark }"
							:enable-time-picker="false"
							:partial-range="true"
							range
							:max-date="fiveYearLater"
							:min-date="seventySevenYearAgo"
							:start-date="today"
							:dark="isDark"
						/>
					</FormField>
					<FormField
						label="Company logo"
						:limit="false"
					>
						<div class="w-full h-full rounded-lg overflow-hidden max-h-[10rem] relative text-black dark:text-white">
							<FileUploader
								ref="fileUploaderREF"
								@onFileChange="imageChanged"
								@onFileUploaded="imageUploaded"
							/>
							<img
								:src="pictureUrl || tempPicture || profileForm.businessProfile.companyLogo"
								class="w-full h-full object-cover"
								alt="company_logo"
							/>
						</div>
					</FormField>
				</div>
			</div>
			<div class="grow flex flex-col w-full sm:w-[25rem] min-h-[315px] rounded-lg p-4 bg-light-primary dark:bg-dark-highlight gap-3 justify-start items-start">
				<FormField
					label="Liked subjects"
					:limit="false"
				>
					<SimpleSelect
						:data="DISCIPLINES_LIST"
						:multy="true"
						v-model:value="profileForm.profile.disciplinesLiked"
						@selected="disciplinesLikedSelected"
						@unselect="disciplinesLikedUnselected"
					/>
				</FormField>
				<FormField
					label="Subjects taught (PO)"
					:limit="false"
					v-if="role === Roles.PRODUCT_OWNER"
				>
					<SimpleSelect
						:data="DISCIPLINES_LIST"
						:multy="true"
						v-model:value="profileForm.businessProfile.disciplinesTaught"
						@selected="disciplinesTaughtSelected"
						@unselect="disciplinesTaughtUnselected"
					/>
				</FormField>
				<FormField
					label="My portfolio"
					:limit="true"
					:char-limit="75"
					:char-number="profileForm.profile.portfolio.length"
				>
					<input
						v-model="profileForm.profile.portfolio"
						maxlength="75"
						class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
					/>
				</FormField>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, computed, watch, ref } from 'vue';
import { User, UserBusinessProfile, UserProfile, UserSchoolProfile, Roles } from '@/store/interfaces/auth.interfaces';
import FormField from '@/components/common/FormField.vue';
import FileUploader from '@/components/common/FileUploader.vue';
import SimpleSelect from '@/components/common/SimpleSelect.vue';
import SvgDiscord from '@/components/common/svg/Discord.vue';
import { DISCIPLINES_LIST, CAMPUS_LIST } from '@/utils/constants';
import { isEmpty } from '@/utils/string.helper';
import { useAccountImageUpload } from '@/composables/useAccountImageUpload';
import { useUserStore } from '@/store/modules/user.store';
import { filterInvalidProperties } from '@/utils/filterInvalidProperties';
import { DeepPartial } from '@/interfaces/advanced-types.interface';
import { useThemeStore } from '../../store/modules/theme.store';

// <FormField
// 	label="Enable 2FA"
// 	:limit="false"
// >
// 	<div class="toggle color cursor-pointer">
// 		<input id="2fa-switch" v-model="profileForm.enable2FA" class="toggle-checkbox hidden" type="checkbox">
// 		<label for="2fa-switch" class="toggle-label relative before:absolute before:block before:bg-white block w-12 h-6 rounded-full transition-color duration-150 ease-out cursor-pointer"></label>
// 	</div>
// </FormField>

const props = defineProps<{
	profile: Partial<UserProfile>,
	schoolProfile: Partial<UserSchoolProfile>,
	businessProfile: Partial<UserBusinessProfile>,
	role: Roles;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme);

const profileForm = reactive({
	profile: {
		resume: props.profile?.resume ?? "",
		phone: props.profile?.phone ?? "",
		birthDate: props.profile?.birthDate ?? undefined,
		linkedinProfile: props.profile?.linkedinProfile ?? "",
		githubProfile: props.profile?.githubProfile ?? "",
		discordTag: props.profile?.discordTag ?? "",
		portfolio: props.profile?.portfolio ?? "",
		disciplinesLiked: props.profile?.disciplinesLiked ?? [],
		showGithubStat: props.profile?.showGithubStat ?? false,
	},
	schoolProfile: {
		campus: props.schoolProfile?.campus ?? "",
	},
	businessProfile: {
		disciplinesTaught: props.businessProfile?.disciplinesTaught ?? [],
		companyJob: props.businessProfile?.companyJob ?? "",
		companyName: props.businessProfile?.companyName ?? "",
		companyLink: props.businessProfile?.companyLink ?? "",
		companyLogo: props.businessProfile?.companyLogo ?? "/template-no-image.png",
		workingDuration: [props.businessProfile?.workingFrom, props.businessProfile?.workingTo] ?? [],
	},
	// enable2FA: false,
})

const phoneFormat = ref(profileForm.profile.phone?.replace(/^(.)(..?)?(..?)?(..?)?(..?)?$/g, "$1 $2 $3 $4 $5")?.trim());
const discordTagFormat = ref(profileForm.profile.discordTag.replace(/.*(?<=@)/, ""));
const discordUsername = ref(profileForm.profile.discordTag.includes("@")
	? profileForm.profile.discordTag.replace(/(?=@).*/, "")
	: ""
);

const today = new Date();
const thirteenYearsAgo = new Date();
const ninetyYearAgo = new Date();
const fiveYearLater = new Date();
const seventySevenYearAgo = new Date();
thirteenYearsAgo.setFullYear(today.getFullYear() - 13);
ninetyYearAgo.setFullYear(today.getFullYear() - 90);
seventySevenYearAgo.setFullYear(today.getFullYear() - 77);
fiveYearLater.setFullYear(today.getFullYear() + 5);

const {
	fileUploaderREF, tempPicture, pictureUrl,
	imageChanged, imageUploaded, addTo
} = useAccountImageUpload();
addTo("businessProfile", "companyLogo");

const userStore = useUserStore();
const saveAction = computed(() => userStore.saveActionTriggered);

watch(saveAction, val => {
	if(val) {
		if(discordTagFormat.value.length > 0 && discordUsername.value.length > 0) {
			profileForm.profile.discordTag = discordUsername.value + "@" + discordTagFormat.value;
		} else profileForm.profile.discordTag = "";

		const sanitizedProfile = filterInvalidProperties(profileForm, "template-no-image.png") as DeepPartial<User> & typeof profileForm;
		if(sanitizedProfile?.businessProfile?.workingDuration?.length === 2) {
			sanitizedProfile.businessProfile.workingFrom = sanitizedProfile.businessProfile.workingDuration[0];
			sanitizedProfile.businessProfile.workingTo = sanitizedProfile.businessProfile.workingDuration[1];
			delete sanitizedProfile.businessProfile.workingDuration;
		}
		userStore.temporaryProfileUser = sanitizedProfile;
	}
})

const numberFormat = (e: InputEvent) => {
	const trimed = phoneFormat.value.replace(/[^0-9]/g, "");
	if(isEmpty(trimed)) {
		phoneFormat.value = "";
		profileForm.profile.phone = "";
	} else {
		let sanitized = parseInt(trimed).toString();
		if(sanitized.length > 9)
			sanitized = sanitized.slice(0, 9);

		const format = sanitized.replace(/^(.)(..?)?(..?)?(..?)?(..?)?$/g, "$1 $2 $3 $4 $5").trim();
		profileForm.profile.phone = format.replace(/ /g, "");
		(e.target as HTMLInputElement).value = format;
		phoneFormat.value = format;
	}
}

const campusSelected = (value: string) => {
	profileForm.schoolProfile.campus = value;
}

const disciplinesTaughtSelected = (value: string) => {
	profileForm.businessProfile.disciplinesTaught.push(value);
}

const disciplinesTaughtUnselected = (value: string) => {
	const index = profileForm.businessProfile.disciplinesTaught.indexOf(value);
	if(index !== -1) {
		profileForm.businessProfile.disciplinesTaught.splice(index, 1);
	}
}

const disciplinesLikedSelected = (value: string) => {
	profileForm.profile.disciplinesLiked.push(value);
}

const disciplinesLikedUnselected = (value: string) => {
	const index = profileForm.profile.disciplinesLiked.indexOf(value);
	if(index !== -1) {
		profileForm.profile.disciplinesLiked.splice(index, 1);
	}
}
</script>

<style lang="scss">
//! DISCLAIMER: Too specifc for tailwind

.flex-row-wrap {
	flex-flow: row wrap;
}

.number-border {
	&:focus {
		border-color: #1C64F2;

		& + span, & + div {
			border-color: #1C64F2;
		}
	}
}

.discord-border {
	&:focus {
		border-color: #1C64F2;

		& ~ span, & ~* input, & ~ div {
			border-color: #1C64F2;
		}
	}
}

.dp_input__theme_custom {
	& input:focus-visible {
		outline: none !important;
	}
	--dp-background-color: transparent !important;
	--dp-border-color-hover: #1C64F2 !important;
}

.dp_input__dark_theme_custom {
	--dp-text-color: #ffffff !important;
	--dp-icon-color: #ffffff !important;
}

.dp_input__light_theme_custom {
	--dp-text-color: #000000 !important;
	--dp-icon-color: #000000 !important;
}

html:not(.dark) {
	& .dp__active_date, & .dp__action_select:hover, & .dp__overlay_cell_active, & .dp__range_end, & .dp__range_start {
		color: #ffffff !important;
	}
}

.dp__theme_light {
	--dp-background-color: #f3f4f6;
	--dp-text-color: #383838;
	--dp-hover-color: #dedede !important;
	--dp-hover-text-color: #1e1e1e !important;
	--dp-hover-icon-color: #959595 !important;
	--dp-primary-color: #ad438f !important;
	--dp-primary-text-color: #000000 !important;
	--dp-secondary-color: #a9a9a9 !important;
	--dp-border-color: #6B7280 !important;
	--dp-menu-border-color: #6B7280 !important;
	--dp-border-color-hover: #aaaeb7;
	--dp-disabled-color: #737373 !important;
	--dp-scroll-bar-background: #cccccc !important;
	--dp-scroll-bar-color: #484848 !important;
	--dp-success-color: #00701a !important;
	--dp-success-color-disabled: #428f59 !important;
	--dp-icon-color: #6B7280;
	--dp-danger-color: #e53935 !important;
	--dp-highlight-color: rgba(0, 92, 178, 1) !important;
}

.dp__theme_dark {
	--dp-background-color: #2c2e3a;
	--dp-text-color: #9ca3af;
	--dp-hover-color: #434556 !important;
	--dp-hover-text-color: #ffffff !important;
	--dp-hover-icon-color: #959595 !important;
	--dp-primary-color: #ad438f !important;
	--dp-primary-text-color: #ffffff !important;
	--dp-secondary-color: #a9a9a9 !important;
	--dp-border-color: #6B7280 !important;
	--dp-menu-border-color: #6B7280 !important;
	--dp-border-color-hover: #aaaeb7;
	--dp-disabled-color: #737373 !important;
	--dp-scroll-bar-background: #212121 !important;
	--dp-scroll-bar-color: #484848 !important;
	--dp-success-color: #00701a !important;
	--dp-success-color-disabled: #428f59 !important;
	--dp-icon-color: #6B7280;
	--dp-danger-color: #e53935 !important;
	--dp-highlight-color: rgba(0, 92, 178, 1) !important;
}

.toggle-label {
	&:before {
		top: 0.125rem;
		left: 0.125rem;

		content: "";

		width: 1.25rem;
		height: 1.25rem;
		border-radius: 9999%;
		background-position: center;
		background-repeat: no-repeat;

		background-size: 40%;
		background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23a0aec0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>');

		transition: transform .15s cubic-bezier(0, 0, 0.2, 1);

		transform: translateX(0);

		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}
}

.toggle-checkbox:checked + .toggle-label:before {
	transform: translateX(1.5rem);
	background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23a0aec0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>');
}

.toggle {
	&.color {
		.toggle-label {
			background-color: #feb2b2;
		}

		.toggle-checkbox:checked + .toggle-label {
			background-color: #9ae6b4;
		}
	}
}
</style>