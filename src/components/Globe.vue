<template>
  <div class="cursor-grab" ref="canvas" id="canvas"/>
</template>
<script lang="ts">
import Globe from 'globe.gl';
import { seededRandom } from "three/src/math/MathUtils";
import { defineComponent } from 'vue'
import type {GlobeInstance} from 'globe.gl';

type Data = {
  countryToGuess: String,
  latestGuess: String,
  pays: Array<String>,
  guessHistory: Array<String>,
  currentGuesses: Array<String>,
  possibleFutureGuesses: Array<String>,
  myGlobe: GlobeInstance | null,
  win: Boolean
}

type GameData = {
  country: String,
  currentGuesses: Array<String>
}

export default defineComponent({
  components: {Globe},
  emits: ['update:countryToGuess', 'update:win'],
  data(): Data{
    return {
      countryToGuess: '',
      latestGuess: '',
      pays: [],
      guessHistory: [],
      currentGuesses: [],
      possibleFutureGuesses: [],
      myGlobe: null,
      win: false
    }
  },
  watch: {
    countryToGuess: {
      handler(newVal){
        this.$emit('update:countryToGuess', newVal)
      },
      immediate: true
    },
    win: {
      handler(newVal){
        this.$emit('update:win', newVal)
      },
      immediate: true
    },
    currentGuesses: {
      handler(newVal) {
        if(newVal.includes(this.countryToGuess)) this.win = true;
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    randomSeeded(): number {
      const dateObj = new Date();
      const month = (dateObj.getUTCMonth() + 1).toString();
      const day = dateObj.getUTCDate().toString();
      const year = dateObj.getUTCFullYear().toString();
      const date = year + month + day;
      return seededRandom(parseInt(date))
    },
  },
  methods: {
    setSavedGameData(): void {
      const rawData: string | null = localStorage.getItem('gameData')
      if(!rawData) return;
      const data: GameData = JSON.parse(rawData);
      if(data.country !== this.countryToGuess)
        localStorage.removeItem('gameData');
      else this.currentGuesses = data.currentGuesses;
    },
    handlePolygonClick(polygon: any): void {
      if(this.win) return;
      this.latestGuess = polygon.properties.NAME
      this.currentGuesses.push(polygon.properties.NAME)
      localStorage.setItem('gameData', JSON.stringify({currentGuesses: this.currentGuesses, country: this.countryToGuess}))
      this.myGlobe?.polygonCapColor(this.polygonCapColor)
    },
    startGame(): void {
      if(this.guessHistory.length === this.pays.length) this.guessHistory = [];
      this.currentGuesses = [];
      this.latestGuess = ""

      this.possibleFutureGuesses = this.pays.filter((country) => {
        if(!this.guessHistory.includes(country)) return country
      })

      // Init random country
      const index = Math.floor(this.randomSeeded * (this.possibleFutureGuesses.length - 1))
      this.countryToGuess = this.possibleFutureGuesses[index];
      this.guessHistory.push(this.countryToGuess)

      this.setSavedGameData();

      this.myGlobe?.polygonCapColor(this.polygonCapColor)
    },
    polygonCapColor(polygon: any, hoverPolygon?: any): string {
      if(this.currentGuesses.includes(polygon.properties.NAME)){
        if(this.countryToGuess === polygon.properties.NAME) return '#00FF00'
        return '#FFFF00'
      } else {
        if(!this.win && hoverPolygon && polygon === hoverPolygon) return 'green'
      }
      return '#00000000'
    },
    formatCountryLabel(polygon: any){
      if(this.currentGuesses.includes(polygon.properties.NAME)){
        let className = "text-red-600"
        if(this.countryToGuess === polygon.properties.NAME) className = "text-green-700"
        return `<b class="${className}">${polygon.properties.ADMIN}</b>`
      }
      return ''
    }
  },
  mounted(): void {
    fetch('countries.geojson').then(res => res.json()).then(countries => {
      this.pays = countries.features.map((country: any) => {
        return country.properties.NAME
      })
      if (this.$refs.canvas) {
        const myGlobe = Globe();
        this.myGlobe = myGlobe;
        myGlobe(this.$refs.canvas as HTMLElement)
          .backgroundColor("#FFFFFF00")
          .globeImageUrl('/public/earth.webp')
          .polygonsData(countries.features)
          .polygonSideColor(() => 'rgb(119,136,153)')
          .polygonStrokeColor(() => '#000000')
          .polygonCapColor(() => '#00000000')
          .width(600).height(600)
          .onPolygonHover(hoverD => {
            return myGlobe.polygonCapColor((d: any) => this.polygonCapColor(d, hoverD))
          })
          .polygonLabel((polygon: any): string => this.formatCountryLabel(polygon))
          .onPolygonClick(this.handlePolygonClick)
        this.startGame()
      }
    })
  }
})
</script>

<style>
#canvas {
  width: 600px;
  height: 600px;
  overflow: hidden;
  border-radius: 100%;
}
</style>