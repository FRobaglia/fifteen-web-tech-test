<template>
    <MapboxMarker :lngLat="[props.coordinates[1], props.coordinates[0]]">
      <template v-slot:icon>
        <div :class="`bike-icon ${['free', 'booked', 'in-use'][props.service_status - 1]}`">
          <v-icon size="22">
            mdi-bicycle
          </v-icon>
        </div>
      </template>

      <MapboxPopup maxWidth="290px" anchor="bottom-left" :offset="[26, 0]">
        <BikePopup :key="props.id" :id="props.id" :serial_number="props.serial_number" :coordinates="props.coordinates" :in_order="props.in_order" :service_status="props.service_status" :battery_level="props.battery_level"></BikePopup>
      </MapboxPopup>

    </MapboxMarker>
</template>

<script setup lang="ts">
import { MapboxMarker, MapboxPopup } from 'vue-mapbox-ts';
import BikePopup from '@/components/BikePopup.vue';

export interface BikeProps {
  id: string,
  serial_number: string,
  coordinates: number[],
  in_order: boolean,
  service_status: number,
  battery_level: number
}

const props = defineProps<BikeProps>();
</script>

<style lang="scss">
  .bike-icon {
    transition: .3s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 34px;
    height: 34px;
    border-radius: 100%;

    &.free {
      background: #2ecc71;
    }

    &.booked {
      background: #fdcb6e;
    }

    &.in-use {
      background: #ff7675;
    }

    &:hover {
      transform: scale(1.2);
      color: white;
    }
  }
</style>