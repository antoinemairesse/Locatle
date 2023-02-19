<template>
  <div class="w-full h-full flex flex-col items-center align-middle mt-8">
    <div v-if="!loading">
      <h1 v-if="countryToGuess !== ''" class="text-center font-semibold">
        <span class="text-2xl font-bold">
          Click on this country :
          <span class="text-green-700">{{countryToGuess}}</span>
        </span>
      </h1>
      <div v-if="win" class="flex flex-col items-center">
        <h1 class="text-center text-xl text-green-700 font-semibold m-0">
          You guessed <span class="font-bold">{{countryToGuess}}</span> correctly, GG !
        </h1>
        <span v-if="win && !isPracticeGame">New daily guess in : {{timeUntilNextGuess}}</span>
        <button
          v-if="isPracticeGame"
          class="py-2 px-4 mt-2 bg-blue-600 text-white cursor-pointer rounded z-50 relative"
          @click="newGame"
        >
          Play again ?
        </button>
      </div>
    </div>
    <Globe class="mt-20" ref="globe" @countryClick="handleCountryClick" />
  </div>
</template>

<script lang="ts">
import Globe from '@/components/Globe.vue'
import { defineComponent } from 'vue'
import { useGameStore } from '@/stores/Game';
import { mapActions, mapState } from "pinia";
import { seededRandom } from "three/src/math/MathUtils";

enum GameMode {
  'daily',
  'practice'
}

type Data = {
  gameMode: GameMode,
  timeUntilNextGuess: string
}

type GameData = {
  country: string,
  currentGuesses: Array<string>
}

export default defineComponent({
  components: {Globe},
  data(): Data {
    return {
      gameMode: GameMode.daily,
      timeUntilNextGuess: ''
    }
  },
  computed: {
    ...mapState(useGameStore, ['countryToGuess', 'win', 'countries', 'loading', 'currentGuesses']),
    isPracticeGame(){
      return this.$route.name === 'practiceGame'
    },
  },
  watch: {
    '$route.name': {
      handler(){
        this.reset();
        this.startGame();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions(useGameStore, ['setGuesses', 'setCountryToGuess', 'getCountries', 'reset', 'addGuess']),
    setSavedGameData(): void {
      const rawData: string | null = localStorage.getItem('gameData')
      if(!rawData) return;
      const data: GameData = JSON.parse(rawData);
      if(data.country !== this.countryToGuess)
        localStorage.removeItem('gameData');
      else this.setGuesses(data.currentGuesses);
    },
    updateTimeUntilNextGuess(): string {
      let d = new Date();
      let h = d.getUTCHours();
      let m = d.getUTCMinutes();
      let s = d.getUTCSeconds();
      let secondsUntilEndOfDate = (24*60*60) - (h*60*60) - (m*60) - s;
      return new Date(secondsUntilEndOfDate * 1000).toISOString().slice(11, 19);
    },
    getCountryToGuess(): string {
      const dateObj = new Date();
      const month = (dateObj.getUTCMonth() + 1).toString();
      const day = dateObj.getUTCDate().toString();
      const year = dateObj.getUTCFullYear().toString();
      const date = year + month + day;

      const random = seededRandom(parseInt(date));
      const index = Math.floor(random * (this.countries.length - 1))
      return this.countries[index];
    },
    getRandomCountry(): string {
      const index = Math.floor(Math.random() * (this.countries.length - 1))
      return this.countries[index];
    },
    startGame(): void {
      this.getCountries().then(() => {
        if(!this.isPracticeGame){
          this.setCountryToGuess(this.getCountryToGuess())
          this.setSavedGameData();
        } else if (this.isPracticeGame) {
          this.setCountryToGuess(this.getRandomCountry())
        }
      })
    },
    newGame(){
      this.reset();
      this.setCountryToGuess(this.getRandomCountry())
    },
    handleCountryClick(country: string){
      if(this.win) return;
      this.addGuess(country)
      if(!this.isPracticeGame){
        const data = {
          currentGuesses: this.currentGuesses,
          country: this.countryToGuess
        }
        localStorage.setItem('gameData', JSON.stringify(data))
      }
    }
  },
  mounted() {
    this.reset();
    this.startGame();
    setInterval(() => {
      this.timeUntilNextGuess = this.updateTimeUntilNextGuess()
    }, 1000);
  }
})
</script>

<style scoped>

</style>