export class CTabWidget {
    constructor(id, settings, backgroundColor, textColor) {
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.widgetTemplate = () => {
            let template = `<div class="item he${this.settings.height} w${this.settings.width}">
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
        this.getConfig = () => {
            return {
                settings: this.settings,
                backgroundColor: this.backgroundColor,
                textColor: this.textColor,
                id: this.id,
                type: this.constructor.name
            };
        };
        this.colorInfo = () => {
            return `style="color: var(--${this.id}-text-color);
        background-color: var(--${this.id}-background-color);
        --item-background-color:${this.backgroundColor};
        "`;
        };
        this.getHtmlControls = () => `<div class="ctab-widget-controls hidden" id="controls-${this.id}">
                    <div class="deletebutton">
                        <button id="delete-${this.id}" style="padding: 0; border: 0; background: transparent;">❌</button>
                    </div>
                    <div class="vanilla-color-picker widget-control-picker" id="${this.id}-text-color" style="color:var(--${this.id}-text-color); border-color: var(--${this.id}-text-color); background-color: rgba(255,255,255,.8)">tc</div>
                    <div class="vanilla-color-picker widget-control-picker" id="${this.id}-background-color" style="background-color: var(--${this.id}-background-color); border-color: var(--${this.id}-background-color);">bg</div>
                </div>`;
    }
}
export class TitleWidget extends CTabWidget {
    constructor(id, settings, backgroundColor, textColor) {
        super(id, settings, backgroundColor, textColor);
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.getConfig = () => {
            this.settings.title = document.querySelector('#note-' + this.id).value.replace(/\s/g, '').trim();
            return {
                settings: this.settings,
                backgroundColor: this.backgroundColor,
                id: this.id,
                textColor: this.textColor,
                type: this.constructor.name
            };
        };
    }
    ;
}
export class WeatherWidget extends CTabWidget {
    constructor(id, settings, backgroundColor, textColor) {
        super(id, settings, backgroundColor, textColor);
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.getTemplateCore = () => {
            return `<div id="${this.id}" class="ctab-widget-body">
                                        <input type="text" id="${this.id}-cityInput" style="width: 60%;float:left;">
                                        <button id="${this.id}-cityInputButton" data-id="${this.id}" style="font-size: 11px; width: 30%;float:left background-color: #eee; border-radius: 3px; border: 1px solid #ccc;">Change<br> city</button>
                                    <br>
                                        <span id="${this.id}-output" style="width: 100%; white-space: nowrap;">Loading weather</span>
                                    </div>`;
        };
    }
}
export class LinkWidget extends TitleWidget {
    constructor(id, settings, backgroundColor, textColor, newTab) {
        super(id, settings, backgroundColor, textColor);
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.newTab = newTab;
        this.getTag = () => `<span style="line-height: 100%;">${this.settings.title}</span>
<a href="${this.settings.url}" ${this.newTab ? 'target="_blank"' : ""} id="${this.settings.title}">
    <span class="ctab-widget-link"></span>
</a>`;
        this.getTemplateCore = () => {
            return `<div id="${this.id}" class="ctab-widget-body"> 
                                        ${this.getTag()} 
                                    </div>`;
        };
        this.getConfig = () => {
            return {
                settings: this.settings,
                backgroundColor: this.backgroundColor,
                textColor: this.textColor,
                id: this.id,
                type: this.constructor.name
            };
        };
    }
}
export class ClockWidget extends CTabWidget {
    constructor(id, settings, backgroundColor, textColor) {
        super(id, settings, backgroundColor, textColor);
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.getTemplateCore = () => {
            return `<div id="${this.id}" class="ctab-widget-body ctab-item-clock"><span></span></div>`;
        };
    }
}
export class BuienradarWidget extends CTabWidget {
    constructor(id, settings, backgroundColor, textColor) {
        super(id, settings, backgroundColor, textColor);
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.getTemplateCore = () => {
            return `<div id="${this.id}" class="ctab-widget-body">
                                        <IFRAME SRC="https://api.buienradar.nl/image/1.0/RadarMapNL?w=256&h=256" NORESIZE SCROLLING=NO HSPACE=0 VSPACE=0 FRAMEBORDER=0 MARGINHEIGHT=0 MARGINWIDTH=0 WIDTH=256 HEIGHT=256></IFRAME>
                                    </div>`;
        };
    }
}
export class NoteWidget extends TitleWidget {
    constructor(id, settings, backgroundColor, textColor) {
        super(id, settings, backgroundColor, textColor);
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.getTemplateCore = () => {
            return `<div id="${this.id}" class="ctab-widget-body ctab-item-note">
                                        <textarea id="note-${this.id}">${this.settings.title}</textarea>
                                    </div>`;
        };
    }
}
export const cTabTypeMap = [BuienradarWidget, NoteWidget, ClockWidget, LinkWidget, WeatherWidget].reduce((acc, curr) => {
    acc[curr.name] = curr;
    return acc;
}, {});
//# sourceMappingURL=cTabWidgetType.js.map