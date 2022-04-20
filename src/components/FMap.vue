<template>
  <Loader v-if="!mapHasLoaded"></Loader>
  <HandleTheme @toggleTheme="applyTheme"></HandleTheme>
  <MapboxMap @loaded="(map: any) => {handleLoad(map)}" :accessToken="accessToken" :mapStyle="`mapbox://styles/mapbox/${mapTheme}-v10`" :center="props.center" :zoom="9">
    <BikeMarker v-if="mapHasLoaded" v-for="bike in bikes" :key="bike.id" :id="bike.id" :serial_number="bike.serial_number" :coordinates="bike.coordinates" :in_order="bike.in_order" :service_status="bike.service_status" :battery_level="bike.battery_level">
    </BikeMarker>
  </MapboxMap>
  
</template>

<script setup lang="ts">
import bikes from '../../genbikes/bikes.json'
import BikeMarker from "@/components/BikeMarker.vue";
import Loader from "@/components/Loader.vue";
import HandleTheme from "@/components/HandleTheme.vue";
import useTheme from '@/composables/useTheme.js';
import { LngLatLike } from "mapbox-gl";
import { MapboxMap } from 'vue-mapbox-ts';
import { ref, reactive } from 'vue';


export interface FMapProps {
  /**
   * The map initial center coordinates
   */
  center: LngLatLike;
}

const props = defineProps<FMapProps>();

let mapHasLoaded = ref(false)
const { toggleTheme } = useTheme();
const mapTheme = ref(localStorage.getItem("theme") || "light") 
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

let mapInstance: any = reactive({})

function handleLoad(map: any) {
  mapInstance = map
  mapHasLoaded.value = true
}
function applyTheme() {
  toggleTheme()
  mapTheme.value === "light" ? mapTheme.value = "dark" : mapTheme.value = "light"
  mapInstance.setStyle(`mapbox://styles/mapbox/${mapTheme.value}-v10`)
}
</script>
