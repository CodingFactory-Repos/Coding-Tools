<template>
	<label class="absolute w-full h-full flex flex-col items-center justify-center uppercase cursor-pointer opacity-bg z-10">
		<SVGCloud class="!fill-pink-500"/>
		<span class="mt-2 text-small text-pink-500 leading-normal">Select a file</span>
		<input type='file' @change="onFileChange" class="hidden" ref="inputFile" accept="image/png, image/jpeg, image/webp"/>
	</label>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { http } from '@/api/network/axios';
import SVGCloud from "@/components/common/svg/Cloud.vue";
import { Status, STATUS } from '@/store/interfaces/axios.interface';
import { withErrorHandler } from '../../utils/storeHandler';

export interface FileUploaderExpose {
	uploadFile: () => Promise<void>;
}

const emits = defineEmits<{
	(e: "onFileChange", base64: string | ArrayBuffer): void;
	(e: "onFileUploaded", link: string): void;
}>()

const inputFile = ref<HTMLInputElement>();
let uploadedFile: File;

const onFileChange = () => {
	uploadedFile = inputFile.value.files[0];
	const reader = new FileReader();

	reader.onload = () => {
		const base64String = reader.result;
		emits("onFileChange", base64String);
	};

	reader.readAsDataURL(uploadedFile);
}

const uploadFile = withErrorHandler(async function() {
	if(!uploadedFile) return;

	const formData = new FormData();
	formData.append('file', uploadedFile);

	const res = await submitFile(formData);
	if(res.data.status === STATUS.OK) {
		emits("onFileUploaded", res.data.url);
	}
})

const submitFile = (formData: FormData) => {
	return http.post<Status<{ url: string }>>('upload/private', formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
}

defineExpose({
	uploadFile,
})
</script>

<style lang="scss">
.opacity-bg {
	opacity: 0;
	background: rgba(0, 0, 0, 0);
	transition: background 300ms, opacity 500ms;

	&:hover {
		opacity: 1;
		background: rgba(0, 0, 0, 0.6);
	}
}
</style>