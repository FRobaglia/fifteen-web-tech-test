<template>
    <v-btn
        @click="$emit('listenClick')"
        color="success"
        class="add-bike-button"
    >
        <v-icon class="add-bike-icon"
        >
            mdi-plus-circle
        </v-icon>
        Add a new bike
    </v-btn>
</template>

<style scoped lang="scss">

.add-bike-button {
    position: absolute;
    bottom: 35px;
    right: 35px;
    z-index: 5;
    transition: transform .2s;

    &:hover {
        transform: scale(1.05);
    }
}

.add-bike-icon {
    margin-right: 6px;
}
</style>