<template>
    <div>
        <button type="button" @click="showNewParticipant">add participant</button>
        <div v-show="showParticipant">
            <input  type="text"  placeholder="first name :" v-model="firstName">
				<input  type="text"  placeholder="last name :" v-model="lastName">
				<button type="button" @click="addParticipants(); showNewParticipant()">Ok</button> <br>
        </div>
        <p v-for="user in participants">{{ user.name }}</p><br>
    </div>
</template>

<script lang="ts">

export default{
    data(){
        return{
        firstName : "",
		lastName : "", 
        showParticipant : false,
        }
    },
    props : {
        participants : {
            type : Array<{name : string}>,
            required : true, 
        }
    },
    methods:{
        showNewParticipant(){
            this.showParticipant = !this.showParticipant;
        },

        addParticipants(){
            let name = "";
			let participant = {name : ""};
			if(this.lastName != "" && this.firstName != ""){
				name  =  this.firstName + " " + this.lastName;
                participant = { name : name};
				this.participants.push(participant);
				this.firstName = "";
				this.lastName = "";
			}
		},
    },
}
</script>
