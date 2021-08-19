<template>
  <v-app>
    <NewNav />
    <v-content>
      <v-container>
        <v-layout>
          <v-flex
            ><transition name="fade" mode="out-in">
              <keep-alive
                ><router-view :key="$route.path"/></keep-alive></transition
          ></v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import NewNav from "@/components/NewNav.vue";
export default {
  components: { NewNav }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 0px;
  margin: 0px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.25s ease;
}

.fade-leave-active {
  transition: opacity 0.25s ease;
  opacity: 0;
}
</style>
