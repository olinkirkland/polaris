<template>
    <div class="chip rounded-full px-2 py-1.5">
        <span class="text-xs flex gap-1 items-center"><slot></slot></span>
    </div>
</template>

<style lang="scss" scoped>
.chip {
    background-color: var(--color-transparent-faint-white);
    color: white;
}
</style>
