<template>
    <div class="container">
        <h1 class="marg">Organisation</h1>
        <div class="actualSprint marg">Sprint de la semaine: VueJS, du 05/12 au 09/12 avec François<br/>
            <RouterLink to="scrum/sprint" class="link">Afficher les sprints</RouterLink>
        </div>
        <div class="marg relative">
            <h2 style="font-size:36px;">Vos groupes</h2>
            <button class="button" style="position:absolute;right:10px;top:5px;" @click="(this.showForm = true)">Créer un groupe</button>
            <div class="groups">
                <div class="iconeGroupe">
                    <span style="font-size:20px;">Nom du groupe</span>
                    <div style="position:absolute;right:10px;bottom:10px;">
                        <button><img class="icon" src="https://cdn-icons-png.flaticon.com/512/2089/2089792.png" alt="More"></button>
                        <button style="background-color:red;"><img class="icon" src="https://cdn-icons-png.flaticon.com/512/542/542724.png" alt="Delete"></button>
                    </div>
                    <div style="position:absolute;left:10px;bottom:10px;">
                        <button>Ouvrir le tableau</button>
                    </div>
                </div>
                
                <div class="iconeGroupe">
                    <span style="font-size:20px;">Nom du groupe</span>
                    <div style="position:absolute;right:10px;bottom:10px;">
                        <button><img class="icon" src="https://cdn-icons-png.flaticon.com/512/2089/2089792.png" alt="More"></button>
                        <button style="background-color:red;"><img class="icon" src="https://cdn-icons-png.flaticon.com/512/542/542724.png" alt="Delete"></button>
                    </div>
                    <div style="position:absolute;left:10px;bottom:10px;">
                        <button>Créer un tableau</button>
                    </div>
                </div>

                <div class="iconeGroupe">
                    <span style="font-size:20px;">Nom du groupe</span>
                    <div style="position:absolute;right:10px;bottom:10px;">
                        <button><img class="icon" src="https://cdn-icons-png.flaticon.com/512/2089/2089792.png" alt="More"></button>
                        <button style="background-color:red;"><img class="icon" src="https://cdn-icons-png.flaticon.com/512/542/542724.png" alt="Delete"></button>
                    </div>
                    <div style="position:absolute;left:10px;bottom:10px;">
                        <button>Créer un tableau</button>
                    </div>
                </div>
            </div>
        </div>
    </div>  
    <NewGroup id="newGroupForm" v-if="showForm" @close="(this.showForm=false)"></NewGroup>
</template>

<script lang='ts'>
import NewGroup from '../components/NewGroup.vue';
export default {
    components: {
        NewGroup
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
.groups {
    display: flex;
    flex-wrap: wrap;
}
.iconeGroupe {
    min-width: 260px;
    width: 20%;
    height: 200px;
    position: relative;
    background-color: #f0f0f0;
    border-radius: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
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
    width: fit-content;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 10px;
    font-size: 20px;
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