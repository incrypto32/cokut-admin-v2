<template>
  <v-data-table
    :headers="headers"
    :items="meals"
    sort-by="calories"
    :loading="loading"
    loading-text="Loading .. Please wait"
     :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{title}}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
        <v-spacer></v-spacer>
        <new-restaurant-dialog
          v-bind:dialog="dialog"
          :close="close"
         v-bind:mealForm="defaultItem"
          :callback="initialize"
        />

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-progress-linear
              v-if="deleteLoading"
              indeterminate
              color="cyan"
            ></v-progress-linear>
            <v-container text-center error--text v-if="deleteError"
              >An error occured please try again</v-container
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="red darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:[`item.image`]="{ item }">
      <v-img
        :lazy-src="`${staticUrl}/restaurants/${item.id}`"
        max-height="100"
        max-width="100"
        :hi="item.name"
        :src="`${staticUrl}/restaurants/${item.id}.png`"
      ></v-img>
    </template>

    <template v-slot:[`item.action`]="{ item }">
      <v-btn :color="item.closed ? 'success' : 'error'" min-width="100px" @click="changeStatus(item.id,!item.closed)">{{
        item.closed ? "open" : "close"
      }}</v-btn>
    </template>

    <template v-slot:[`item.locationUrl`]="{ item }">
      <a :href="item.locationUrl">GO</a>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <div class="px-4">
        <v-row>
          <!-- <new-restaurant-dialog
            v-bind:dialog="dialog"
            :close="close"
            v-bind:mealForm="editedItem"
            :callback="initialize"
          >
            <v-icon small @click="editItem(item)"> mdi-pencil </v-icon>
          </new-restaurant-dialog> -->

          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </v-row>
      </div>
    </template>
    <template v-slot:no-data>
     <v-container pa-3></v-container>
      <v-btn color="primary" @click="initialize"  > Retry </v-btn>
      <v-container v-if="getError" text-center error--text >An error occured please try again</v-container>
    </template>
  </v-data-table>
</template>



<script lang="ts">
import NewRestaurantDialog from "@/components/dialogs/Meals.vue";
import { Meal, Restaurant } from "@/ts/models/models";
import { ApiHelper, MealHelper, StoreHelper } from "@/ts/services/api";

import { Component, Vue, Watch } from "vue-property-decorator";
import { Store } from "vuex";


@Component({
  components: {
    NewRestaurantDialog,
  },
})
export default class Stores extends Vue {
  search=''
  loading = false;
  deleteLoading = false;
  getError=false;
  deleteError = false;
  dialog = false;
  dialogDelete = false;
  staticUrl=ApiHelper.staticUrl

  headers: object[] = [
    {
      text: "Name",
      align: "start",
      value: "name",
    },

    {
      text: "Price",
      align: "start",
      value: "price",
    },
     {
      text: "Striked Price",
      align: "start",
      value: "strikedPrice",
    },

    { text: "Special", value: "special" },
    { text: "Spice", value: "spice" },
    { text: "Available", value: "available"},
    { text: "Action", value: "actions" },
  ];

  meals: Array<Meal> = [];
  editedIndex = -1;

  editedItem: Meal = {
    id:"",
    rid:"",
    name:"",
    available:false,
    spice:false,
    special:false,
    price:0.0,
    strikedPrice:0.0
  }

  defaultItem: Meal = {
    id:"",
    rid:"",
    name:"",
    available:false,
    spice:false,
    special:false,
    price:0.0,
    strikedPrice:0.0

  };

  created() {
    this.initialize();
  }

  get formTitle(): string {
    return this.editedIndex === -1 ? "New Item" : "Edit Item";
  }

  get title(): string {
    return `${this.$route.params.name} > Meals`
  }

  mapsUrl(latitude: number, longitude: number): string {
    return `https://www.google.com/maps/search/?api=1&query=@${latitude},${longitude}`;
  }

  async initialize() {
    this.loading = true;
    this.getError=false;
    try {
      console.log("____________________");
      this.meals = await MealHelper.getMeals(this.$route.params.rid);
    } catch (error) {
      console.log(error);
      this.meals = [];
      this.getError=true
    }
    this.editedItem = this.defaultItem;
    this.loading = false;
  }

  editItem(item: any) {
    console.log("hi");
    this.editedIndex = this.meals.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
  }

  deleteItem(item: any) {
    this.deleteLoading = false;
    this.deleteError = false;
    this.editedIndex = this.meals.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialogDelete = true;
  }
  async changeStatus(id: string, val: boolean) {
    try {
      await StoreHelper.changeStoreStatus(id, val);
      this.initialize()
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItemConfirm() {
    const item = this.meals[this.editedIndex];
    this.deleteLoading = true;

    console.log(item.id)

    try {
      await MealHelper.deleteMeal(item.id);
    } catch (error) {
      console.log(error);
    }
    this.closeDelete();
    this.initialize();
    this.deleteLoading = false;
  }

  close() {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = this.defaultItem;
      this.editedIndex = -1;
    });
  }

  closeDelete() {
    this.dialogDelete = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
  }

  save() {
    if (this.editedIndex > -1) {
      Object.assign(this.meals[this.editedIndex], this.editedItem);
    } else {
      this.meals.push(this.editedItem);
    }
    this.close();
  }

  @Watch("dialog")
  ondialogDelete(val: any) {
    val || this.close();
  }

  @Watch("dialogDelete")
  ondialogClose(val: any) {
    val || this.closeDelete();
  }
}
</script>