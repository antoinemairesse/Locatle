<template>
  <nav class="bg-blue-600/[0.5] w-screen p-2 text-white flex gap-4 items-center text-lg">
    <router-link class="flex gap-2 items-center mr-10" to="/">
      <img src="/favicon.png" alt="Locatle logo">
      <span class="text-xl">Locatle</span>
    </router-link>
    <div class="flex gap-12">
      <router-link v-for="route in routes" :to="route.path">
        <span :class="{'underline': $route.path === route.path}">
          {{route.text}}
        </span>
      </router-link>
    </div>
  </nav>
</template>

<script lang="ts">

type Route = {
  path: string,
  text: string
}

type Data = {
  routes: Array<Route>
}

export default {
  name: "NavBar",
  data(): Data {
    return {
      routes: [
        {path: '/game/daily', text: 'Daily guess'},
        {path: '/game/practice', text: 'Practice'}
      ]
    }
  }
};
</script>

<style scoped>
router-link{
  cursor: pointer;
}
</style>