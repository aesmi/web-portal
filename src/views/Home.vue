<template>
  <div class="home">
    <Dashboard></Dashboard>
  </div>
</template>

<script>
import Dashboard from "@/components/Dashboard.vue";
// @ is an alias to /src

export default {
  name: "Home",
  components: {
    Dashboard
  },
  data() {
    return {};
  }
};
</script>
