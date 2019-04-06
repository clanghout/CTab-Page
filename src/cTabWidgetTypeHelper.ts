import {baseSettings} from "./cTabWidgetTypeBase";
import {CTabWidget} from "./cTabWidgetTypeBase";
import * as widgetTypes from "./cTabWidgetType";

interface WidgetConstructor {
    new (id: number, settings: baseSettings, backgroundColor: string, textColor: string): CTabWidget;
}


export const widgetNameList: string[] = Object.keys(widgetTypes);

export const cTabTypeMap: { [name: string]:  WidgetConstructor } = widgetNameList.reduce((acc, curr) => {
    acc[curr] = ((widgetTypes as any)[curr] as any);
    return acc;
}, {} as any);

