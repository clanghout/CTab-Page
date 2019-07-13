import {baseSettings} from "./cTabWidgetTypeBase";
import {CTabWidget} from "./cTabWidgetTypeBase";
import * as widgetTypes from "./cTabWidgetType";

interface WidgetConstructor {
    new(id: string, settings: baseSettings, backgroundColor: string, textColor: string): CTabWidget;
}


export const widgetNameList: string[] = Object.keys(widgetTypes);

export const cTabTypeMap: { [name: string]: WidgetConstructor } = widgetNameList.reduce((acc, widgetName) => {
    acc[widgetName] = ((widgetTypes as any)[widgetName] as any);
    return acc;
}, {} as any);


export function lookupConstructorName(cname: string): string {
    return (Object.entries(widgetTypes) as [string, any][]).find(([_, w]) => w.name == cname)![0];
}
