declare module "cTabWidgetType" {
    export abstract class CTabWidget {
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
    export abstract class TitleWidget extends CTabWidget {
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
    export class WeatherWidget extends CTabWidget {
        id: number;
        settings: weatherSettings;
        backgroundColor: string;
        textColor: string;
        getTemplateCore: () => string;
        constructor(id: number, settings: weatherSettings, backgroundColor: string, textColor: string);
    }
    export class LinkWidget extends TitleWidget {
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
    export class ClockWidget extends CTabWidget {
        id: number;
        settings: baseSettings;
        backgroundColor: string;
        textColor: string;
        getTemplateCore: () => string;
        constructor(id: number, settings: baseSettings, backgroundColor: string, textColor: string);
    }
    export class BuienradarWidget extends CTabWidget {
        id: number;
        settings: baseSettings;
        backgroundColor: string;
        textColor: string;
        getTemplateCore: () => string;
        constructor(id: number, settings: baseSettings, backgroundColor: string, textColor: string);
    }
    export class NoteWidget extends TitleWidget {
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
    export const cTabTypeMap: {
        [name: string]: WidgetConstructor;
    };
}
declare module "settingsMenu" {
    interface CTabSettingsMenu {
        initialize: () => void;
        getWeatherTimeoutValue: () => number;
        getTimezone: () => string;
        getWeatherAPIKey: () => string;
        getShowUnsavedWarning: () => boolean;
        getNewTab: () => boolean;
    }
    const _default: CTabSettingsMenu;
    export default _default;
}
declare module "weatherControls" {
    import { WeatherWidget } from "cTabWidgetType";
    export const getWeather: (id: number, city: string) => void;
    export function addWeatherListener(widget: WeatherWidget, id: number): void;
}
declare module "gridControls" {
    import { baseSettings } from "cTabWidgetType";
    interface CTabGrid {
        initialize: () => void;
        saveGrid: () => string;
        simpleAdd: (type: string, settings: baseSettings, backgroundColor: string, textColor: string) => void;
        debug: (sampleConfig: boolean, addSampleWidgets: boolean) => void;
        setConfig: (config: any[]) => void;
        getConfig: () => object[];
    }
    function grid(): CTabGrid;
    export default grid;
}
declare module "index" {
    import "settingsMenu";
}
