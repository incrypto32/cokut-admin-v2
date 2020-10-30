
<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <slot><v-btn color="primary">ADD</v-btn> </slot>
        </div>
      </template>
      <v-form ref="mealForm" v-model="valid" @submit.prevent="onSubmit">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            {{ formTitle }}
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-text-field
                v-model="mealForm.name"
                label="Name"
                :rules="rules.required"
                required
              ></v-text-field>

              <v-text-field
                v-model.number="mealForm.price"
                label="Price"
                type="number"
                 min=0
                :rules="rules.required"
                required
              ></v-text-field>

              <v-text-field
                v-model.number="mealForm.strikedPrice"
                label="Strike Price"
                type="number"
                step=0.1
                min=0
                :rules="rules.required"
                required
              ></v-text-field>

              <v-checkbox
                v-model="mealForm.special"
                label="Special"
                color="red"
            
                hide-details
              ></v-checkbox>

              <v-checkbox
                v-model="mealForm.spice"
                label="Spicey"
                color="red"
              
                hide-details
              ></v-checkbox>

            </v-container>
          </v-card-text>
          <v-container v-if="error" error--text text-center
            >An error occured please try again</v-container
          >
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
import { VForm } from "@/ts/models/models";
import { MealHelper, StoreHelper } from "@/ts/services/api";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class NewRestaurantDialog extends Vue {
  dialog = false;
  valid = false;
  loading = false;
  error = false;


  validators: any = {
    required: (v: any) => !!v || "Field is required",
  };

  rules: object = {
    required: [this.validators.required],
  };

  async onSubmit() {
    const form = new FormData();
    this.loading = true;
    this.error = false;
    this.mealForm.rid = this.$route.params.rid

    console.log(JSON.stringify(this.mealForm));
    try {
      for (const key in this.mealForm) {
        if (this.mealForm[key]) {
          form.append(key, this.mealForm[key]);
        }
      }
      await MealHelper.addMeal(form);
      (this.$refs.mealForm as VForm).reset();
      this.callback();
    } catch (error) {
      console.log(error);
      this.error = true;
    }

    this.loading = false;
  }

  formTitle = "New Meal";

  @Prop({
    required: true,
    type: Object,
  })
  mealForm!: any;

  @Prop({
    required: true,
    type: Function,
  })
  callback!: Function;
}
</script>