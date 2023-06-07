<template>
<div class="backdrop" @click="$emit('close')" />
<div class="popUpItem bg-light-tertiary dark:bg-dark-tertiary">
    <button class=" closeBtn rounded-lg" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="dark-icon"
            viewBox="0 0 16 16">
            <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
        </svg>
    </button>
    <form class="materialsIdeas-form" @submit.prevent="postBdd">
        <span class="text-dark-secondary dark:text-dark-font text-3xl">Ajouter une proposition
        </span>
        <span class="text-2xl text-dark-secondary dark:text-dark-font">{{ title }}</span>
        <div class=" formIdeas mb-3">
            <input id="price" class="bg-light-secondary text-dark-secondary border sm:text-sm rounded-lg p-2.5 placeholder-gray-400"
                placeholder="Prix" v-model="price" />
            <input id="desc" class="bg-light-secondary  text-dark-secondary border sm:text-sm rounded-lg p-2.5 placeholder-gray-400"
                placeholder="Description" v-model="desc" />
            <input id="link" class="bg-light-secondary  text-dark-secondary border sm:text-sm rounded-lg p-2.5 placeholder-gray-400"
                placeholder="Lien" v-model="link" />
            <input id="motiv" class="bg-light-secondary text-dark-secondary border sm:text-sm rounded-lg p-2.5 placeholder-gray-400"
                placeholder="Pour quel usage ?" v-model="motiv" />
            <button
                class="font-bold rounded-lg text-white text-sm px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant w-full"
                @click="$emit('validation')">Valider</button>

        </div>

    </form>
    </div>
</template>
<script>
import { http } from "@/api/network/axios";
export default {
    props: ["title"],

    methods: {
        async postBdd() {
            await http.post("/ideasequipments/add", {
                title: this.title,
                price: this.price,
                desc: this.desc,
                link: this.link,
                motiv: this.motiv,
            })
            this.$emit('close')
            this.$emit('validation')
    }
        
    }

   
}
</script>
<style>

</style>