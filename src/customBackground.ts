import { css, customElement, html, LitElement, unsafeCSS } from "lit-element";

@customElement('custom-background')
export class CustomBackground extends LitElement {

    render() {
        return html`<div id="background"></div>`;
    }

    static get styles() {
        let backgroundColor = 'black';
        try {
            backgroundColor = JSON.parse(window.localStorage?.getItem('CTab-settings') ?? "")?.backgroundColor;
        } catch(e) {
        }
        return css`       
            #background {
                position: fixed;
                z-index: -1;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: ${unsafeCSS(backgroundColor)};
            }`;
    }
}
