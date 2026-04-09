import { defineStore } from 'pinia';

export const useEnvStore = defineStore('env', () => {
    const STEALTH = import.meta.env.VITE_STEALTH_MODE === 'true';
    const DEBUG = import.meta.env.VITE_DEBUG === 'true';
    const NOCLIP = import.meta.env.VITE_NOCLIP === 'true';

    return { STEALTH, DEBUG, NOCLIP };
});
