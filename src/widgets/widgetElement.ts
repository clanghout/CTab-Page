import * as widgetTypes from "./widgets";

export abstract class WidgetElement {

    abstract getTemplateCore: () => string;

    getType = this.constructor.name.replace("cTabWidgetType_", "");

    constructor(public id: string, public settings: BaseSettings, public backgroundColor: string, public textColor: string) {
        if (!settings.tags) {
            this.settings.tags = []
        }
    }

    widgetTemplate: () => string = () => {
        let joinedTags: string = this.settings.tags.join(",");

        let template =
            `<div class="item he${this.settings.height} w${this.settings.width}" data-tags="${joinedTags}">
                        <div class="item-content" ${this.colorInfo()}>
${this.getHtmlControls()}
<div class="ctab-widget-drag-handle hidden" id="drag-handle-${this.id}">
<span style="top:0; left: 0;">&#8598</span>
<span style="top:0; right: 0;">&#8599</span>
<span style="bottom:0; right: 0;">&#8600</span>
<span style="bottom:0; left: 0;">&#8601</span>
</div>`;
        template += this.getTemplateCore();
        template += `</div></div>`;
        return template;
    };

    getConfig = (): CTabWidgetSerialized => {
        let type = Object.entries(widgetTypes).find(([_, w]) => {
            return w.name == this.constructor.name.replace("cTabWidgetType_", "");
        })![0];

        return {
            settings: this.settings,
            backgroundColor: this.backgroundColor,
            textColor: this.textColor,
            id: this.id,
            type: type,
        };
    };

    colorInfo = (): string => {
        return `style="color: var(--${this.id}-text-color);
        background-color: var(--${this.id}-background-color);
        --item-background-color:${this.backgroundColor};
        "`;
    };

    getHtmlControls = () =>
        `<div class="ctab-widget-controls hidden" id="controls-${this.id}">
                    <div class="vanilla-color-picker widget-control-picker" id="${this.id}-text-color" style="color:var(--${this.id}-text-color); border-color: var(--${this.id}-text-color); background-color: rgba(255,255,255,.8)">tc</div>
                    <div class="vanilla-color-picker widget-control-picker" id="${this.id}-background-color" style="background-color: var(--${this.id}-background-color); border-color: var(--${this.id}-background-color);">bg</div>
                    <div class="deletebutton">
                        <button id="delete-${this.id}">❌</button>
                    </div>
                </div>`;
}

export abstract class TitleWidget extends WidgetElement {
    protected constructor(public id: string, public settings: TitleSettings, public backgroundColor: string, public textColor: string) {
        super(id, settings, backgroundColor, textColor);
    }

    getConfig = (): CTabWidgetSerialized => {

        this.settings.title = (document.querySelector(`#note-${this.id}`) as HTMLTextAreaElement).value.replace(/\s\s/g, "\s");
        return {
            settings: this.settings,
            backgroundColor: this.backgroundColor,
            id: this.id,
            textColor: this.textColor,
            type: this.constructor.name.replace("cTabWidgetType_", "")
        };
    };
}

export interface BaseSettings {
    width: number;
    height: number;

    // Tags allow users to categorize their widgets
    tags: Array<string>;

    // value used to enumerate where a cell should be ordered on the grid as decided by a user (after dragging
    // and dropping a cell)
    orderIndex: number;
}

// Serialized version of a CTab Widget
export interface CTabWidgetSerialized {
    id: string;
    settings: BaseSettings;
    backgroundColor: string;
    textColor: string;
    type: string;
}

// Settings can differ per widget type, since the `widgets.ts` file is used only for the widget classes itself
// the specific settings are defined here.
export interface WeatherSettings extends BaseSettings {
    city: string;
}

export interface TitleSettings extends BaseSettings {
    title: string;
}

export interface LinkSettings extends TitleSettings {
    url: string;
    newTab: boolean;
}
