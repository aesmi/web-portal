<template>
  <v-card class="mt-4 mx-auto" shaped>
    <v-sheet class="v-sheet--offset mx-auto" elevation="12"> </v-sheet>
    <v-card-text class="pt-0">
      <div class="title font-weight-light mb-2">Sleep</div>
    </v-card-text>

    <v-divider class="my-0"></v-divider>

    <GetSleep></GetSleep>
  </v-card>
</template>
<script>
import GetSleep from "@/components/GetSleep.vue";

export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      setDate: null
    };
  },

  components: { GetSleep }
};
</script>
