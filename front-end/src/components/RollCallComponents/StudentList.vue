<script>
import StudentCell from "../RollCallComponents/StudentCell.vue";


let testStudentList = [
    //replace this list with the list of Students from db
    {
        name:"jean-claude",
        status:"absent"
    },
    {
        name:"jean-calude",
        status:"absent"
    }
]


export default {
    setup(){
        testStudentList
        return {
            testStudentList
        }
    },
    name:"StudentList",
    components: {
        StudentCell
    }
}

</script>
<template>
    <div v-for="student in testStudentList" :key="student.name">
        <div class="flex flex-row ">
            <StudentCell v-bind:studentname=student.name v-bind:status=student.status />
        </div>
    </div>
</template>