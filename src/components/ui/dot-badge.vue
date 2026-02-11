<template>
    <div class="badge rounded-full flex justify-center items-center size-6">
        <span class="text-xs leading-0 font-bold"><slot></slot></span>
    </div>
</template>

<style lang="scss" scoped>
.badge {
    background-color: var(--color-ink);
    color: var(--color-ink-reverse);
}
</style>
