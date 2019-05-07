declare module "big-text.js" {

    interface options {
        rotateText?: number | null; // null
        fontSizeFactor?: number; // 0.8,
        maximumFontSize?: number | null ; // null,
        limitingDimension?: string; // "both",
        horizontalAlign?: string; // "center",
        verticalAlign?: string; // "center",
        textAlign?: string; // "center",
        whiteSpace?: string; // "nowrap"
    }

    export default function BigText(element: string | HTMLElement, options?: options) :void;

}
