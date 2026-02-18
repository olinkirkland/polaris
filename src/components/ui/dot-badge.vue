<template>
    <div class="badge rounded-md flex justify-center items-center size-5">
        <span class="leading-0"><slot></slot></span>
    </div>
</template>

<style lang="scss" scoped>
.badge {
    background-color: var(--color-ink);
    color: var(--color-ink-reverse);
    span {
        font-size: 0.625rem;
    }
}
</style>
