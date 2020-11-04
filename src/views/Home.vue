<template>
  <v-data-table
    :headers="headers"
    :items="stores"
    sort-by="calories"
    :loading="loading"
    :search="search"
    disable-pagination
    hide-default-footer
    loading-text="Loading .. Please wait"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Restaurants</v-toolbar-title>
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
          v-bind:storeForm="defaultItem"
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
 
        height="100"
        width="100" 
        contain
        :hi="item.name"
        :src="`${staticUrl}/restaurants/${item.id}.png`"
      ></v-img>
    </template>

    <template v-slot:[`item.action`]="{ item }">
      <v-btn
        :color="item.closed ? 'success' : 'error'"
        min-width="100px"
        @click="changeStatus(item.id, !item.closed)"
        >{{ item.closed ? "open" : "close" }}</v-btn
      >
    </template>

    <template v-slot:[`item.locationUrl`]="{ item }">
      <v-btn color="green" :href="item.locationUrl" rounded>
        <span class="white--text"> GO</span>
      </v-btn>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <div class="px-4">
        <v-row>
          <!-- <new-restaurant-dialog
            v-bind:dialog="dialog"
            :close="close"
            v-bind:storeForm="editedItem"
            :callback="initialize"
          >
            <v-icon small @click="editItem(item)"> mdi-pencil </v-icon>
          </new-restaurant-dialog> -->

          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          <v-icon small @click="navigate(item)"> mdi-hamburger </v-icon>
        </v-row>
      </div>
    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Retry </v-btn>
    </template>
  </v-data-table>
</template>



<script lang="ts">
import NewRestaurantDialog from "@/components/dialogs/NewRestaurantDialog.vue";
import { Restaurant } from "@/ts/models/models";
import { ApiHelper, StoreHelper } from "@/ts/services/api";

import { Component, Vue, Watch } from "vue-property-decorator";
import { Store } from "vuex";

@Component({
  components: {
    NewRestaurantDialog,
  },
})
export default class Stores extends Vue {
  search = "";
  loading = false;
  deleteLoading = false;
  deleteError = false;
  dialog = false;
  dialogDelete = false;
  staticUrl = ApiHelper.staticUrl;
  headers: object[] = [
    { text: "Image", value: "image" },
    { text: "Name", value: "name" },
    { text: "Type", value: "type" },
    { text: "Address", value: "address" },
    { text: "Location", value: "locationUrl" },
    { text: "Latitude", value: "location.latitude" },
    { text: "Longitude", value: "location.longitude" },
    { text: "Close/Open", value: "action" },
    { text: "Actions", value: "actions", sortable: false },
  ];
  stores: Array<Restaurant> = [];
  editedIndex = -1;

  editedItem: Restaurant = {
    id: "",
    phone: "",
    email: "",
    logo: "",
    name: "",
    type: "",
    address: "",
    locationUrl: "",
    location: {},
    closed: false,
  };

  defaultItem: Restaurant = {
    id: "",
    phone: "",
    email: "",
    logo: "",
    name: "",
    type: "regular",
    address: "",
    locationUrl: "",
    location: {},
    closed: false,
  };

  created() {
    this.initialize();
  }

  get formTitle(): string {
    return this.editedIndex === -1 ? "New Item" : "Edit Item";
  }

  mapsUrl(latitude: number, longitude: number): string {
    return `https://www.google.com/maps/search/?api=1&query=@${latitude},${longitude}`;
  }
  navigate(item: Restaurant) {
    this.$router.push({
      name: "meals",
      params: { rid: item.id, name: item.name },
    });
  }

  async initialize() {
    this.loading = true;
    try {
      console.log("____________________");
      this.stores = await StoreHelper.getStores();
    } catch (error) {
      console.log(error);
      this.stores = [];
    }
    this.editedItem = this.defaultItem;
    this.loading = false;
  }

  editItem(item: any) {
    console.log("hi");
    this.editedIndex = this.stores.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
  }

  deleteItem(item: any) {
    this.deleteLoading = false;
    this.deleteError = false;
    this.editedIndex = this.stores.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialogDelete = true;
  }
  async changeStatus(id: string, val: boolean) {
    try {
      await StoreHelper.changeStoreStatus(id, val);
      this.initialize();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItemConfirm() {
    const item = this.stores[this.editedIndex];
    this.deleteLoading = true;

    try {
      await StoreHelper.deleteStore(item.id);
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
      Object.assign(this.stores[this.editedIndex], this.editedItem);
    } else {
      this.stores.push(this.editedItem);
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