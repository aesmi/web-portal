<template>
  <v-card class="mt-4 mx-auto" shaped>
    <v-sheet class="v-sheet--offset mx-auto" elevation="12"> </v-sheet>
    <v-card-text class="pt-0">
      <div class="title font-weight-light mb-2">Steps</div>
    </v-card-text>

    <v-divider class="my-0"></v-divider>

    <GetSteps></GetSteps>
  </v-card>
</template>
<script>
import GetSteps from "@/components/GetSteps.vue";

export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      setDate: null
    };
  },

  components: { GetSteps }
};
</script>
