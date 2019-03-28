// Type definitions for usage
// Project: https://github.com/Sphinxxxx/vanilla-picker
// Definitions by: clanghout
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "vanilla-picker" {


    interface PickerColor {
        rgbaString: string;
        rgbString: string;
        rgba: number[];
        hsla: number[];
        hslString: string;
        hslaString: string;
        hex: string;
    }

    declare class Picker {
        constructor(settings: {
            parent?: HTMLElement;
            popup?: "top" | "bottom" | "left" | "right";
            template?: string;
            alpha?: boolean;
            editor?: boolean;
            editorFormat?: 'hex' | 'hsl' | 'rgb';
            color?: string;
            onChange?: (color: PickerColor) => void;
            onDone?: (color: PickerColor) => void;
            onOpen?: (color: PickerColor) => void;
            onClose?: (color: PickerColor) => void;
        });
    }

    export default Picker;
}
