<template>
  <v-data-table
    :headers="headers"
    :items="ordersList"
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
        <v-toolbar-title>Orders</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

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

    <template v-slot:[`item.user`]="{ item }">
      <v-col class="pa-0 py-3" align-self="start">
        <span class="d-block">{{ `Name  : ${item.user.name}` }}</span>
        <span class="d-block"> {{ `Email : ${item.user.email}` }}</span>
        <span class="d-block">{{ `Phone : ${item.user.phone}` }}</span>
      </v-col>
    </template>

    <template v-slot:[`item.items`]="{ item }">
      {{ itemSummary(item) }}
    </template>

    <template v-slot:[`item.total`]="{ item }">
      Cart Total : {{item.price}} <br>
      Delivery Charge : {{item.deliveryCharge}} <br>
      Grand Total : {{item.total}} <br>
    </template>

    <template v-slot:[`item.go`]="{ item }">
    <v-btn color="green" :href="`https://www.google.com/maps/search/?api=1&query=${item.address.place.latitude},${item.address.place.longitude}`" rounded>
        <span class="white--text"> GO</span>
    </v-btn>
    </template>

   

    <template v-slot:[`item.actions`]="{ item }">
      <div class="px-4">
        <v-row>
          <!-- <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
          <a :href="`https://wa.me/${item.user.phone.substring(1)}?text=Thank%20you%20for%20ordering%20from%20Cokut`"><v-icon small > mdi-chat</v-icon></a>
        </v-row>
      </div>
    </template>

    <template v-slot:no-data>
  a    <v-btn color="primary" @click="initialize"> Retry </v-btn>
    </template>
  </v-data-table>
</template>



<script lang="ts">
import NewRestaurantDialog from "@/components/dialogs/NewRestaurantDialog.vue";
import { Order, Restaurant } from "@/ts/models/models";
import { ApiHelper, OrderHelper, StoreHelper } from "@/ts/services/api";

import { Component, Vue, Watch } from "vue-property-decorator";
import { Store } from "vuex";

@Component({
  components: {
    NewRestaurantDialog,
  },
})
export default class Orders extends Vue {
  search = "";
  loading = false;
  deleteLoading = false;
  deleteError = false;
  dialog = false;
  dialogDelete = false;
  staticUrl = ApiHelper.staticUrl;
  headers: object[] = [
    { text: "Restaurant", value: "restaurant.name" },
    { text: "User", value: "user" },
    { text: "Items", value: "items" },
    { text: "Status", value: "status" },
     { text: "GO", value: "go" },
  

    { text: "Total", value: "total" },
    { text: "Actions", value: "actions", sortable: false },
  ];

  ordersList: Array<Order> = [];
  editedIndex = -1;

  editedItem: any = {};

  defaultItem: any = {};

  created() {
    this.initialize();
  }

  get formTitle(): string {
    return this.editedIndex === -1 ? "New Item" : "Edit Item";
  }
  itemSummary(item: Order) {
    let result = "";
    item.summary.forEach((v) => {
      console.log(JSON.stringify(v));
      result += `${v.meal.name}  x  ${v.count} = ${v.price}\n`;
    });
    return result;
  }


  mapsUrl(latitude: number, longitude: number): string {
    return `https://www.google.com/maps/search/?api=1&query=@${latitude},${longitude}`;
  }

  async initialize() {
    this.loading = true;
    try {
      console.log("____________________");
      this.ordersList = await OrderHelper.getOrders();
    } catch (error) {
      console.log(error);
      this.ordersList = [];
    }
    this.editedItem = this.defaultItem;
    this.loading = false;
  }

  editItem(item: any) {
    console.log("hi");
    this.editedIndex = this.ordersList.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
  }

  deleteItem(item: any) {
    this.deleteLoading = false;
    this.deleteError = false;
    this.editedIndex = this.ordersList.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialogDelete = true;
  }
  async changeStatus(id: string, val: boolean) {
    try {
      //   await StoreHelper.changeordersListtatus(id, val);
      this.initialize();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItemConfirm() {
    const item = this.ordersList[this.editedIndex];
    this.deleteLoading = true;

    try {
      // await StoreHelper.deleteStore(item.id);
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
      Object.assign(this.ordersList[this.editedIndex], this.editedItem);
    } else {
      this.ordersList.push(this.editedItem);
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