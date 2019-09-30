import {
    BaseSettings,
    CTabWidget,
    CTabWidgetSerialized,
    LinkSettings,
    TitleSettings,
    WeatherSettings,
    TitleWidget
} from "./cTabWidgetTypeBase";

export class WeatherWidget extends CTabWidget {
    getTemplateCore = () => {
        return `<div id="${this.id}" class="ctab-widget-body">
                                        <input type="text" id="${this.id}-cityInput" style="width: 60%;float:left;">
                                        <button id="${this.id}-cityInputButton" data-id="${this.id}" style="font-size: 11px; width: 30%;float:left background-color: #eee; border-radius: 3px; border: 1px solid #ccc;">Change<br> city</button>
                                    <br>
                                        <span id="${this.id}-output" style="width: 100%; white-space: nowrap;">Loading weather</span>
                                    </div>`;
    };

    constructor(public id: string, public settings: WeatherSettings, public backgroundColor: string, public textColor: string) {
        super(id, settings, backgroundColor, textColor);
    }
}

export class LinkWidget extends TitleWidget {
    constructor(public id: string, public settings: LinkSettings, public backgroundColor: string, public textColor: string) {
        super(id, settings, backgroundColor, textColor);
    }


    private getTag = () => `<span style="line-height: 100%;">${this.settings.title}</span>
<a href="${this.settings.url}" ${this.settings.newTab ? 'target="_blank"' : ""} id="${this.settings.title}">
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
            type: this.constructor.name.replace("cTabWidgetType_", "")
        };
    };
}

export class ClockWidget extends CTabWidget {
    getTemplateCore = () => {
        return `<div id="${this.id}" class="ctab-widget-body ctab-item-clock"><span></span></div>`;
    };

    constructor(public id: string, public settings: BaseSettings, public backgroundColor: string, public textColor: string) {
        super(id, settings, backgroundColor, textColor);
    }

}

export class BuienradarWidget extends CTabWidget {
    getTemplateCore = () => {
        return `<div id="${this.id}" class="ctab-widget-body">
                                        <IFRAME SRC="https://api.buienradar.nl/image/1.0/RadarMapNL?w=256&h=256" NORESIZE SCROLLING=NO HSPACE=0 VSPACE=0 FRAMEBORDER=0 MARGINHEIGHT=0 MARGINWIDTH=0 WIDTH=256 HEIGHT=256></IFRAME>
                                    </div>`;
    };

    constructor(public id: string, public settings: BaseSettings, public backgroundColor: string, public textColor: string) {
        super(id, settings, backgroundColor, textColor);
    }
}

export class NoteWidget extends TitleWidget {
    getTemplateCore = () => {
        return `<div id="${this.id}" class="ctab-widget-body ctab-item-note">
                                        <textarea id="note-${this.id}">${this.settings.title}</textarea>
                                    </div>`;
    };

    constructor(public id: string, public settings: TitleSettings, public backgroundColor: string, public textColor: string) {
        super(id, settings, backgroundColor, textColor);
    }
}
