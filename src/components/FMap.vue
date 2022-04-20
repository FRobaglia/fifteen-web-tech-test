<template>
  <MapboxMap @loaded="() => {mapHasLoaded = true}" :accessToken="accessToken" :mapStyle="mapStyle" :center="props.center" :zoom="9">
    <BikeMarker v-if="mapHasLoaded" v-for="bike in bikes" :key="bike.id" :id="bike.id" :serial_number="bike.serial_number" :coordinates="bike.coordinates" :in_order="bike.in_order" :service_status="bike.service_status" :battery_level="bike.battery_level">
    </BikeMarker>
  </MapboxMap>
</template>

<script setup lang="ts">
import bikes from '../../genbikes/bikes.json'
import BikeMarker from "@/components/BikeMarker.vue";
import { LngLatLike } from "mapbox-gl";
import { MapboxMap } from 'vue-mapbox-ts';
import { ref } from 'vue';

import "mapbox-gl/dist/mapbox-gl.css";


export interface FMapProps {
  /**
   * The map initial center coordinates
   */
  center: LngLatLike;
}

const props = defineProps<FMapProps>();

let mapHasLoaded = ref(false)
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
const mapStyle = "mapbox://styles/mapbox/light-v10"
</script>
