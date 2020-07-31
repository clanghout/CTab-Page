"use strict";

import {
    BaseSettings,
    CTabWidgetElement,
    CTabWidgetSerialized,
    LinkSettings,
    TitleSettings,
} from "./cTabWidgetTypeBase";
import {cTabTypeMap, widgetNameList} from "./cTabWidgetTypeHelper";
import vanillaPicker from "vanilla-picker";
import settingsMenu from "./settingsMenu";
import filterMenu from "./filterMenu";
import * as weatherEl from "./weatherControls";
import * as widgetTypes from "./cTabWidgetType";
import bigText from "big-text.js-patched";
import {GridWrapper} from "./gridWrapper";
import muuri from "muuri";
import {CTabWidget, WidgetCollection} from "./cTabWidget";

const availableWidgetTypes = widgetTypes as any;

let windowWrapped = window as any;
windowWrapped.browser = (() => {
    return windowWrapped.browser || windowWrapped.chrome || windowWrapped.msBrowser;
})();

// HTML element
const styleElem = document.head.appendChild(document.createElement("style"));

export class CTabGrid {

    public grid: muuri;
    private widgets: WidgetCollection = WidgetCollection.empty();
    // private widgets: Array<CTabWidgetElements> = [];
    private widgetColorPickerOpen: boolean = false;
    private dirty: boolean = false;


    constructor() {
        settingsMenu.initialize();
        this.grid = new GridWrapper(".grid").grid;
        this.loadModel();

        // start after Muuri initialized, because we need access to the widgets
        filterMenu.initialize(this.widgets.getWidgetElements(), this.grid);


        // @ts-ignore - no return for not showing a before-unload alert
        window.onbeforeunload = () => {
            // loosely implemented dirty state (did not care much before, dirty in the probability of change)
            // so an additional check is added as well comparing the current state to the saved state
            if (this.hasChanges() && settingsMenu.getShowUnsavedWarning()) {
                // You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?
                return "";
            }
            // service.saveGrid(); // Disabled to enable dev edit | possibly reenable with an autosave option in settings
        };

        // Start clocks
        startTime();
        document.querySelectorAll(".ctab-item-note").forEach(note => {
            note.addEventListener("change", this.noteChanged);
            note.addEventListener("keyup", this.noteChanged);
        });
        // Set dirty to false, since note widgets might have set the state to dirty
        this.dirty = false;

        this.initWidgetOrderViewData();
        this.initOrderingHook();
    }

    // Load in the model and add every individual widget to the grid.
    // Called by initialize;
    // Function that handles the addition of a widget to the actual grid.
    // Adding any necessary event listeners,
    // setting the body of the widget,
    // adding the control buttons to widgets,
    // and adapting the font size of the text using bigText
    public addWidgetToGrid(widget: CTabWidgetElement): void {
        let itemElem = document.createElement("div");
        itemElem.innerHTML = widget.widgetTemplate();

        let textColOpen = false;

        itemElem.firstChild!.addEventListener("mouseover", () => {
            if (!this.widgetColorPickerOpen) {
                const controlPanel = document.getElementById(`controls-${widget.id}`)!;
                const controlDragHandle = document.getElementById(`drag-handle-${widget.id}`)!;
                const biggerZIndex = "4";

                controlPanel.classList.remove("hidden");
                controlDragHandle.classList.remove("hidden");
                controlPanel.style.zIndex = biggerZIndex;
                controlPanel.parentElement!.style.zIndex = biggerZIndex;
                controlPanel.parentElement!.parentElement!.style.zIndex = biggerZIndex;
            }
        });


        itemElem.firstChild!.addEventListener("mouseout", () => {
            if (!textColOpen) {
                const controlPanel = document.getElementById(`controls-${widget.id}`)!;
                const controlDragHandle = document.getElementById(`drag-handle-${widget.id}`)!;
                const smallerZIndex = "1";
                controlPanel.style.zIndex = smallerZIndex;
                controlPanel.parentElement!.style.zIndex = smallerZIndex;
                controlPanel.parentElement!.parentElement!.style.zIndex = smallerZIndex;
                controlPanel.classList.add("hidden");
                controlDragHandle.classList.add("hidden");
            }
        });
        let addedGridItems = this.grid.add(itemElem.firstElementChild!, {index: widget.id});

        new vanillaPicker({
            parent: document.getElementById(`${widget.id}-text-color`)!,
            popup: "right", // "right"(default), "left", "top", "bottom"
            editor: false,
            color: widget.textColor || "#000000",
            onChange: (newCol) => {
                document.documentElement.style.setProperty(`--${widget.id}-text-color`, newCol.rgbaString);
                widget.textColor = newCol.rgbaString;
            },
            onDone: (newCol) => {
                widget.textColor = newCol.rgbaString;
            },
            onOpen: () => {
                this.toggleWidgetColorPicker(true);
                textColOpen = true;
            },
            onClose: () => {
                this.toggleWidgetColorPicker(false);
                textColOpen = false;
            }
        });
        new vanillaPicker({
            parent: document.getElementById(`${widget.id}-background-color`)!,
            popup: "right", // "right"(default), "left", "top", "bottom"
            editor: false,
            color: widget.backgroundColor || "#000000",
            onChange: (newCol) => {
                document.documentElement.style.setProperty(`--${widget.id}-background-color`, newCol.rgbaString);

                let widgetElement = document.getElementById(`${widget.id}`);
                if (widgetElement) {
                    widgetElement.style.setProperty(`--item-background-color`, newCol.rgbaString);
                    styleElem.innerHTML = `#${widget.id}:before {background-color: ${newCol.rgbaString}`;
                }
                widget.backgroundColor = newCol.rgbaString;
            },
            onDone: (newCol) => {
                widget.backgroundColor = newCol.rgbaString;
            },
            onOpen: () => {
                this.toggleWidgetColorPicker(true);
                textColOpen = true;
            },
            onClose: () => {
                this.toggleWidgetColorPicker(false);
                textColOpen = false;
            }
        });


        document.getElementById(`delete-${widget.id}`)!.addEventListener("click", () => this.removeWidget(widget.id));

        if (widget instanceof widgetTypes.WeatherWidget) {
            widget.settings.width = widget.settings.width > 1 ? widget.settings.width : 2;
            widget.settings.height = widget.settings.height > 1 ? widget.settings.height : 2;
            widget.settings.city = widget.settings.city || "delft";
            setTimeout(() => {
                weatherEl.addWeatherListener(widget, widget.id);
                (document.getElementById(`${widget.id}-cityInput`) as HTMLInputElement).value = widget.settings.city;
                weatherEl.getWeather(widget.id, widget.settings.city);
            }, 100);
        }

        try {
            if (widget instanceof widgetTypes.LinkWidget) {
                bigText(`#${widget.id} > span`, {
                    maximumFontSize: 45,
                    limitingDimension: "both",
                    verticalAlign: "center"
                });
            } else if (widget instanceof widgetTypes.ClockWidget) {
                bigText(`#${widget.id} > span`, {
                    maximumFontSize: 36,
                    limitingDimension: "both",
                    verticalAlign: "center"
                });
            } else if (widget instanceof widgetTypes.WeatherWidget) {
                bigText(`#${widget.id} > span`, {
                    maximumFontSize: 40,
                    limitingDimension: "both",
                    verticalAlign: "center"
                });
            }

        } catch (e) {
            console.log(widget.id, widget.getType, e);
        }

        this.widgets.push(new CTabWidget(addedGridItems[0], widget));
    }

    public loadModel(): void {
        let widgetData: Array<CTabWidgetSerialized> = this.getConfig();
        if (!Array.isArray(widgetData)) {
            // Set default settings
            const fbSetting: LinkSettings = {
                width: 1,
                height: 1,
                title: "Facebook",
                url: "https://www.facebook.com",
                newTab: false,
                tags: ["socials"],
                orderIndex: Number.MAX_SAFE_INTEGER - 3
            };
            const twSetting: LinkSettings = {
                width: 1,
                height: 1,
                title: "Twitter",
                url: "https://www.twitter.com",
                newTab: false,
                tags: ["socials"],
                orderIndex: Number.MAX_SAFE_INTEGER - 2
            };
            const noteSetting: TitleSettings = {
                width: 2,
                height: 2,
                title: "Welcome to CTab page!",
                tags: [],
                orderIndex: Number.MAX_SAFE_INTEGER - 1
            };
            widgetData =
                [
                    {
                        settings: fbSetting,
                        backgroundColor: "rgba(67,146,241,0.5)",
                        textColor: "rgba(255,255,255,1)",
                        id: "i1559213769276",
                        type: "LinkWidget"
                    },
                    {
                        settings: twSetting,
                        backgroundColor: "rgba(67,228,247,0.5)"
                        , textColor: "rgba(255,255,255,1)",
                        id: "i1559213802713",
                        type: "LinkWidget"
                    },
                    {
                        settings: noteSetting,
                        backgroundColor: "rgba(255,255,255,0.5)",
                        id: "i1559214281406",
                        textColor: "rgba(0,0,0,1)",
                        type: "NoteWidget"
                    },
                    {
                        settings: {width: 1, height: 1, tags: [], orderIndex: Number.MAX_SAFE_INTEGER},
                        backgroundColor: "rgba(255,255,255,0.5)",
                        textColor: "rgba(0,0,0,1)",
                        id: "i1559060644840",
                        type: "ClockWidget"
                    },
                ];
        }

        widgetData.filter((a: CTabWidgetSerialized) => a !== null).forEach((widget: CTabWidgetSerialized) => {
            // what if widget does not have a type
            try {
                if (widget.type === "LinkWidget") {
                    (widget.settings as LinkSettings).newTab = settingsMenu.getNewTab();
                }
                this.addWidgetToGrid(new availableWidgetTypes[widget.type](widget.id, widget.settings, widget.backgroundColor, widget.textColor));
            } catch (e) {
                if (widget) {
                    console.log(`Widget type ${widget.type} does not exist.`);
                }
                console.log(`Existing types are:`, widgetNameList);
                console.log(widgetTypes);
                console.error(e);

            }
        });

    }

    // Retrieve the current config from the browser's localstorage
    public getConfig(): Array<CTabWidgetSerialized> {
        let lsConfig = window.localStorage.getItem("CTabConfig") || "{}";
        let config: Array<CTabWidgetSerialized> = [];
        try {
            config = JSON.parse(lsConfig);
        } catch (error) {
            console.error(`Config could not be parsed, found configuration:`, lsConfig);
            console.error(error);
        }
        return config;
    }

    public removeWidget(id: string): void {
        let item = this.widgets.removeById(id);

        if (item) {
            this.grid.remove([item], {removeElements: true, layout: true});
            this.dirty = true;
        }
    }

    // Write param to localStorage
    public setConfig(config: Array<CTabWidgetSerialized>): void {
        window.localStorage.setItem("CTabConfig", JSON.stringify(config));
    }

    // Returns message if save call is executed or not
    public saveGrid(): string {
        this.updateWidgetOrderingData();

        if (this.hasChanges()) {
            this.setConfig(this.getDashboardConfig());
            this.dirty = false;
            return "Configuration saved!";
        } else {
            return "Nothing to save.";
        }
    }

    // Create a new widget object and add it to the dashboard.
    public createWidget(type: string, settings: BaseSettings, backgroundColor: string, textColor: string): void {
        this.dirty = true;
        try {
            this.addWidgetToGrid(
                new availableWidgetTypes[type](`i${new Date().getTime().toString()}`, settings, backgroundColor, textColor));
        } catch (e) {
            if (type) {
                console.log(`Widget type ${type} does not exist.`);
            }
            console.log(`Existing types are:`, widgetNameList);
            console.log(cTabTypeMap);
            console.log(widgetTypes);
            console.error(e);
        }
    }

    // When dragging stops, we update the ordering indices for all elements
    // FIXME: This does mean that if we are in a different ordering view (e.g.
    //   "date added", we'll update the ordering to the currently active view);
    //   whether that is the intended action is to be decided...
    private initOrderingHook() {
        let self = this;

        this.grid.on("dragEnd", function(_item, _event) {
            self.updateWidgetOrderingData();
        });
    }

    // Sets the data-order-index attribute which is used by the grid sorting function
    // to correctly display the user defined ordering of elements
    //
    // FIXME: Upon adding the widgetBody.dataset.orderIndex on addWidgetToGrid resulted in
    //   undefined errors for the widgetBody element. Is it not yet initialized at that
    //   stage? This method instead creates the data-order-index elements after everything else
    //  has been initialized by the constructor
    private initWidgetOrderViewData() {
        let self = this;

        // add user ordering data
        this.grid.getItems().forEach((gridItem) => {
            let widgetBody = gridItem.getElement()!.querySelector(".ctab-widget-body");
            let widgetId = widgetBody!.id;
            let matchingWidget = self.widgets.getWidgetForId(widgetId);

            if (matchingWidget) {
                (widgetBody as HTMLElement).dataset.orderIndex = `${matchingWidget.widgetElement.settings.orderIndex}`;
            }
        });

        this.grid.refreshSortData();
    }

    private updateWidgetOrderingData() {
        let self = this;
        let updatedSortingData = false;

        self.grid.getItems().forEach((gridItem, index) => {
            let widgetBody = gridItem.getElement()!.querySelector(".ctab-widget-body");
            let widgetId = widgetBody!.id;
            let matchingWidget = self.widgets.getWidgetForId(widgetId);

            if (matchingWidget) {
                // this is the value used for saving and loading to localStorage
                matchingWidget.widgetElement.settings.orderIndex = index;
                // this is the value used by the grid for sorting
                (widgetBody as HTMLElement).dataset.orderIndex = `${index}`;

                // we need to reset the sorting data, since we updated the orderIndex, used by one of the sorters
                updatedSortingData = true;
            } else {
                console.warn(`Didn't find a matching widget for ${widgetBody!.id}`);
            }
        })

        if (updatedSortingData) {
            self.grid.refreshSortData();
            self.dirty = true;
        }
    }

    // Toggle the color pickers
    private toggleWidgetColorPicker(isOpen: boolean): void {
        this.widgetColorPickerOpen = isOpen;
    }

    // Listener for note widgets on change

    // Used to track whether changes have been made that need to be saved.
    private noteChanged(): void {
        this.dirty = true;
    }

    // Check if the current state of the dashboard is different from the saved state
    private hasChanges(): boolean {
        let saved = this.getConfig();
        let current = this.getDashboardConfig();
        // compare strings since object compare is always different with ==
        if (JSON.stringify(saved) !== JSON.stringify(current)) {
            if (this.dirty) {
                return true;
            }
            console.log("Changes exist but dirty is false");
            return true;
        }
        return false;
    }


    // Getter for the current config
    private getDashboardConfig(): Array<CTabWidgetSerialized> {
        return this.widgets.getWidgetElements().map(widget => widget.getConfig());
    }

}

// Independent functions
// From w3 to add clock
function startTime(): void {
    let clocks = document.querySelectorAll(".ctab-item-clock");
    if (clocks.length > 0) {
        const todayDate = new Date();
        const timezone = settingsMenu.getTimezone();
        const today = todayDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: timezone,
            hour12: false
        });
        clocks.forEach(a => a.children[0].innerHTML = today);
        setTimeout(startTime, 500);
    }
}

export default CTabGrid;
