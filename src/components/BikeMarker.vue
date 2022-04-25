<template >
    <MapboxMarker :lngLat="[props.coordinates[1], props.coordinates[0]]">
      <template v-slot:icon>
        <div :class="`bike-icon ${['free', 'booked', 'in-use'][props.service_status - 1]} ${props.in_order ? ' ' : 'out-of-order'}`">
          <v-icon size="20">
            mdi-bicycle
          </v-icon>
        </div>
      </template>

      <MapboxPopup maxWidth="290px" :offset="38">
        <BikePopup @editBike="$emit('editBike', props.id, props.in_order)" @deleteBike="$emit('deleteBike', props.id)" :key="props.id" :id="props.id" :serial_number="props.serial_number" :coordinates="props.coordinates" :in_order="props.in_order" :service_status="props.service_status" :battery_level="props.battery_level"></BikePopup>
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

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.bike-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  box-shadow: 0 5px 5px rgba(0,0,0,0.4);
  transition: .1s ease-in-out;

  &:hover {
    transform: scale(1.15);
  }

  &.free {
    background: $validation;
  }

  &.booked {
    background: $warning;
  }

  &.in-use {
    background: $danger;
  }

  &.out-of-order {
    background: var(--primary);
    color: var(--secondary);
  }
}
</style>