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
  }
};
</script>
<template>
  <div>
    <div v-if="studentList.length === 0">
      Pas d'étudiant trouvé
    </div>
    <div v-else>
      <div v-for="student in studentList" :key="student">
        <div>
			<table class="border-2 border-black w-full dark:border-[#59595b]">
      <tr>
        <th>#</th>
        <th>Nom & Prénom</th>
        <th>Email</th>
        <th>Status de présence</th>
      </tr>
      <tr :key="index">
        <th>{{ index + 1 }}</th>
        <td><StudentCell :studentName="student.name" /></td>
		<td><StudentCell :studentEmail="student.email" /></td>
		<td><StudentCell :studentPresenceStatus="student.presenceStatus" /></td>
      </tr>
    </table>
        </div>
      </div>
    </div>
  </div>
</template>
