<script>
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
        <div class="flex flex-row">
          <StudentCell :studentEmail="student.email" :studentName="student.name" :studentPresenceStatus="student.presenceStatus" />
        </div>
      </div>
    </div>
  </div>
</template>
