<template>
    <NewSprint id="newSprintForm" v-if="showForm" @close="(this.showForm=false)"></NewSprint>
    <div class="container">
        <h1 class="marg">Organisation</h1>
        <div class="marg relative">
            <h2 style="font-size:36px;">Vos sprints</h2>
            <RouterLink to="/app/scrum" class="link">Retour</RouterLink>
            <button class="button" style="position:absolute;right:0px;top:5px;" @click="(this.showForm = true)">Créer un sprint</button>

            <table style="width:100%;background-color: #f0f0f0; border-radius: 10px;">
                <caption class="marg">Sprints</caption>
                <tbody>
                    <tr style="border-bottom:solid #bfbfbf;">
                        <th>Nom du sprint</th>
                        <th>Matière</th>
                        <th>Début</th>
                        <th>Fin</th>
                        <th>PO</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td>Labday semaine 1</td>
                        <td>VueJS/Nest</td>
                        <td>05/12/22</td>
                        <td>09/12/22</td>
                        <td>François</td>
                        <td style="padding:10px;width: fit-content;">
                            <button><img class="icon" alt="param_img" src="https://cdn-icons-png.flaticon.com/512/2089/2089792.png"></button>
                            <button style="background-color:red;"><img class="icon" alt="delete_img" src="https://cdn-icons-png.flaticon.com/512/542/542724.png"></button>
                        </td>
                    </tr>
                    <tr>
                        <td>LD s2</td>
                        <td>VueJS/Nest</td>
                        <td>05/12/22</td>
                        <td>09/12/22</td>
                        <td>François</td>
                        <td style="padding:10px;width: 120px;">
                            <button><img class="icon" alt="param_img" src="https://cdn-icons-png.flaticon.com/512/2089/2089792.png"></button>
                            <button style="background-color:red;"><img class="icon" alt="delete_img" src="https://cdn-icons-png.flaticon.com/512/542/542724.png"></button>
                        </td>
                    </tr>
                </tbody>

            </table>
           
        </div>
    </div>  
</template>

<script>
import NewSprint from '../components/NewSprint.vue';
export default {
    components: {
        NewSprint
    },
    data() {
        return {
            showForm: false,

        }
    },
    mounted() {
        console.log(this.showForm);
    }
}
</script>

<style>
.sprints {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}
.sprints tbody{
    width: 100%;
}
.rowSprint {
    width: 100%;
    position: relative;
    background-color: #f0f0f0;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: -7px;
}
.rowSprint td {
    text-align: center;
    padding: 10px;
}
.content {
    width:100%;
    padding: 20px;
    margin-bottom: auto;
}
.marg {
    margin: 10px;
}
.actualSprint {
    width: 80%;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 10px;
    font-size: 20px;
    position: relative;
}
.link {
    font-size: 15px;
    border-radius: 5px;
    padding: 5px;
    background-color: #bfbfbf;
    color: black;
}
.relative {
    position: relative;
}
button {
    background-color: #bfbfbf;
    padding: 5px;
    font-size: 15px;
}
.icon {
    width: 20px;
    height: 20px;
}
</style>