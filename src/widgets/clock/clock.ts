import { css, customElement, html, internalProperty, LitElement, property } from "lit-element";

@customElement('clock-element')
export class Clock extends LitElement {


    @property()
    timezone = "Europe/Amsterdam";

    @property({attribute: "show-date", type: Boolean})
    showDate = false;

    @internalProperty()
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
    }

    private startTime(): void {
        this.currentTime = new Date().toLocaleTimeString("en-US", {
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
        return html`<div class="clock">
                ${this.currentTime} <br />
                ${this.showDate ? this.date() : ""}
            </div>`;
    }

    static get styles() {
        return css`.clock { 
            color: red; 
        }`;
    }
}
