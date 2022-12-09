<template>
	<div>
		<VueQRious :value="url" @change="onDataUrlChange" size="300" />
	</div>
</template>
<script>
import VueQRious from 'vue-qrious';

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
