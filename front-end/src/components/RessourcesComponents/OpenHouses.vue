<template>
	<div>
		<h2>Open Houses</h2>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			/* list of all open houses */
			openHouses: [],
		};
	},
	async mounted() {
		await axios.get('http://localhost:8000/openhouses').then((response) => {
			console.log(response);
			this.openHouses = response.data;
			console.log(this.openHouses);
		});
	},
};
</script>
