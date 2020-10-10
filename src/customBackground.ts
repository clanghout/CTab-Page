import { css, customElement, html, LitElement, unsafeCSS } from "lit-element";

@customElement('custom-background')
export class CustomBackground extends LitElement {

    render() {
        return html`<div id="background"></div>`;
    }

    static get styles() {
        const backgroundColor = JSON.parse(window.localStorage?.getItem('CTab-settings') ?? "")?.backgroundColor ?? 'black';

        return css`       
            #background {
                position: fixed;
                z-index: -1;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${unsafeCSS(backgroundColor)};
            }`;
    }
}
