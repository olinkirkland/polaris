import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePauseStore = defineStore('pause', () => {
    const isPaused = ref<boolean>(true);

    function pause() {
        console.log('-- pause');
        isPaused.value = true;
    }

    function resume() {
        console.log('-- resume');
        isPaused.value = false;
    }

    return { isPaused, pause, resume };
});
