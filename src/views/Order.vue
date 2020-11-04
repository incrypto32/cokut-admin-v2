<template>
  <div>
    <v-dialog v-model="editStatusDialog" max-width="500px">
      <v-card>
        <v-form>
        <v-card-title class="headline">Edit Order Status</v-card-title>
        <v-card-text>
          <v-radio-group v-model="editedItem.statusCode" row >
            <v-radio label="Pending"  value=1></v-radio>
            <v-radio label="Delivered" value=2></v-radio>
            <v-radio label="Canceled"  value=3></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-progress-linear
          v-if="editStatusLoading"
          indeterminate
          color="cyan"
        ></v-progress-linear>
        <v-container text-center error--text v-if="editStatusError"
          >An error occured please try again</v-container
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditStatusDialog"
            >Cancel</v-btn
          >
          <v-btn color="red darken-1" text @click="editStatusConfirm">OK</v-btn>

 
          <v-spacer></v-spacer>
        </v-card-actions>
                 </v-form>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="ordersList"
      :loading="loading"
      :search="search"
      default-sort="false"
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
        </v-toolbar>
      </template>

      <template v-slot:[`item.user.name`]="{ item }">
        <v-col class="pa-0 py-3" align-self="start">
          <span class="d-block">{{ `Name  : ${item.user.name || ""}` }}</span>
          <span class="d-block"> {{ `Email : ${item.user.email || ""}` }}</span>
          <span class="d-block"> Phone : {{ item.user.phone || "" }}</span>
        </v-col>
      </template>

      <template v-slot:[`item.items`]="{ item }">
        {{ itemSummary(item) }}
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-chip  class="white--text font-weight-bold status-chip" :color="getStatusColor(item.statusCode)" @click="changeStatus(item)">{{getStatusFromCode(item.statusCode)}}</v-chip>
      </template>

      <template v-slot:[`item.total`]="{ item }">
        Cart Total : {{ item.price }} <br />
        Delivery Charge : {{ item.deliveryCharge }} <br />
        Grand Total : {{ item.total }} <br />
      </template>

      <template v-slot:[`item.go`]="{ item }">
        <v-btn
          color="green"
          :href="`https://www.google.com/maps/search/?api=1&query=${item.address.place.latitude},${item.address.place.longitude}`"
          rounded
        >
          <span class="white--text"> GO</span>
        </v-btn>
      </template>

      <template v-slot:[`item.time`]="{ item }">
        <div>{{ parseDate(item.time) }}</div>
      </template>

      <template v-slot:[`item.user.phone`]="{ item }">
        <div class="px-4">
          <v-row>
            <!-- <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
            <a
              :href="`https://wa.me/${(item.user.phone || '').substring(
                1
              )}?text=Thank%20you%20for%20ordering%20from%20Cokut`"
              ><v-icon small> mdi-chat</v-icon></a
            >
          </v-row>
        </div>
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Retry </v-btn>
      </template>
    </v-data-table>
  </div>
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
  editStatusLoading = false;

  editStatusError = false;
  dialog = false;
  editStatusDialog = false;
  staticUrl = ApiHelper.staticUrl;
  headers: object[] = [
    { text: "Restaurant", value: "restaurant.name" },
    { text: "User", value: "user.name" },
    { text: "Items", value: "items" },
    { text: "Status", value: "status" },
    { text: "Time Stamp", value: "time" },
    { text: "GO", value: "go" },
    { text: "Total", value: "total" },
    { text: "Actions", value: "user.phone" },
  ];

  ordersList: Array<Order> = [];
  editedIndex = -1;

  editedItem: any = {};

  defaultItem: any = {};

  parseDate(date: string) {
    const parsedDate = new Date(date);

    return `${parsedDate.toDateString()} ${parsedDate.toTimeString()}`;
  }
  created() {
    this.initialize();
  }

  get formTitle(): string {
    return this.editedIndex === -1 ? "New Item" : "Edit Item";
  }
  itemSummary(item: Order) {
    let result = "";
    item.summary.forEach((v) => {

      result += `${v.meal.name}  x  ${v.count} = ${v.price}\n`;
    });
    return result;
  }

  mapsUrl(latitude: number, longitude: number): string {
    return `https://www.google.com/maps/search/?api=1&query=@${latitude},${longitude}`;
  }

  getStatusColor(code: number){
    switch (code) {
      case 1:
        return "orange";
    

      case 2:
        return "green";


      case 3:
        return "red";
 

      default:
        return "orange";

    }
  }
  getStatusFromCode(code: number) {
    switch (code) {
      case 1:
        return "Placed";
    

      case 2:
        return "Delivered" ;


      case 3:
        return "Canceled";
 

      default:
        return "Placed";

    }
  }
  async initialize() {
    this.loading = true;
    try {
     
      this.ordersList = await OrderHelper.getOrders();
    } catch (error) {
      console.log(error);
      this.ordersList = [];
    }
    this.editedItem = this.defaultItem;
    this.loading = false;
  }

  editItem(item: any) {
    
    this.editedIndex = this.ordersList.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
  }

  changeStatus(item: any) {
    this.editStatusLoading = false;
    this.editStatusError = false;
    this.editedIndex = this.ordersList.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.editStatusDialog = true;
  }

  async editStatusConfirm() {
    console.log("____________________________________FIREFIRE___________________________----")
    const item = this.ordersList[this.editedIndex];
    this.editStatusLoading = true;
    let order: Order;

    try {
     order= await OrderHelper.changeStatus(item.id, parseInt(this.editedItem.statusCode));
       this.ordersList[this.editedIndex].statusCode=order.statusCode 
    
    } catch (error) {
      console.log(error);
      this.editStatusError=true;
    }
    this.closeEditStatusDialog();
  
    this.editStatusLoading = false;
  }

  close() {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = this.defaultItem;
      this.editedIndex = -1;
    });
  }

  closeEditStatusDialog() {
    this.editStatusDialog = false;
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
  oneditStatusDialog(val: any) {
    val || this.close();
  }

  @Watch("editStatusDialog")
  ondialogClose(val: any) {
    val || this.closeEditStatusDialog();
  }
}
</script>

<style lang="scss" scoped>
.status-chip{
  min-width: 100px;
  text-align: center;
  display: block;
}
</style>