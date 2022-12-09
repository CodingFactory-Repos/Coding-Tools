<template>
  <div class="container">
    <h1>Materials</h1>
    <form @submit.prevent="addMaterial">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" v-model="name" placeholder="Enter name" />
      </div>

      <div class="form-group">
        <label for="Type">Type</label>
        <select v-model="type" class="form-control">
          <option value="Hardware">Hardware</option>
          <option value="Mac">Mac</option>
          <option value="Livre">Livres</option>
        </select>
      </div>

      <div class="form-group">
        <label for="price">price</label>
        <input
            type="number"
            class="form-control"
            id="price"
            v-model="price"
            placeholder="Enter price"
        />
      </div>

      <div class="form-group">
        <label for="picture">picture</label>
        <input
            type="text"
            class="form-control"
            id="picture"
            v-model="picture"
            placeholder="Enter picture"
        />
      </div>

      <div class="form-group">
        <label for="state">state</label>
        <select v-model="state" class="form-control">
          <option value="Excellent">Etat Excellent</option>
          <option value="Bon">Bon Etat</option>
          <option value="Mauvais">Mauvais Etat</option>
        </select>
      </div>

      <div class="form-group">
        <label for="site">site</label>
        <select v-model="site" class="form-control">
          <option value="Cergy">Cergy</option>
          <option value="Paris">Paris</option>
        </select>
      </div>

      <div class="form-group">
        <label for="storageCupboard">storageCupboard</label>
        <select v-model="storageCupboard" class="form-control">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <input
            type="text"
            class="form-control"
            id="description"
            v-model="description"
            placeholder="Enter description"
        />
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
// Post the data to the API
import axios from 'axios';

export default {
  name: 'CreateMaterials',
  data() {
    return {
      name: '',
      type: '',
      price: '',
      picture: '',
      state: '',
      site: '',
      storageCupboard: '',
      description: '',
    };
  },
  methods: {
    //Create a POST with axios
    addMaterial() {
      axios
          .post('http://localhost:8000/materials/create', {
            name: this.name,
            type: this.type,
            price: this.price,
            acquisitionDate: Date.now(),
            picture: this.picture,
            state: this.state,
            siteLocation: this.site,
            storageCupboard: this.storageCupboard,
            description: this.description,
            borrowingHistory: [],
            status: true,
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
    },
  },
};
</script>

<style scoped></style>