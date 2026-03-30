import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePauseStore = defineStore('pause', () => {
    const isGamePaused = ref<boolean>(true);

    function pause() {
        isGamePaused.value = true;
    }

    function resume() {
        isGamePaused.value = false;
    }

    return { isGamePaused, pause, resume };
});
