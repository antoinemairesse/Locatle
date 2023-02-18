<template>
  <div class="w-full h-full flex flex-col items-center align-middle mt-14">
    <div>
      <h1 v-if="countryToGuess !== ''" class="text-center font-semibold">
        <span class="text-2xl font-bold">
          Click on this country :
          <span class="text-green-700">{{countryToGuess}}</span>
        </span>
      </h1>
      <h1 v-if="win"
        class="text-center text-xl text-green-700 font-semibold m-0">
        You guessed <span class="font-bold">{{countryToGuess}}</span> correctly, GG !
      </h1>
    </div>
    <Globe class="mt-8" ref="globe" />
  </div>
</template>

<script lang="ts">
import Globe from '@/components/Globe.vue'
import { defineComponent } from 'vue'
import { useGameStore } from '@/stores/Game';
import { mapActions, mapState } from "pinia";
import { seededRandom } from "three/src/math/MathUtils";


type Data = {
  guessHistory: Array<string>,
  possibleFutureGuesses: Array<string>,
}

type GameData = {
  country: string,
  currentGuesses: Array<string>
}

export default defineComponent({
  components: {Globe},
  data(): Data {
    return {
      guessHistory: [],
      possibleFutureGuesses: [],
    }
  },
  computed: {
    ...mapState(useGameStore, ['countryToGuess', 'win', 'countries', 'countryToGuess'])
  },
  methods: {
    ...mapActions(useGameStore, ['setGuesses', 'setCountryToGuess', 'getCountries']),
    setSavedGameData(): void {
      const rawData: string | null = localStorage.getItem('gameData')
      if(!rawData) return;
      const data: GameData = JSON.parse(rawData);
      if(data.country !== this.countryToGuess)
        localStorage.removeItem('gameData');
      else this.setGuesses(data.currentGuesses);
    },
    getCountryToGuess(): string {
      const dateObj = new Date();
      const month = (dateObj.getUTCMonth() + 1).toString();
      const day = dateObj.getUTCDate().toString();
      const year = dateObj.getUTCFullYear().toString();
      const date = year + month + day;

      const random =  seededRandom(parseInt(date))

      const index = Math.floor(random * (this.possibleFutureGuesses.length - 1))
      return this.possibleFutureGuesses[index]
    },
    startGame(): void {
      this.getCountries().then(() => {
        if(this.guessHistory.length === this.countries.length) this.guessHistory = [];

        this.possibleFutureGuesses = this.countries.filter((country: string) => {
          if(!this.guessHistory.includes(country)) return country
        })

        this.setCountryToGuess(this.getCountryToGuess())
        this.guessHistory.push(this.countryToGuess)

        this.setSavedGameData();
      })
    },
  },
  mounted() {
    this.startGame();
  }
})
</script>

<style scoped>

</style>