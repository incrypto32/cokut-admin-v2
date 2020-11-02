<template>
  <div>
    <AppBar />
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import AppBar from "../components/AppBar.vue";

export default Vue.extend({
  name: "App",
  components: {
    AppBar,
  },

  mounted: () => {
    console.log("mounted boi ..!!");
  },

  data: () => ({
    //
  }),
});
</script>