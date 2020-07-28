import settingsMenu from "./settingsMenu";
import muuri, { GridOptions } from "muuri";

export class GridWrapper {
    private muuriOptions: GridOptions = {
        dragEnabled: true,
        dragStartPredicate: {
            distance: 0,
            delay: 0,
        },
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
            fillGaps: settingsMenu.getMuuriFillgaps(),
            horizontal: false,
            alignRight: false,
            alignBottom: false,
            rounding: false
        },
        sortData: {
            id: function (item: any, _element: any) {
                return parseFloat(item._id);
            },
            title: function (_item: any, element: any) {
                const ctabBody: any = element.querySelector(".ctab-widget-body");
                if(ctabBody.classList.contains("ctab-item-clock")) {
                    return "ZZZ";
                }
                if(ctabBody.classList.contains("ctab-item-note")) {
                    return "ZZZ";
                }
                return ctabBody.children[0].innerText.toUpperCase();
            },
            tagAlpha: function (_item: any, element: any) {
                let tagsAttr: string = element.getAttribute("data-tags");
                return tagsAttr.split(",").sort(function (a: string, b: string) {
                    // sort alphabetically within tags
                    if(a < b) {
                        return -1;
                    }
                    if(a > b) {
                        return 1;
                    }

                    return 0;
                });
            },
            orderIndex: function (_item: any, element: any) {
                let widgetBody = element.querySelector(".ctab-widget-body");

                if (widgetBody && widgetBody.dataset.orderIndex != undefined) {
                    return parseFloat(widgetBody.dataset.orderIndex);
                } else {
                    return Number.MAX_SAFE_INTEGER;
                }
            }
        }
    };

    public grid: muuri;

    constructor(gridIdentifier: string | HTMLElement) {
        this.grid = new muuri(gridIdentifier, this.muuriOptions);
    }

}

