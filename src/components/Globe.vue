<template>
  <div class="absolute m-auto top-0 left-0 bottom-0 right-0 w-fit flex items-center">
    <Loader v-if="loading"/>
    <div class="cursor-grab" :class="{'hidden': loading}" ref="canvas" id="canvas"/>
  </div>
</template>
<script lang="ts">
import Globe from 'globe.gl';
import { defineComponent } from 'vue'
import type {GlobeInstance} from 'globe.gl';
import { useGameStore } from '@/stores/Game';
import { mapActions, mapState } from "pinia";
import Loader from "@/components/Loader.vue";

type Data = {
  myGlobe: GlobeInstance | null,
}

export default defineComponent({
  components: { Loader, Globe},
  data(): Data{
    return {
      myGlobe: null,
    }
  },
  watch: {
    currentGuesses: {
      handler(){
        this.myGlobe?.polygonCapColor(this.polygonCapColor)
      },
      immediate: true,
      deep: true
    },
    countriesFeatures: {
      handler(newVal){
        this.myGlobe?.polygonsData(newVal)
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapState(useGameStore, ['currentGuesses', 'countryToGuess', 'win', 'countriesFeatures', 'loading'])
  },
  methods: {
    ...mapActions(useGameStore, ['addGuess', 'getCountries', 'setLoading']),
    handlePolygonClick(polygon: any): void {
      if(this.win) return;
      this.addGuess(polygon.properties.NAME)
      localStorage.setItem('gameData', JSON.stringify({currentGuesses: this.currentGuesses, country: this.countryToGuess}))
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
    this.setLoading(true);
    const myGlobe = Globe();
    this.myGlobe = myGlobe;
    myGlobe(this.$refs.canvas as HTMLElement)
      .backgroundColor("#FFFFFF00")
      .globeImageUrl(import.meta.env.VITE_EARTH_PATH)
      .polygonSideColor(() => 'rgb(119,136,153)')
      .polygonStrokeColor(() => '#000000')
      .polygonCapColor(() => '#00000000')
      .width(600).height(600)
      .onPolygonHover(hoverD => {
        return myGlobe.polygonCapColor(d => this.polygonCapColor(d, hoverD))
      })
      .polygonLabel((polygon): string => this.formatCountryLabel(polygon))
      .onPolygonClick(this.handlePolygonClick)
      .onGlobeReady(() => {
        myGlobe.pointOfView({lat: 27.53, lng: 17.75, altitude: 1.42})
        this.setLoading(false);
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