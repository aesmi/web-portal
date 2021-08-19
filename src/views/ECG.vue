<template>
  <v-card class="mt-4 mx-auto">
    <v-sheet class="v-sheet--offset mx-auto" elevation="12"> </v-sheet>
    <v-card-text class="pt-0">
      <div class="title font-weight-light mb-2">ECG</div>
    </v-card-text>

    <v-divider class="my-0"></v-divider>

    <GetECG></GetECG>
  </v-card>
</template>
<script>
import GetECG from "@/components/GetECG.vue";

export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      setDate: null
    };
  },

  components: { GetECG }
};
</script>
