export abstract class CTabWidget {

    abstract getTemplateCore: () => string;

    constructor(public id: number, public settings: baseSettings, public backgroundColor: string, public textColor: string) {
    }


    widgetTemplate: () => string = () => {
        let template =
            `<div class="item he${this.settings.height} w${this.settings.width}">
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
        return {
            settings: this.settings,
            backgroundColor: this.backgroundColor,
            textColor: this.textColor,
            id: this.id,
            type: this.constructor.name
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
                    <div class="deletebutton">
                        <button id="delete-${this.id}" style="padding: 0; border: 0; background: transparent;">❌</button>
                    </div>
                    <div class="vanilla-color-picker widget-control-picker" id="${this.id}-text-color" style="color:var(--${this.id}-text-color); border-color: var(--${this.id}-text-color); background-color: rgba(255,255,255,.8)">tc</div>
                    <div class="vanilla-color-picker widget-control-picker" id="${this.id}-background-color" style="background-color: var(--${this.id}-background-color); border-color: var(--${this.id}-background-color);">bg</div>
                </div>`;
}

export abstract class TitleWidget extends CTabWidget {
    protected constructor(public id: number, public settings: titleSettings, public backgroundColor: string, public textColor: string) {
        super(id, settings, backgroundColor, textColor);
    };

    getConfig = (): CTabWidgetSerialized => {

        this.settings.title = (document.querySelector('#note-' + this.id) as HTMLTextAreaElement).value.replace(/\s\s/g, '\s');
        return {
            settings: this.settings,
            backgroundColor: this.backgroundColor,
            id: this.id,
            textColor: this.textColor,
            type: this.constructor.name
        };
    };
}

export interface baseSettings {
    width: number;
    height: number;
}

export interface CTabWidgetSerialized {
    id: number;
    settings: baseSettings;
    backgroundColor: string;
    textColor: string;
    type: string;
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
