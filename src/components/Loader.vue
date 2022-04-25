<template>
    <div class="loader">
        <img class="logo-text" src="../assets/fifteen-logo-text.svg" alt="">
        <img class="logo-wheel" src="../assets/fifteen-logo-wheel.svg" alt="">
    </div>
</template>

<style scoped lang="scss">

.loader {
    position: absolute;
    z-index: 999;
    background-color: var(--primary);
    top: 0; left: 0; right: 0; bottom: 0;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;
}

.logo-text {
    margin-right: 40px;
}

.logo-wheel {
    animation: rotate 10s infinite linear;
}

@media(max-width: 600px) {
    .logo-text {
        width: 170px;
        margin-right: 20px;
    }
    .logo-wheel {
        width: 60px;
    }
}
</style>