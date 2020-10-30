
<template>
  <div class="text-center">
    <v-dialog  v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <slot><v-btn color="primary">ADD</v-btn> </slot>
        </div>
      </template>
      <v-form ref="storeForm" v-model="valid" @submit.prevent="onSubmit">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            {{ formTitle }}
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-text-field
                v-model="storeForm.name"
                label="Name"
                :rules="rules.required"
                required
              ></v-text-field>

              <v-text-field
                v-model="storeForm.address"
                label="Address"
                :rules="rules.required"
                required
              ></v-text-field>

              <v-text-field
                v-model="storeForm.locationUrl"
                label="Location"
                :rules="rules.location"
                required
              ></v-text-field>

              <v-radio-group
                v-model="storeForm.type"
                row
                :rules="rules.required"
                required
              >
                <v-radio label="Regular" value="regular"></v-radio>
                <v-radio label="Homely" value="homely"></v-radio>
              </v-radio-group>

              <v-file-input
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick am Image for restaurant"
                prepend-icon="mdi-camera"
                v-model="storeForm.file"
                :rules="rules.required"
                label="Logo/image"
                required
              ></v-file-input>
            </v-container>
          </v-card-text>
     <v-container v-if="error" error--text text-center>An error occured please try again</v-container>
          <v-divider></v-divider>
          <v-progress-linear
            v-if="loading"
            :rules="rules.required"
            indeterminate
            color="cyan"
          ></v-progress-linear>

     

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text type="submit" :disabled="!valid"
              >ADD</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { VForm } from '@/ts/models/models';
import { StoreHelper } from "@/ts/services/api";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class NewRestaurantDialog extends Vue {
  dialog = false;
  valid = false;
  loading = false;
  error=false;

 

  validators: any = {
    required: (v: any) => !!v || "Field is required",
    location: (v: string) =>
      StoreHelper.canParseLocation(v) || "Please use a valid Google Maps URL",
  };

  rules: object = {
    required: [this.validators.required],
    location: [this.validators.required, this.validators.location],
  };

  parseLocation() {
    const url = this.storeForm.locationUrl;
    const location = url.split("@")[1].split(",");
    const latitude: string = location[0];
    const longitude: string = location[1];
    this.storeForm.latitude = latitude;
    this.storeForm.longitude = longitude;
  }
  parseLocation2() {
    const url = this.storeForm.locationUrl;
    const location = url.split("@")[1].split(",");
    const latitude: string = location[0];
    const longitude: string = location[1];
    this.storeForm.latitude = latitude;
    this.storeForm.longitude = longitude;
  }
  async onSubmit() {
    const form = new FormData();
    this.loading = true;
    this.error=false;
    console.log((JSON.stringify(this.storeForm)))
    try {
      this.parseLocation();
      for (const key in this.storeForm) {
        if (this.storeForm[key]) {
         form.append(key, this.storeForm[key]);
        }
      }
      await StoreHelper.addStore(form);
      (this.$refs.storeForm as VForm).reset()
      this.callback()
    } catch (error) {
      console.log(error)
      this.error=true
    }
    

    this.loading = false;
  }

  formTitle = "New Restaurant";

  @Prop({
    required: true,
    type: Object,
  })
 storeForm!: any;

    @Prop({
    required: true,
    type: Function,
  })
  callback!: Function;
}
</script>