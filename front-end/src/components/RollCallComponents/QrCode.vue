<template>
	<div>
		<qrcode v-if="url" :value="url" />
	</div>
</template>


<script lang="ts">
import Qrcode from 'vue-qrcode';
import { http } from '@/api/network/axios';

let url = '';

export default {
	name: 'QrCode',
	components: {
		Qrcode,
	},
	data() {
		return {
			url,
		};
	},
	mounted() {
		setInterval(() => {
			this.getQrCode();
		}, 180000);

		this.getQrCode();
	},
	methods: {
		getQrCode() {
			http.get('/calls/qrcode_generator').then((response) => {
				this.url = response.data.qrcode;
			});
		},
	},
};
</script>
