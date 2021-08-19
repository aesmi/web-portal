<template>
  <span>
    <v-card class="mt-4 mx-auto" max-width="800">
      <v-sheet class="v-sheet--offset mx-auto" color="cyan" elevation="12">
      </v-sheet>
      <v-card-text class="pt-0">
        <div class="title font-weight-light mb-2">Blood Pressure</div>

        <v-divider class="my-2"></v-divider>
      </v-card-text>
      <getBloodPressure></getBloodPressure>
      <!-- <v-icon class="mr-2" small>
          mdi-clock
        </v-icon> -->
      <!-- <span class="caption grey--text font-weight-light"
        >last registration 26 minutes ago</span
      > -->
    </v-card>
  </span>
</template>
<script>
import getBloodPressure from "@/components/GetBloodPressure.vue";
export default {
  components: {
    getBloodPressure
  }
};
</script>
