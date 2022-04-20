<template>
    <button @click="$emit('toggleTheme')" class="theme-toggle">
        <v-icon class="theme-icon" size="35">
            mdi-theme-light-dark
        </v-icon>
    </button>
</template>

<style scoped lang="scss">

.theme-toggle {
    position: absolute;
    top: 35px;
    right: 35px;
}
.theme-icon {
    color: var(--secondary);
}
</style>