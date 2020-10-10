import { css, customElement, html, LitElement, property } from 'lit-element';
import muuri, { GridOptions } from "muuri";

@customElement('widget-page')
export class WidgetPage extends LitElement {
    private grid?: muuri;

    @property({attribute:"fill-gaps"})
    private fillGaps = false;

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

    static get styles() {
        return css`#muuriGrid {
          position: relative;
        }
        .item {
          display: block;
          position: absolute;
          width: 100px;
          height: 100px;
          margin: 5px;
          z-index: 1;
          background: #000;
          color: #fff;
        }
        .item.muuri-item-dragging {
          z-index: 3;
        }
        .item.muuri-item-releasing {
          z-index: 2;
        }
        .item.muuri-item-hidden {
          z-index: 0;
        }
        .item-content {
          position: relative;
          width: 100%;
          height: 100%;
        }`;
    }

    // Define the element's template
    render() {
        return html`
<div id="muuriGrid">
          <div class="item">
            <div class="item-content">
              <!-- Safe zone, enter your custom markup -->
              This can be anything.
              <!-- Safe zone ends -->
            </div>
          </div>

          <div class="item">
            <div class="item-content">
              <!-- Safe zone, enter your custom markup -->
              <div class="my-custom-content">
                Yippee!
              </div>
              <!-- Safe zone ends -->
            </div>
          </div>
        </div>`;
    }
}
