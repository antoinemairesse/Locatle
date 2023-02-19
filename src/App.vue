<template>
  <div>
    <NavBar/>
    <RouterView/>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
</script>
<style></style>
<style>
html, body, #app{
  width: 100%;
  height: 100%;
}
</style>
