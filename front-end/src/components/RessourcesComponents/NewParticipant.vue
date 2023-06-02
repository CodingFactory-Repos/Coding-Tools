<template>
    <div>
        <button type="button" @click="showNewParticipant">add participant</button>    <!--btn afficher gestion d'ajout-->
        <div v-show="showParticipant">
            <input  type="text"  placeholder="name :" v-model="name" @input="searchUser">       <!--input = name et lance recherche de correspondance-->
				<button type="button" @click="addParticipants(); showNewParticipant()">Ok</button> <br>     <!--ajout d'un new participant et fermer div d'ajout-->
        </div>
        <p v-for="user in participants">{{ user.name }}</p><br>  <!--afficher les participants ajouter-->
    </div>
</template>

<script lang="ts">
import {http} from "@/api/network/axios"
export default{
    data(){
        return{
        firstName : "",
		lastName : "",
        name : "",
        usersNames: [],
        userName : {firstName: "", lastName: ""},
        showParticipant : false,
        }
    },
    props : {
        participants : {        //props participants a envoyer pour le form
            type : Array<{name : string}>,
            required : true, 
        }
    },
    methods:{
        showNewParticipant(){   //gestion d'affichage d'ajout
            this.showParticipant = !this.showParticipant;
        },

        addParticipants(){    
			let participant = {name : ""};
			if(this.name != ""){   // si le participant ajouter est pas nul: 
                participant = { name : this.name};
				this.participants.push(participant);
				this.name = "";
			}
		},
        searchUser(){    //recherche de participant
            this.getUsers();  // recuperer les users de la bdd
            this.usersNames.forEach(element =>{
                console.log(element);
            })
         
        },
        getUsers() {
		    http.get('http://localhost:8010/openhouses/users').then((response) => {
			    this.users = response.data;
                this.users.forEach(element => {
                    this.userName = {firstName: element.profile.firstName, lastName: element.profile.lastName};
                    if(!this.userCheckList()){
                        this.usersNames.push(this.userName);
                    }
                });
		    });
        },
        userCheckList(){
            let alreadyInList = false;
            this.usersNames.forEach(element => {
                if(element.lastName == this.userName.lastName){
                    if(element.firstName == this.userName.firstName){
                        alreadyInList = true;
                    }
                }
            });
            return alreadyInList;
        },
    },
}
</script>
