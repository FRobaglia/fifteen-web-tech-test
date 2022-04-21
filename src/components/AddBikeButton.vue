<template>
    <button @click="$emit('openAddBikePopup')" class="add-bike-button">
        <v-icon class="theme-icon" size="30">
            mdi-plus-circle
        </v-icon>
    </button>
</template>

<style scoped lang="scss">

.add-bike-button {
    position: absolute;
    top: 35px;
    right: 80px;
    z-index: 5;
    color: var(--secondary);
    transition: transform .15s;

    &:hover {
        transform: scale(1.2);
    }
}
</style>