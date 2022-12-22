<script>
import StudentList from '../components/RollCallComponents/StudentList.vue';
import QrCode from '../components/RollCallComponents/QrCode.vue';
import axios from 'axios';

export default {
	components: {
		StudentList,
		QrCode,
	},
	data() {
		return {
			url: '',
		};
	},
	async mounted() {
		const response = await axios.get('http://localhost:8000/calls/qrgenerator');
		this.url = response.data.link;
	},
};
// Generate the link of the QR code using api call
// and pass it to the QrCode component
</script>
<template>
	{{ url }}
	<QrCode :url="url" />
	<StudentList />
</template>
