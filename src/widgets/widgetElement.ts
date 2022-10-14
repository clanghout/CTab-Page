import { css, customElement, html, LitElement } from "lit-element";

@customElement('widget-controls')
export abstract class WidgetElement extends LitElement {

    getType = this.constructor.name.replace("cTabWidgetType_", "");

    private readonly _widget_id: number;
    protected core: TemplateResult<1>;

    public getWidgetId(): number {
        return this._widget_id
    }

    public getIdString(): string {
        return "i" + this._widget_id
    }

    public settings: BaseSettings;
    public backgroundColor: string;
    public textColor: string;


    protected constructor(widget_id: number,
        settings: BaseSettings,
        backgroundColor: string,
        textColor: string,
        core: string,
    ) {
        super();
        this._widget_id = widget_id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.core = core;
    }

    render() {
        return html`
            <div class="item he${this.settings.height} w${this.settings.width}">
                <div class="item-content">
                    ${this.getHtmlControls()}
                    <div class="ctab-widget-drag-handle hidden" id="drag-handle-${this.getIdString()}">
                        <span style="top:0;left:0;">&#8598</span>
                        <span style="top:0; right: 0;">&#8599</span>
                        <span style="bottom:0; right: 0;">&#8600</span>
                        <span style="bottom:0; left: 0;">&#8601</span>
                    </div>
                    ${this.core}
                </div>
            </div>`;
    }

    static get styles() {
        // TODO due to styles needing to be static, we cannot inject the right stuff :(
        return css`style="color: var(--${this.getIdString()}-text-color);
        background-color: var(--${this.getIdString()}-background-color);
        --item-background-color:${this.backgroundColor};
        "`;
    }

    private getHtmlControls = () =>
        `<div class="ctab-widget-controls hidden" id="controls-${this.getIdString()}">
                    <div class="vanilla-color-picker widget-control-picker" id="${this.getIdString()}-text-color" style="color:var(--${this.getIdString()}-text-color); border-color: var(--${this.getIdString()}lor: rgba(255,255,255,.8)">tc</div>
                    <div class="vanilla-color-picker widget-control-picker" id="${this.getIdString()}-background-color" style="background-color: var(--${this.getIdString()}-background-color); border-color: var(--${this.getIdString()}-background-color);">bg</div>
                    <div class="deletebutton">
                        <button id="delete-${this.getIdString()}">❌</button>
                    </div>
                </div>`;
}

// export abstract class TitleWidget extends WidgetElement {
//     protected constructor(public id: string, public settings: TitleSettings, public backgroundColor: string, public textColor: string) {
//         super(id, settings, backgroundColor, textColor);
//     }
//
//     getConfig = (): CTabWidgetSerialized => {
//
//         this.settings.title = (document.querySelector(`#note-${this.id}`) as HTMLTextAreaElement).value.replace(/\s\s/g, "\s");
//         return {
//             settings: this.settings,
//             backgroundColor: this.backgroundColor,
//             id: this.id,
//             textColor: this.textColor,
//             type: this.constructor.name.replace("cTabWidgetType_", "")
//         };
//     };
// }
//
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
