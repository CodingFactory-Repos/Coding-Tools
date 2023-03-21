<script>
import StudentGroup from '../components/RollCallComponents/StudentGroup.vue';
import StudentList from '../components/RollCallComponents/StudentList.vue';
import QrCode from '../components/RollCallComponents/QrCode.vue';
import axios from 'axios';
import { onMounted, ref, onBeforeMount } from "vue";
import { useRouter } from 'vue-router';
import { tryGetStudents } from '@/api/users-req';
import { useRollStore } from '@/store/roll.store';

export default {
	components: {
		StudentGroup,
		StudentList,
		QrCode,
	},
	setup() {
		const url = ref('');
		const rollStore = useRollStore();
		const router = useRouter();
		const getStudentList = async () => {
			await tryGetStudents().then((res) => {
				rollStore.studentList = res.data.studentList;
			});
			router.push('rollcall/student-list');
		}
		onMounted(async () => {
			const response = await axios.get('http://localhost:8000/calls/qrgenerator');
			url.value = response.data.link;
		});

		return {
			getStudentList,
			router,
			url
		}
	}
};
// Generate the link of the QR code using api call
// and pass it to the QrCode component
</script>
<template>
  {{ url }}
  <QrCode :url="url" />
  <button
    @click="getStudentList"
    class="mr-10 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
  >
    Liste des etudiants
  </button>
  <router-view />
  <StudentGroup />
</template>
