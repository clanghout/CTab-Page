import {CTabWidgetElement, BaseSettings} from "./cTabWidgetTypeBase";
import * as widgetTypes from "./cTabWidgetType";

interface WidgetConstructor {
    new(id: string, settings: BaseSettings, backgroundColor: string, textColor: string): CTabWidgetElement;
}


export const widgetNameList: Array<string> = Object.keys(widgetTypes);

export const cTabTypeMap: { [name: string]: WidgetConstructor } = widgetNameList.reduce((acc, widgetName) => {
    acc[widgetName] = (widgetTypes as any)[widgetName];
    return acc;
}, {} as any);


export function lookupConstructorName(cname: string): string {
    return (Object.entries(widgetTypes) as Array<[string, any]>).find(([_, w]) => w.name == cname)![0];
}
