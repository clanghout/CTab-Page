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

        this.settings.title = (document.querySelector('#note-' + this.id) as HTMLTextAreaElement).value.replace(/\s/g, '').trim();
        return {
            settings: this.settings,
            backgroundColor: this.backgroundColor,
            id: this.id,
            textColor: this.textColor,
            type: this.constructor.name
        };
    };
}


export class WeatherWidget extends CTabWidget {
    getTemplateCore = () => {
        return `<div id="${this.id}" class="ctab-widget-body">
                                        <input type="text" id="${this.id}-cityInput" style="width: 60%;float:left;">
                                        <button id="${this.id}-cityInputButton" data-id="${this.id}" style="font-size: 11px; width: 30%;float:left background-color: #eee; border-radius: 3px; border: 1px solid #ccc;">Change<br> city</button>
                                    <br>
                                        <span id="${this.id}-output" style="width: 100%; white-space: nowrap;">Loading weather</span>
                                    </div>`;
    };

    constructor(public id: number, public settings: weatherSettings, public backgroundColor: string, public textColor: string) {
        super(id, settings, backgroundColor, textColor);
    }
}

export class LinkWidget extends TitleWidget {
    constructor(public id: number, public settings: linkSettings, public backgroundColor: string, public textColor: string, public newTab: boolean) {
        super(id, settings, backgroundColor, textColor);
    }


    private getTag = () => `<span style="line-height: 100%;">${this.settings.title}</span>
<a href="${this.settings.url}" ${this.newTab ? 'target="_blank"' : ""} id="${this.settings.title}">
    <span class="ctab-widget-link"></span>
</a>`;

    getTemplateCore = () => {
        return `<div id="${this.id}" class="ctab-widget-body"> 
                                        ${this.getTag()} 
                                    </div>`;
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
}

export class ClockWidget extends CTabWidget {
    getTemplateCore = () => {
        return `<div id="${this.id}" class="ctab-widget-body ctab-item-clock"><span></span></div>`;
    };

    constructor(public id: number, public settings: baseSettings, public backgroundColor: string, public textColor: string) {
        super(id, settings, backgroundColor, textColor);
    }

}

export class BuienradarWidget extends CTabWidget {
    getTemplateCore = () => {
        return `<div id="${this.id}" class="ctab-widget-body">
                                        <IFRAME SRC="https://api.buienradar.nl/image/1.0/RadarMapNL?w=256&h=256" NORESIZE SCROLLING=NO HSPACE=0 VSPACE=0 FRAMEBORDER=0 MARGINHEIGHT=0 MARGINWIDTH=0 WIDTH=256 HEIGHT=256></IFRAME>
                                    </div>`;
    };

    constructor(public id: number, public settings: baseSettings, public backgroundColor: string, public textColor: string) {
        super(id, settings, backgroundColor, textColor);
    }
}

export class NoteWidget extends TitleWidget {
    getTemplateCore = () => {
        return `<div id="${this.id}" class="ctab-widget-body ctab-item-note">
                                        <textarea id="note-${this.id}">${this.settings.title}</textarea>
                                    </div>`;
    };

    constructor(public id: number, public settings: titleSettings, public backgroundColor: string, public textColor: string) {
        super(id, settings, backgroundColor, textColor);
    }
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

interface WidgetConstructor {
    new (id: number, settings: baseSettings, backgroundColor: string, textColor: string): CTabWidget;
}

export const cTabTypeMap: { [name: string]:  WidgetConstructor } = [BuienradarWidget, NoteWidget, ClockWidget, LinkWidget, WeatherWidget].reduce((acc, curr) => {
    acc[curr.name] = curr;
    return acc;
}, {} as any);
