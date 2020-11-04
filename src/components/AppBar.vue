<template>
  <v-app-bar app light>
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Name"
        class="shrink mt-1 hidden-sm-and-down"
        contain
        min-width="100"
        src="../assets/logo.png"
        width="100"
      />
    </div>

    <v-spacer></v-spacer>

    <v-btn to="/" text>
      <span class="mr-2">Restaurants</span>
    </v-btn>


    <!-- <v-btn
     to="/meals/blah"
      text
    >
      <span class="mr-2">Meals</span>
    </v-btn> -->

    <v-btn to="/orders" text>
      <span class="mr-2">Orders</span>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "AppBar",
});
</script>