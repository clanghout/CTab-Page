import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit-element';
import bigText from "big-text.js-patched";

@customElement('clock-element')
export class Clock extends LitElement {


    @property()
    timezone = "Europe/Amsterdam";

    @property({attribute: "show-date", type: Boolean})
    showDate = false;

    @property({attribute: "id", type: String})
    id = '';

    @state()
    private _currentTime: string = "";

    get currentTime(): string {
        return this._currentTime;
    }

    set currentTime(val) {
        const previousTime = this._currentTime;
        this._currentTime = val;
        this.requestUpdate("currentTime", previousTime)
    }

    constructor() {
        super();
        this.startTime();
        if(this.id) {
            bigText(`#${this.id} > span`, {
                maximumFontSize: 36,
                limitingDimension: "both",
                verticalAlign: "center"
            })
        }
    }

    private startTime(): void {
        this.currentTime = new Date().toLocaleTimeString("nl-NL", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: this.timezone,
            hour12: false
        });
        setTimeout(this.startTime.bind(this), 1000);
    }


    private date() {
        const today = new Date();
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return html`<span>${weekdays[today.getDay()]} ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}</span>`;
    }

    render() {
        return html`<div class="clock" id="${this.id}">
                <span>${this.currentTime}</span> <br />
                ${this.showDate ? this.date() : ""}
            </div>`;
    }

    static get styles() {
        return css`.clock { 
            color: red; 
        }`;
    }
}
