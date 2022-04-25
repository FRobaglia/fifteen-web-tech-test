<template>
  <Loader v-if="!mapHasLoaded"></Loader>
  <FlashMessage :class="{active: listenForClick || flashMessageActive}" :message="flashMessage"></FlashMessage>
  <AddBikeButton @listenClick="listenClick"></AddBikeButton>
  <AddBikeForm @closePopup="popupIsActive = false" :class="{ active: popupIsActive }" :newBikeLat="newBikeLat" :newBikeLng="newBikeLng" @addBike="addBike"></AddBikeForm>
  <HandleThemeButton @toggleTheme="handleTheme"></HandleThemeButton>
  <MapboxMap @click="handleClick" @loaded="(map: any) => {handleLoad(map)}" :accessToken="accessToken" :mapStyle="`mapbox://styles/mapbox/${mapTheme}-v10`" :center="props.center" :zoom="9">
    <BikeMarker @editBike="editBike" @deleteBike="deleteBike" v-if="mapHasLoaded && bikesLoaded" v-for="bike in bikes.value" :key="bike.id" :id="bike.id" :serial_number="bike.serial_number" :coordinates="bike.coordinates" :in_order="bike.in_order" :service_status="bike.service_status" :battery_level="bike.battery_level">
    </BikeMarker>
  </MapboxMap>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Loader from "@/components/Loader.vue";
import FlashMessage from '@/components/FlashMessage.vue';
import AddBikeButton from '@/components/AddBikeButton.vue';
import AddBikeForm from '@/components/AddBikeForm.vue';
import HandleThemeButton from "@/components/HandleThemeButton.vue";
import { MapboxMap } from 'vue-mapbox-ts';
import BikeMarker from "@/components/BikeMarker.vue";

import customFetch from '@/helpers/customFetch.js';
import useTheme from '@/composables/useTheme.js';
import { LngLatLike } from "mapbox-gl";

export interface FMapProps {
  center: LngLatLike; // The map initial center coordinates
}

const props = defineProps<FMapProps>();

let mapHasLoaded = ref(false)
const mapTheme = ref(localStorage.getItem("theme") || "light") 

const bikes: Bike[] = reactive([])
const bikesLoaded = ref(false)

let popupIsActive = ref(false)
let flashMessageActive = ref(false)
let listenForClick = ref(false)
let flashMessage = ref("")
let newBikeLat = ref(0)
let newBikeLng = ref(0)

const { toggleTheme } = useTheme();
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
const api = import.meta.env.VITE_API_URL

let mapInstance: any = reactive({})
let serviceAreaData = reactive({})
let mouseInArea = ref(false)

interface Bike {
  id: string,
  serial_number: string,
  coordinates: number[],
  in_order: boolean,
  service_status: number,
  battery_level: number
}

function newFlashMessage(message: string) {
  // Display a flash message for 3 seconds
  flashMessage.value = message
  flashMessageActive.value = true
  setTimeout(() => {
    flashMessageActive.value = false
  }, 3000);
}

function listenClick() {
  // Listen for click on the map when adding a new bike
  flashMessage.value = "Click somewhere inside the service area to choose the position of the new bike."
  listenForClick.value = true
}

function handleClick(e: any) {
  // Handle map click
  if (!listenForClick.value || !mouseInArea.value) return // Ignore if not currently listening for click, or if mouse is not in service area

  newBikeLat.value = e.lngLat.lat
  newBikeLng.value = e.lngLat.lng
  
  popupIsActive.value = true
  listenForClick.value = false
  mapInstance.getCanvas().style.cursor = ''; // Reset map cursor style
  
}

function handleLoad(map: any) {
  // Handle map load
  mapInstance = map
  mapHasLoaded.value = true
  
  fetchDataset() // On load, fetch and display the service area dataset

  map.on('style.load', function () {
    // Triggered when method `setStyle` is called.
    addServiceAreaLayer() // Layers are removed if the map style change (which is needed because of the dark theme) : add back the service area polygon
  });

}

function handleTheme() {
  // On theme toggle
  toggleTheme() // Call our composable function

  // Update the map style with mapbox setStyle method
  mapTheme.value === "light" ? mapTheme.value = "dark" : mapTheme.value = "light"
  mapInstance.setStyle(`mapbox://styles/mapbox/${mapTheme.value}-v10`)
}

function findBike(id: string) {
  const bike = bikes.value.find((bike: Bike) => bike.id === id);
  return bike
}

function addBike(bike: Bike) {
  return customFetch(`${api}/bikes`, 'post', (data: Bike) => {
      bikes.value.push(data) // update view
      newFlashMessage(`Operation successful. (Bike #${bike.serial_number})`)
  }, JSON.stringify(bike))
}

function deleteBike(id: string) {
  return customFetch(`${api}/bikes/${id}`, 'delete', () => {
      let bike = findBike(id)
      const i = bikes.value.indexOf(bike)
      bikes.value.splice(i, 1)
      newFlashMessage(`Operation successful. (Bike #${bike.serial_number})`)
  })
}

function editBike(id: string, in_order: boolean) {
  return customFetch(`${api}/bikes/${id}`, 'put', () => {
      let bike = findBike(id)
      bike.in_order = !bike.in_order
      newFlashMessage(`Operation successful. (Bike #${bike.serial_number})`)
  }, JSON.stringify({in_order: !in_order}))
}

async function fetchBikes() {
  return customFetch(`${api}/bikes`, 'get', (data: Bike) => {
      bikes.value = data.bikes;
      bikesLoaded.value = true;
  })
}

function fetchDataset() {
  return customFetch(`https://api.mapbox.com/datasets/v1/${import.meta.env.VITE_MAPBOX_USERNAME}/cl1mlwhhr02vl22ljv9gk24mk/features/e7353b6c7c85c1f8781503ec03efe34a?access_token=${accessToken}`, 'get', (data: any) => {
    // Retrieve data from the mapbox dataset
    serviceAreaData = data
    addServiceAreaLayer()
  })
}

function addServiceAreaLayer() {
    // Draw the service area polygon on the map
    mapInstance.addSource("parisArea", {
      type: "geojson",
      data: serviceAreaData
    })
    mapInstance.addLayer({
      'id': 'parisArea',
      'type': 'fill',
      'source': 'parisArea',
      'layout': {},
      'paint': {
      'fill-color': '#0080ff',
      'fill-opacity': 0.2
      }
    });
    
    // Listen when mouse enters and leaves polygon
    mapInstance.on('mouseenter', 'parisArea', () => {
      if (!listenForClick.value) return
      mouseInArea.value = true
      mapInstance.getCanvas().style.cursor = 'crosshair';
    });

    mapInstance.on('mouseleave', 'parisArea', () => {
      if (!listenForClick.value) return
      mouseInArea.value = false
      mapInstance.getCanvas().style.cursor = 'not-allowed';
    });
}

onMounted(() => {
  fetchBikes()
});
</script>
