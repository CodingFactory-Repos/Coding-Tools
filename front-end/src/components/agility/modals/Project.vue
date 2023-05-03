<template>
	<ModalOverlay v-if="showMetaModal" @close="beforeModalClose" size="xl">
		<template #body>
			<div class="flex flex-col gap-6 items-center justify-center">
				<div class="flex gap-8 items-start">
					<div class="w-52 min-w-[13rem]">
						<img ref="imageRef" class="w-full h-44 rounded" :src="url" alt="project_image"/>
					</div>
					<div class="flex flex-col gap-8 w-full items-start">
						<div class="w-5/6">
							<input
								@input="updateTitle"
								ref="formTitle"
								:value="project.meta.title"
								class="w-full bg-transparent dark:text-white border-b border-l-0 border-t-0 border-r-0 pb-1 pl-1 text-xl font-bold text-black outline-none prevent-border"
								type="text"
								maxlength="25"
							>
						</div>
						<div class="flex gap-4 w-full">
							<div class="h-full flex flex-col justify-start items-start gap-4">
								<span class="text-sm">Owner</span>
								<span class="text-sm">Created</span>
								<span class="text-sm">Updated</span>
							</div>
							<div class="h-full flex flex-col justify-start items-start gap-4">
								<span class="text-sm text-black dark:text-white">Owner Name (todo)</span>
								<span class="text-sm text-black dark:text-white">{{ new Date(project.createdAt).toLocaleString() }}</span>
								<span class="text-sm text-black dark:text-white">{{ new Date(project.lastUpdatedAt).toLocaleString() }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="w-full h-16">
					<textarea
						@input="updateDescription"
						ref="formDesc"
						:value="project.meta.description"
						class="w-full h-full flex bg-transparent dark:text-white border-b-0 border-l-0 border-t-0 border-r-0 pb-1 pl-1 resize-none text-black outline-none prevent-border"
						placeholder="Short description"
						rows="1"
						maxlength="100"
					></textarea>
				</div>
			</div>
		</template>
		<template #footer>
			<DefaultButton
				@click="() => isFormValid ? saveProjectMeta() : {}"
				type="button"
				text="Save"
				text-style="text-white hover:text-white"
				background="gradiant"
				:disabled="!isFormValid"
			/>
		</template>
	</ModalOverlay>
	<ModalOverlay v-if="showWarningModal" @close="exitProjectMeta" size="lg">
		<template #body>
			<div class="flex flex-col gap-4">
				<SvgInfo width="40" height="40"/>
				<div class="flex w-full gap-4 justify-center items-center">
					<span class="mt-1">You have unsaved changes</span>
				</div>
				<div class="flex w-full justify-center items-center">
					<span class="tex-">Are you sure you want to proceed without saving ?</span>
				</div>
			</div>
		</template>
		<template #footer>
			<div class="flex gap-4 justify-center items-center">
				<DefaultButton
					@click="exitProjectMeta"
					type="button"
					text="Yes"
					text-style="text-white hover:text-white"
					background="bg-[#763131] hover:bg-[#763131cc]"
					:disabled="!isFormValid"
				/>

				<DefaultButton
					@click="saveProjectMeta"
					type="button"
					text="No, save the change"
					color="text-white hover:text-white"
					background="bg-[#2e4573] hover:bg-[#2e4573cc]"
					:disabled="!isFormValid"
				/>
			</div>
		</template>
	</ModalOverlay>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import DefaultButton from '@/components/common/buttons/Default.vue';
import ModalOverlay from '@/components/common/Modal.vue';
import SvgInfo from '@/components/common/svg/Info.vue';
import { useAgilityStore } from '@/store/modules/agility.store';
import { cloneDeep } from 'lodash';

const props = defineProps({
	roomId: { type: String, required: true },
})

const emit = defineEmits(['close']);

const agilityStore = useAgilityStore();
const projectRef = ref(agilityStore.projects.find((el) => el.roomId === props.roomId));
const project = ref(cloneDeep(projectRef.value));

const showMetaModal = ref(false);
const showWarningModal = ref(false);
const isFormValid = ref(true);
const imageRef = ref<HTMLImageElement>();

const url = ref(project.value.meta.snapshot);
const previousMetaTitle = ref<string>(project.value.meta.title);
const previousMetaDesc = ref<string>(project.value.meta.description);
const formTitle = ref<HTMLInputElement>();
const formDesc = ref<HTMLTextAreaElement>();

const openMetaModal = () => showMetaModal.value = true;
const closeMetaModal = () => showMetaModal.value = false;
const openWarningModal = () => showWarningModal.value = true;
const closeWarningModal = () => showWarningModal.value = false;

const replaceGenericImage = () => {
	if(imageRef.value) {
		imageRef.value.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
		imageRef.value.removeEventListener("error", replaceGenericImage);
	}
}

const updateTitle = () => {
	const len = formTitle.value.value.length;
	if (len <= 25 && len >= 1) isFormValid.value = true;
	else isFormValid.value = false;

	project.value.meta.title = formTitle.value.value;
}

const updateDescription = () => {
	const len = formDesc.value.value.length;
	if (len <= 100) isFormValid.value = true;
	else isFormValid.value = false;

	project.value.meta.description = formDesc.value.value;
}

const exitProjectMeta = () => {
	closeWarningModal();
	emit('close');
}

const saveProjectMeta = async () => {
	if(previousMetaTitle.value !== project.value.meta.title || previousMetaDesc.value !== project.value.meta.description) {
		await agilityStore.trySaveProjectMeta(project.value);
	}

	if (showMetaModal.value) closeMetaModal();
	if (showWarningModal.value) closeWarningModal();
	emit('close');
}

const beforeModalClose = () => {
	closeMetaModal();

	if (previousMetaTitle.value !== project.value.meta.title || previousMetaDesc.value !== project.value.meta.description) {
		openWarningModal();
	} else {
		emit('close');
	}
}

onMounted(() => {
	if(imageRef.value) {
		imageRef.value.addEventListener("error", replaceGenericImage);
	}
})

openMetaModal();
</script>

<style>
.prevent-border:focus {
	box-shadow: none !important;
}
</style>