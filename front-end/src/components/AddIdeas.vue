<template>
    <div class="wrapper">
        <form @submit.prevent="addItem" autocomplete="off">
            <h1 class="dark-primary dark:text-dark-font">Suggestion de matériel</h1>
            <!-- to add new item into the list -->
            <div class="task">
                <input type="text" class="task-input" v-model="title" placeholder="Ajouter une suggestion" />
                <!-- Add item on click -->
                <button class="button btn-add text-black dark:text-dark-font font-bold"
                    @click="openPopUp = true"
                    :disabled="title === ''">Ajouter</button>
            </div>

            <!-- Show added items in list view-->
            <ul class="task-list">
                <li class="task-list-item" v-for="(item, index) in items" :key="index"
                    v-bind:class="{ completed: item.completed }">
                    <span class="text-black dark:text-dark-font">{{ item.text }}</span>
                    <!-- create devis on click-->
                    <button v-on:click="" class="button text-black dark:text-dark-font">Créer un devis</button>
                    <!-- delete item on click-->
                    <button @click="deleteItem(index)"
                        class="button btn-delete text-black dark:text-dark-font">Supprimer</button>
                </li>
            </ul>
        </form>
    </div>
        <PopUp :title="title" @close="closePopup" v-if="openPopUp" />
</template>
  
<script>
import { http } from "@/api/network/axios";
import PopUp from './common/PopUp.vue'

export default {
    data() {
        return {
            newItem: "", //item before adding into array
            openPopUp: false,
            title: ""
        };
    },
    computed: {
        totalItems() {
            return this.items.length; //auto increment of 1 of each items added into array
        },
        isComplete() {
            return this.items.filter(item => item.completed).length; //to get completed [checkbox: checked] 
        },
        async items(){
            return await this.getBdd()
        }
    },
    methods: {
        addItem() {
            if (this.newItem !== "") {
                this.items.push({ text: this.newItem, completed: false }); //check if input field is empty, if not empty then push [input] into array [items] and mark not completed [checkbox: unchecked]

            }
        },
        deleteItem(index) {
            console.log(index)
            this.items.splice(index, 1); //remove item
        },
        closePopup() {
            this.openPopUp = false;
        },
        async getBdd() {
            const items = 
            await http.get("/ideasequipments", {
                title: this.title,
                price: this.price,
                desc: this.desc,
                link: this.link,
                comments: this.comments,
            })
            console.log(items)
            return []
        }
    },
    components: {
        PopUp
    }
};




</script>
  
<style lang="scss">
@import "../assets/styles/components/add-ideas.css";
@import "../assets/styles/components/common/pop-up.css";
</style>