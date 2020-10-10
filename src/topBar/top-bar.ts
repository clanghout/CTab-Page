import { css, CSSResult, customElement, html, LitElement } from 'lit-element';

@customElement('top-bar')
export class TopBar extends LitElement {

    static get styles() {
        const topbarHeight: CSSResult = css`55px`;

        return css`
        .top-bar {
            position: fixed;
            z-index: 5;
            top: 0;
            left: 0;
            display: flex;
            overflow: hidden;
            align-items: flex-start;
            justify-content: space-between;
            width: 100%;
            height: ${topbarHeight};
            padding: 5px 0;
        }
        `;
    }

    /*
    *
    div {
        float: left;
        margin: 0 10px;
    }

    #logo1 {
        font-size: 2em;

        a {
            text-decoration: none;
            color: #F5F5F5;

            :hover {
                text-decoration: underline;
            }

            :visited {
                color: #F5F5F5;
            }
        }
    }

    .clockdate {
        font-size: 1.5em;
        text-align: right;

        .clock, .date {
            float: right;
            width: 100%;
            color: #FFFFFF;
        }
    }

    button {
        font-weight: bold;
        z-index: 5;
        margin: 10px 2px 0;
        padding: 5px;
        border: 1px solid lightslategrey;
        border-radius: 3px;
    }

    .buttonBar {
        float: left;
        width: 300px;

        button {
            background-color: lightblue;
        }

        #saveButton, #backupButton {
            background-color: lightgreen;
        }

        #clearButton {
            background-color: lightcoral;
        }

        #debugButton, #widescreenButton {
            background-color: yellow;
        }
    }

    #settings-toggle {
        background-color: lightblue;
    }

    .dev-toggle {
        display: var(--experimental-features-display);
        color: white;
    }
}*/

    // Define the element's template
    render() {
        return html`<div class="top-bar">
            <div id="logo1"><a href="https://github.com/clanghout/ctab-page" target="_blank"
                                                 title="to github page" rel="noopener noreferrer">CTab</a>
            </div>
            <slot></slot>
            <slot></slot>
            <slot></slot>
            <slot></slot>
        </div>
    `;
    }
}
// private settingsActive: boolean = false;
// private settingsPaneDiv: HTMLDivElement | null = document.querySelector("#settingsMenu");
// private modalBackdrop: HTMLDivElement | null = document.querySelector("#modal-backdrop");
//
// public settingsPane: any = document.getElementById('settings-pane');
//
// private settingsToggle(): void {
//     this.settingsActive = !this.settingsActive;
//     this.settingsActive ? this.settingsPaneDiv!.classList.remove("hidden") : this.settingsPaneDiv!.classList.add(
//         "hidden");
//     this.settingsActive ? this.modalBackdrop!.classList.remove("hidden") : this.modalBackdrop!.classList.add(
//         "hidden");
//     this.settingsActive ? this.modalBackdrop!.addEventListener("click",
//         this.settingsToggle) : this.modalBackdrop!.removeEventListener("click",
//         this.settingsToggle);
// }

// <div style="order: 2">
//         <div class="sorting-control">
//             <select class="sortingDropdown" id="sortingDropdown" name="sorting">
//                 <option value="id-asc">date added</option>
//                 <option value="id-desc">date added (descending)</option>
//                 <option value="alpha-asc">title</option>
//                 <option value="alpha-desc">title (descending)</option>
//                 <option value="tag-alpha">tag (alphabetical)</option>
//                 <option value="user-order" selected>user order</option>
//             </select>
//         </div>
//     </div>
//     <div class="dev-toggle" style="order: 3;">
//         <input id="devEnabled" type="checkbox"/>
//         <label for="devEnabled">Developer mode</label>
//     </div>
//     <div class="buttonBar" style="order: 4;">
//         <button id="saveButton" title="Ctrl+Shift+S">Save</button>
//     </div>
//     <div style="order: 5;">
//         <button id="settings-toggle" @click="${this.settingsToggle}">settings</button>
//     </div>
//     <div style="order: 6;">
//         <button id="filter-menu-toggle">filters</button>
//     </div>
//     <div class="clockdate" style="order: 7">
//         <div class="clock ctab-item-clock"><span></span></div>
//         <div class="date"><span id="currDate"></span></div>
//     </div>
//     <div id="side-toggle">
//
//     </div>
//
// </div><settings-pane id="settings-pane"></settings-pane><side-menu></side-menu>
