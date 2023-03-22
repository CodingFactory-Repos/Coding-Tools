<script lang="ts">
import StudentCell from '../RollCallComponents/StudentCell.vue';
import { useRollStore } from '@/store/roll.store';
import { computed } from "vue";

export default {
  name: 'StudentList',
  components: {
    StudentCell,
  },
  setup(props) {
    const rollStore = useRollStore();
    const studentList = computed(() => rollStore.studentList.map(student => ({ 
        name: `${student.profile.lastName} ${student.profile.firstName}`, 
		email: student.profile.email,
		presenceStatus: student.presenceStatus 
    })));
    console.log("studentList:", studentList.value);
    
    return {
      studentList
    }
  },
  data() {
	  return {
		border: 'border-t-4 dark:border-[#1f2028] border-[#f3f4f6]', 
		background: 'dark:bg-[#343a40] bg-[#ffff]', 
		color: 'dark:text-white text-[#343a40]'
	}
  }
};
</script>
<template>
	<div class="relative w-full md:w-9/12">
	  <table class="text-center w-full">
		<thead :class="background" class="border-b-[6px] h-14 dark:border-[#1f2028] border-[#f3f4f6]">
		  <tr>
			<th :class="color">#</th>
			<th :class="color">Nom & Prénom</th>
			<th :class="color">Email</th>
			<th :class="color">Status de présence</th>
		  </tr>
		</thead>
		<tbody>
		  <tr v-if="studentList.length === 0">
			<td :class="color" colspan="4">Pas d'étudiant trouvé</td>
		  </tr>
		  <tr :class="border" class="dark:hover:bg-[#43494e] h-12 dark:bg-[#343a40] hover:bg-[#91919128] bg-[#ffff]" v-else v-for="(student, index) in studentList" :key="index">
			<th :class="color">{{ index + 1 }}</th>
			<td><StudentCell :studentName="student.name" /></td>
			<td><StudentCell :studentEmail="student.email" /></td>
			<td><StudentCell :studentPresenceStatus="student.presenceStatus" /></td>
		  </tr>
		</tbody>
	  </table>
	</div>
  </template>  