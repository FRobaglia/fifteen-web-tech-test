<template>
  <div class="bike">
    <div ref="bikeIcon" :class="`bike-icon ${['free', 'booked', 'in-use'][props.service_status - 1]}`">
      <v-icon size="22">
          mdi-bicycle
      </v-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { Marker, Popup } from "mapbox-gl";
import { ref, onMounted } from "vue";

export interface BikeProps {
  id: string,
  serial_number: string,
  coordinates: number[],
  in_order: boolean,
  service_status: number
}

const props = defineProps<BikeProps>();

const bikeIcon = ref(undefined)
const store = useStore()

onMounted(() => {
    const lat: number = props.coordinates[0]
    const lng: number = props.coordinates[1]
    
    const popup = new   Popup({ offset: 25 }).setText(
    'Construction on the Washington Monument began in 1848.'
    );

    new Marker(bikeIcon.value)
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(store.state.map);
});

</script>

<style lang="scss">
  .bike-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 100%;

    &.free {
      background: #70a1ff;
    }

    &.booked {
      background: #1e90ff;
    }

    &.in-use {
      background: #5352ed;
    }
  }
</style>