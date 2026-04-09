export function makeKeybindingTooltip(text: string, key: string): { content: string; placement: string } {
    return {
        content: `
        <div class="flex items-center gap-2">
            <p>${text}</p>
            <code class="keybinding">${key.toUpperCase()}</code>
        </div>`,
        placement: 'bottom'
    };
}

export function makeSaveTooltip() {} // TODO: Move the bits that create a v-tippy from recentSave here (2+ places)
