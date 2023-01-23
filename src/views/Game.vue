<template>
  <div class="w-full h-full flex flex-col items-center justify-center align-middle">
    <div class="mb-4">
      <h1 class="text-center font-semibold">
        <span class="text-2xl font-bold">
          Click on this country :
          <span class="text-green-700">{{countryToGuess}}</span>
        </span>
      </h1>
      <h1
        v-if="win"
        class="text-center text-xl text-green-700 font-semibold m-0"
      >
        You guessed <span class="font-bold">{{countryToGuess}}</span> correctly, GG !
      </h1>
    </div>
    <Globe
      v-model:countryToGuess="countryToGuess"
      v-model:win="win"
      ref="globe"
    />
  </div>
</template>

<script lang="ts">
import Globe from '@/components/Globe.vue'
import { defineComponent } from 'vue'

type Data = {
  countryToGuess: String,
  win: Boolean
}

export default defineComponent({
  components: {Globe},
  data(): Data {
    return {
      countryToGuess: '',
      win: false,
    }
  }
})
</script>

<style scoped>

</style>