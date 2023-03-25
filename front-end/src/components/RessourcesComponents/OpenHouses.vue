<template>
	<div>
        <FormOpenHouse />

	</div>
</template>

<script lang="ts">
import {http} from "@/api/network/axios"
import FormOpenHouse from "./FormOpenHouses.vue"

export default {
    data(){
        return{
            /* list of all open houses */
			openHouses: [],
            openForm : false,

            usersNames: [],
            userName : {firstName: "", lastName: ""},

        }   
    }, 
    components: {
        FormOpenHouse
	},
    methods : {
        getUsers() {
          //  this.openForm=!this.openForm
            
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

        async mounted() {
            await http.get('http://localhost:8010/openhouses').then((response) => {
                console.log(response);
                this.openHouses = response.data;
                console.log(this.openHouses);
            });
        } 
    }

}
</script>




