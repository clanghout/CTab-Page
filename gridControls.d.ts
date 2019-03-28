import { baseSettings } from "./cTabWidgetType";
interface CTabGrid {
    initialize: () => void;
    saveGrid: () => string;
    simpleAdd: (type: string, settings: baseSettings, backgroundColor: string, textColor: string) => void;
    debug: (sampleConfig: boolean, addSampleWidgets: boolean) => void;
    setConfig: (config: any[]) => void;
    getConfig: () => object[];
}
declare function grid(): CTabGrid;
export default grid;
