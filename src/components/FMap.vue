<template>
  <div id="map" style="height: 100%"></div>
  <Bike v-if="store.state.map"  v-for="bike in bikes" :key="bike.id" :id="bike.id" :serial_number="bike.serial_number" :coordinates="bike.coordinates" :in_order="bike.in_order" :service_status="bike.service_status"></Bike>
</template>

<script setup lang="ts">
import bikes from '../../genbikes/bikes.json'
import Bike from "@/components/Bike.vue";
import { Map, LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { onMounted } from "vue";
import { useStore } from 'vuex'


export interface FMapProps {
  /**
   * The map initial center coordinates
   */
  center: LngLatLike;
}
const props = defineProps<FMapProps>();

const store = useStore()

onMounted(() => {
  let map = new Map({
    accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
    container: "map",
    style: "mapbox://styles/mapbox/light-v10",
    center: props.center,
    zoom: 9,
  });

  store.commit("loadMap", map)
});
</script>
