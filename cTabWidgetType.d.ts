export declare abstract class CTabWidget {
    id: number;
    settings: baseSettings;
    backgroundColor: string;
    textColor: string;
    abstract getTemplateCore: () => string;
    constructor(id: number, settings: baseSettings, backgroundColor: string, textColor: string);
    widgetTemplate: () => string;
    getConfig: () => {
        settings: baseSettings;
        backgroundColor: string;
        textColor: string;
        id: number;
        type: string;
    };
    colorInfo: () => string;
    getHtmlControls: () => string;
}
export declare abstract class TitleWidget extends CTabWidget {
    id: number;
    settings: titleSettings;
    backgroundColor: string;
    textColor: string;
    protected constructor(id: number, settings: titleSettings, backgroundColor: string, textColor: string);
    getConfig: () => {
        settings: titleSettings;
        backgroundColor: string;
        id: number;
        textColor: string;
        type: string;
    };
}
export declare class WeatherWidget extends CTabWidget {
    id: number;
    settings: weatherSettings;
    backgroundColor: string;
    textColor: string;
    getTemplateCore: () => string;
    constructor(id: number, settings: weatherSettings, backgroundColor: string, textColor: string);
}
export declare class LinkWidget extends TitleWidget {
    id: number;
    settings: linkSettings;
    backgroundColor: string;
    textColor: string;
    newTab: boolean;
    constructor(id: number, settings: linkSettings, backgroundColor: string, textColor: string, newTab: boolean);
    private getTag;
    getTemplateCore: () => string;
    getConfig: () => {
        settings: linkSettings;
        backgroundColor: string;
        textColor: string;
        id: number;
        type: string;
    };
}
export declare class ClockWidget extends CTabWidget {
    id: number;
    settings: baseSettings;
    backgroundColor: string;
    textColor: string;
    getTemplateCore: () => string;
    constructor(id: number, settings: baseSettings, backgroundColor: string, textColor: string);
}
export declare class BuienradarWidget extends CTabWidget {
    id: number;
    settings: baseSettings;
    backgroundColor: string;
    textColor: string;
    getTemplateCore: () => string;
    constructor(id: number, settings: baseSettings, backgroundColor: string, textColor: string);
}
export declare class NoteWidget extends TitleWidget {
    id: number;
    settings: titleSettings;
    backgroundColor: string;
    textColor: string;
    getTemplateCore: () => string;
    constructor(id: number, settings: titleSettings, backgroundColor: string, textColor: string);
}
export interface baseSettings {
    width: number;
    height: number;
}
export interface weatherSettings extends baseSettings {
    city: string;
}
export interface titleSettings extends baseSettings {
    title: string;
}
export interface linkSettings extends titleSettings {
    url: string;
}
interface WidgetConstructor {
    new (id: number, settings: baseSettings, backgroundColor: string, textColor: string): CTabWidget;
}
export declare const cTabTypeMap: {
    [name: string]: WidgetConstructor;
};
export {};
