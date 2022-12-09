<script>
import StudentList from '../components/RollCallComponents/StudentList.vue';
import QrCode from '../components/RollCallComponents/QrCode.vue';

export default {
    components:{
        StudentList,
        QrCode
    }
}

</script>
<template>
        <QrCode url="https://www.impots.gouv.fr/accueil" />
        <StudentList />
</template>
