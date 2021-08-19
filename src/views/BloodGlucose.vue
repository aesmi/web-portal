<template>
  <v-card class="mt-4 mx-auto" max-width="800">
    <v-sheet class="v-sheet--offset mx-auto" color="cyan" elevation="12">
    </v-sheet>
    <v-card-text class="pt-0">
      <div class="title font-weight-light mb-2">Blood Glucose</div>

      <v-divider class="my-2"></v-divider>
    </v-card-text>
    <GetBloodGlucose></GetBloodGlucose>
  </v-card>
</template>

<script>
import GetBloodGlucose from "@/components/GetBloodGlucose.vue";
// import LineChart from "@/components/LineChart.vue";
export default {
  components: {
    GetBloodGlucose
  }
};
</script>

<style></style>
