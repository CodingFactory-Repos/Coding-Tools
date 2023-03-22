<template>
	<div>
		<VueQRious :value="url" @change="onDataUrlChange" size="300" />
	</div>
</template>
<script lang="ts">
import VueQRious from 'vue-qrious';

//? Pretty sure size is of type number, not string;

export default {
	name: 'QrCode',
	components: {
		VueQRious,
	},
	props: {
		url: String,
	},
	data() {
		return {
			dataUrl: null,
		};
	},
	computed: {
		onDataUrlChange(dataUrl) {
			this.dataUrl = dataUrl;
		},
	},
};
</script>
