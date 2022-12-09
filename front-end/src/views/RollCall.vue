<script>
import StudentList from '../components/RollCallComponents/StudentList.vue';
import QrCode from '../components/RollCallComponents/QrCode.vue';
import Chat from '../components/RollCallComponents/RollCallChat.vue';

export default {
    components:{
        StudentList,
        QrCode,
        Chat,
    }
}

</script>
<template>
        <QrCode url="https://www.impots.gouv.fr/accueil" />
        <StudentList />
        <Chat/>
</template>
