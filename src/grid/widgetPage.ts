import { css, CSSResult, customElement, html, LitElement, property } from 'lit-element';
import muuri, { GridOptions } from "muuri";

type WidgetType = {
    id: string,
    type: string,
    width: number,
    height:number,
    title: string,
    url: string,
    tags: string[],
    orderIndex: number,
}

@customElement('widget-page')
export class WidgetPage extends LitElement {
    private grid?: muuri;

    @property({attribute:"fill-gaps"})
    private fillGaps = false;

    @property({attribute:false})
    private _widgets: WidgetType[] = [{
        id: "i1",
        type: "linkWidget",
        width: 1,
        height: 1,
        title: "Twitter",
        url: "https://www.twitter.com",
        tags: ["socials"],
        orderIndex: Number.MAX_SAFE_INTEGER - 2
    },{
        id: "i2",
        type: "linkWidget",
        width: 1,
        height: 1,
        title: "Twitter",
        url: "https://www.twitter.com",
        tags: ["socials"],
        orderIndex: Number.MAX_SAFE_INTEGER - 2
    },{
        id: "i3",
        type: "linkWidget",
        width: 1,
        height: 1,
        title: "Twitter",
        url: "https://www.twitter.com",
        tags: ["socials"],
        orderIndex: Number.MAX_SAFE_INTEGER - 2
    },{
        id: "i4",
        type: "linkWidget",
        width: 2,
        height: 2,
        title: "Twitter",
        url: "https://www.twitter.com",
        tags: ["socials"],
        orderIndex: Number.MAX_SAFE_INTEGER - 2
    }];


    private newWidget(widget: WidgetType) {

        // private colorInfo() { // check litElement styleMap. then set on item-content
        //     return `style="color: var(--${this._id}-text-color);
        //     background-color: var(--${this._id}-background-color);
        //     --item-background-color:${'red'}//this.backgroundColor};
        //     "`;
        // };

        return html`<div class="item he${widget.height} w${widget.width}">
            <div class="item-content">
                <div class="ctab-widget-controls" id="controls-${widget.id}">
                    <div class="vanilla-color-picker widget-control-picker" id="${widget.id}-text-color" style="color:var(--${widget.id}-text-color); border-color: var(--${widget.id}-text-color); background-color: rgba(255,255,255,.8)">tc</div>
                        <div class="vanilla-color-picker widget-control-picker" id="${widget.id}-background-color" style="background-color: var(--${widget.id}-background-color); border-color: var(--${widget.id}-background-color);">bg</div>
                        <div class="deletebutton">
                            <button id="delete-${widget.id}">❌</button>
                        </div>
                </div>
                
                <clock-element></clock-element>
            </div>
        </div>`;
    }

    private muuriOptions: GridOptions = {
        dragEnabled: true,
        dragStartPredicate: {
            distance: 0,
            delay: 0,
        },
        dragHandle: '.ctab-widget-drag-handle',
        dragSortHeuristics: {
            sortInterval: 10,
            minDragDistance: 5,
            minBounceBackAngle: Math.PI / 2
        },
        dragCssProps: {
            touchAction: "pan-y",
            userSelect: "",
            userDrag: "",
            tapHighlightColor: "",
            touchCallout: "",
            contentZooming: ""
        },
        dragPlaceholder: {
            enabled: true,
            createElement: null,
            onCreate: null,
            onRemove: null
        },
        layoutOnInit: false,
        layout: {
            fillGaps: this.fillGaps,
            horizontal: false,
            alignRight: false,
            alignBottom: false,
            rounding: false
        },
        layoutEasing : 'ease',
        layoutDuration : 300,
        // sortData: {
        //     title: function (_item, element) {
        //         const ctabBody: any = element.querySelector(".ctab-widget-body");
        //         if(ctabBody.classList.contains("ctab-item-clock")) {
        //             return "ZZZ";
        //         }
        //         if(ctabBody.classList.contains("ctab-item-note")) {
        //             return "ZZZ";
        //         }
        //         return ctabBody.children[0].innerText.toUpperCase();
        //     },
        //     tagAlpha: function (_item, element) {
        //         let tagsAttr: string = element.getAttribute("data-tags")!;
        //         return tagsAttr.split(",").sort(function (a: string, b: string) {
        //             // sort alphabetically within tags
        //             if(a < b) {
        //                 return -1;
        //             }
        //             if(a > b) {
        //                 return 1;
        //             }
        //
        //             return 0;
        //         });
        //     },
        //     orderIndex: function (_item, element) {
        //         let widgetBody = element.querySelector(".ctab-widget-body") as HTMLElement;
        //
        //         if (widgetBody && widgetBody.dataset.orderIndex != null) {
        //             return parseFloat(widgetBody.dataset.orderIndex);
        //         } else {
        //             return Number.MAX_SAFE_INTEGER;
        //         }
        //     }
        // }
    };

    constructor() {
        super();
    }

    public firstUpdated() {
        this.grid = new muuri(this.shadowRoot!.querySelector("#muuriGrid") as HTMLElement, this.muuriOptions);
        window.addEventListener("drawer-toggled", () =>
            setTimeout(() => this.grid!.layout(), 0)
        );
    }

    public add() {

    }

    static get styles() {
        const getSizeStyles: CSSResult[] = [];
        for (let i = 1; i <= 12; i++) {
            getSizeStyles.push(css`
                .w${i} {
                    width: ${i * 150 + (i - 1) * 10}px;
                }
                
                .he${i} {
                    height: ${i * 60 + (i - 1) * 10}px;
                }
                `);
        }

        // language=CSS
        return getSizeStyles.concat([
            css`
        .hidden {
            display: none !important;
        }
        
        .item {
                position: absolute;
                z-index: 1;
                display: block;
                width: 100px;
                height: 100px;
                margin: 5px;
                color: #000000;
                background: transparent;
            }
            .muuri-item-dragging {
                z-index: 3;
            }
        
            .muuri-item-releasing {
                z-index: 2;
            }
        
            .muuri-item-hidden {
                z-index: 0;
            }
            div.muuri-item-placeholder {
                border: 2px #777777 dashed;
                border-radius: 4px;
            }
            .item-content {
              position: relative;
              width: 100%;
              height: 100%;
            }`,
            css`#muuriGrid {
                position: relative;    
                margin-top: 0;
                padding: 10px 0;
                height: 100%;
            }`]);
    }

    // Define the element's template
    render() {
        return html`
        <div id="muuriGrid">
            ${this._widgets.map(a => this.newWidget(a))}
        </div>`;
    }
}
