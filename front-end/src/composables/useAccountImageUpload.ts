import { FileUploaderExpose } from '@/components/common/FileUploader.vue';
import {
	UserBusinessProfile,
	UserProfile,
	UserSchoolProfile,
} from '@/store/interfaces/auth.interfaces';
import { useUserStore } from '@/store/modules/user.store';
import { computed, ref, watch } from 'vue';

type ProfileLiteral = 'profile' | 'businessProfile';
type PropLiteral = 'background' | 'picture' | 'companyLogo';

interface PicturePath {
	profile: ProfileLiteral;
	prop: PropLiteral;
}

export function useAccountImageUpload() {
	const userStore = useUserStore();
	const pictureUrl = ref<string>();
	const tempPicture = ref<string>();
	const fileUploaderREF = ref<FileUploaderExpose>();
	const saveAction = computed(() => userStore.saveActionTriggered);
	const uploadIndex = ref<number>();
	const picturePath = ref<PicturePath>();

	watch(saveAction, async () => {
		if (saveAction.value) {
			await fileUploaderREF.value.uploadFile();
			setTimeout(() => {
				userStore.uploadWaitingList[uploadIndex.value] = true;
			}, 200);
		}
	});

	const resetTempPicture = () => {
		tempPicture.value = undefined;
	};

	const imageChanged = (base64: string) => {
		tempPicture.value = base64;
		if (uploadIndex.value === undefined) {
			uploadIndex.value = userStore.addAwaitUpload();
		}
	};

	const imageUploaded = (url: string) => {
		pictureUrl.value = url;
		if (!userStore.temporaryProfileUser[picturePath.value.profile]) {
			userStore.temporaryProfileUser[picturePath.value.profile] = {} as UserProfile &
				UserBusinessProfile &
				UserSchoolProfile;
		}
		userStore.temporaryProfileUser[picturePath.value.profile][picturePath.value.prop] = url;
	};

	const addTo = (profile: ProfileLiteral, prop: PropLiteral) => {
		picturePath.value = {
			profile,
			prop,
		};
	};

	return {
		resetTempPicture,
		imageUploaded,
		imageChanged,
		addTo,
		fileUploaderREF,
		tempPicture,
		pictureUrl,
	};
}
