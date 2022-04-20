<template>
    <div class="loader">
        <img class="logo-text" src="../assets/fifteen-logo-text.svg" alt="">
        <img class="logo-wheel" src="../assets/fifteen-logo-wheel.svg" alt="">
    </div>
</template>

<style scoped lang="scss">

@keyframes rotate {
    to {
        transform: rotate(360deg)
    }
}

.loader {
    transition: .3s  ease-in-out;
    position: absolute;
    z-index: 999;
    background-color: var(--primary);
    top: 0; left: 0;
    opacity: 1;
    width: 100vw; height: 100vh;
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
</style>