"use strict";
/* eslint-env node, browser, jquery */
import {baseSettings} from "./cTabWidgetType";

interface PickerColor {
    rgbaString: string;
    rgbString: string;
    rgba: number[];
    hsla: number[];
    hslString: string;
    hslaString: string;
    hex: string;
}

declare class Picker {
    constructor(settings: {
        parent?: HTMLElement;
        popup?: "top" | "bottom" | "left" | "right";
        template?: string;
        alpha?: boolean;
        editor?: boolean;
        editorFormat?: 'hex' | 'hsl' | 'rgb';
        color?: string;
        onChange?: (color: PickerColor) => void;
        onDone?: (color: PickerColor) => void;
        onOpen?: (color: PickerColor) => void;
        onClose?: (color: PickerColor) => void;
    });
}

(<any>window).browser = (() => {
    return (<any>window).browser || (<any>window).chrome || (<any>window).msBrowser;
})();

const styleElem = (<any>document).head.appendChild(document.createElement('style'));


import CTabSettings from "./settingsMenu";
import * as CTabWidgetTypes from './cTabWidgetType';
import * as weatherEl from './weatherControls';


// grid return object
interface CTabGrid {
    initialize: () => void;
    saveGrid: () => string;
    simpleAdd: (type: string, settings: baseSettings, backgroundColor: string, textColor: string) => void;
    debug: (sampleConfig: boolean, addSampleWidgets: boolean) => void;

    // todo define config as type
    setConfig: (config: any[]) => void;
    getConfig: () => object[];
}

function grid(): CTabGrid {
    let grid: any;
    let widgets: CTabWidgetTypes.CTabWidget[] = [];
    let widgetColorPickerOpen: boolean = false;
    let dirty: boolean = false;
    const options = {
        // Muuri options
        dragEnabled: true,
        layoutOnInit: false,
        layout: {
            fillGaps: false,
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
                const ctabBody: any = [].slice.call(element.children[0].children).filter((el: HTMLElement) => el.classList.contains("ctab-widget-body"))[0];
                if (ctabBody.classList.contains('ctab-item-clock')) {
                    return "ZZZ";
                }
                if (ctabBody.classList.contains('ctab-item-note')) {
                    return "ZZZ";
                }
                return ctabBody.children[0].innerText.toUpperCase();
            }
        }
    };

    const initialize = function (): void {
        const muuriCopy = (window as any).Muuri;
        grid = new muuriCopy(".grid", options);
        load();


        // Save whenever you leave the screen
        // TODO: fix with muuri
        // @ts-ignore - no return for not showing a before-unload alert
        window.onbeforeunload = function () {
            // dirty state is implemented loosely (did not care much before, dirty in the probability of change)
            // so an extra check is also added comparing the current state to the saved state
            if (hasChanges() && CTabSettings.getShowUnsavedWarning()) {
                return "You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?";
            }
            // service.saveGrid(); // Disabled to enable dev edit
        };


        // TODO: fix with muuri
        // service.grid.on("change", function (event, items) {
        //     dirty = true;
        //     // When you change the title of a widget, a gridstack onChange event is retrieved with
        //     // items === 'undefined'.
        //     if (typeof items !== 'undefined') {
        //         for (let i = 0; i < items.length; i++) {
        //             if (items[i].id in service.widgets) {
        //                 service.update(items[i].id, items[i]);
        //                 // Call to textfill library, dynamically adapting the font size
        //                 $('#' + items[i].id).textfill({
        //                     minFontPixels: 10,
        //                     allowOverflow: true,
        //                 });
        //             }
        //         }
        //     }
        // });

        // Call to textfill library, calculate font sizes that make the text fit in the boxes.
        widgets.forEach(i => ($('#' + i.id) as any).textfill({
            minFontPixels: 12,
            allowOverflow: true,
        }));
        // Start clocks
        startTime();
        document.querySelectorAll(".ctab-item-note").forEach(note => {
            note.addEventListener('change', noteChanged);
            note.addEventListener('keyup', noteChanged);
        });
        // Set dirty to false, since note widgets might have set the state to dirty
        dirty = false;

        ($('.ctab-item-clock') as any).textfill({
            minFontPixels: 10,
            allowOverflow: true,
        });
    };

    const getConfig = () => {
        let lsConfig = window.localStorage.getItem("CTabConfig") || "{}";
        let config = [];
        try {
            config = JSON.parse(lsConfig);
        } catch (error) {
            console.error(`Config could not be parsed, found configuration:`, lsConfig);
            console.error(error);
        }
        return config;
    };

    const setConfig = (config: any[]) => {
        if (config.length >= 1)
            window.localStorage.setItem("CTabConfig", JSON.stringify(config));
        else {
            console.log("config too small", config);
        }
    };
    // Returns message if save call is executed or not
    const saveGrid = () => {
        if (hasChanges()) {
            service.setConfig(getDashboardConfig());
            dirty = false;
            return "Configuration saved!";
        } else {
            return "nothing to save";
        }
    };

    const debug = (sampleConfig: boolean, addSampleWidgets: boolean) => {
        console.log("debug:");
        if (sampleConfig) {
            console.log("using sample config");
            let sampleConfiguration = [{
                settings: {"width": 2, "height": 2, title: "github"},
                contentUrl: 'https://www.github.com',
                newTab: CTabSettings.getNewTab()
            }];
            service.setConfig(sampleConfiguration);
        }
        if (addSampleWidgets) {
            addWidgetToGrid(new CTabWidgetTypes.LinkWidget(widgets.length, {
                width: 1,
                height: 1,
                title: "hallo!", url: "https://github.com"
            }, "rgba(255,255,255,0.5)", "rgba(0,0,0,1)", CTabSettings.getNewTab()));
        }
    };

    const simpleAdd = function (type: string, settings: baseSettings, backgroundColor: string, textColor: string) {

        addWidgetToGrid(
            new CTabWidgetTypes.cTabTypeMap[type](widgets.length, settings, backgroundColor, textColor));
    };

    // Define return object
    let service: CTabGrid = {
        initialize: initialize,
        saveGrid: saveGrid,
        simpleAdd: simpleAdd,
        debug: debug,
        setConfig: setConfig,
        getConfig: getConfig
    };

    const toggleWidgetColorPicker = (isOpen: boolean): void => {
        widgetColorPickerOpen = isOpen;
    };

    const noteChanged = () => {
        dirty = true;
    };

    const hasChanges = () => {
        let saved = service.getConfig();
        let current = getDashboardConfig();
        // compare strings since object compare is always different with ==
        if (JSON.stringify(saved) !== JSON.stringify(current)) {
            if (dirty) {
                return true;
            }
            console.log("Changes exist but dirty is false");
            return true;
        }
        return false;
    };

    const removeWidget = function (id: number) {
        // Get the outer muuri cell
        let innerId = document.getElementById(id.toString());
        let cell = innerId!.parentElement!.parentElement;

        if (cell) {
            // remove from the grid (ui only)
            grid.remove([cell], {removeElements: true, layout: true});

            // also remove from widgets, otherwise no changes will be detected on saving.
            delete widgets[id];
        }
    };

    const addWidgetToGrid = function (widget: any) {
        let itemElem = document.createElement('div');
        itemElem.innerHTML = widget.widgetTemplate();

        let textColOpen = false;

        itemElem.firstChild!.addEventListener('mouseover', () => {
            if (!widgetColorPickerOpen) {
                const controlPanel = document.getElementById(`controls-${widget.id}`)!;
                const controlDragHandle = document.getElementById(`drag-handle-${widget.id}`)!;
                const biggerZIndex = "4";

                controlPanel.classList.remove('hidden');
                controlDragHandle.classList.remove('hidden');
                controlPanel.style.zIndex = biggerZIndex;
                controlPanel.parentElement!.style.zIndex = biggerZIndex;
                controlPanel.parentElement!.parentElement!.style.zIndex = biggerZIndex;
            }
        });


        itemElem!.firstChild!.addEventListener('mouseout', () => {
            if (!textColOpen) {
                const controlPanel = document.getElementById(`controls-${widget.id}`)!;
                const controlDragHandle = document.getElementById(`drag-handle-${widget.id}`)!;
                const smallerZIndex = "1";
                controlPanel.style.zIndex = smallerZIndex;
                controlPanel.parentElement!.style.zIndex = smallerZIndex;
                controlPanel.parentElement!.parentElement!.style.zIndex = smallerZIndex;
                controlPanel.classList.add('hidden');
                controlDragHandle.classList.add('hidden');
            }
        });
        grid.add(itemElem.firstChild, {index: widget.id});

        new Picker({
            parent: document.getElementById(`${widget.id}-text-color`)!,
            popup: 'right', // 'right'(default), 'left', 'top', 'bottom'
            editor: false,
            color: widget.textColor || '#000000',
            onChange: (newCol) => {
                (document as any).documentElement.style.setProperty(`--${widget.id}-text-color`, newCol.rgbaString);
                widget.textColor = newCol.rgbaString;
            },
            onDone: (newCol) => {
                widget.textColor = newCol.rgbaString;
            },
            onOpen: () => {
                toggleWidgetColorPicker(true);
                textColOpen = true;
            },
            onClose: () => {
                toggleWidgetColorPicker(false);
                textColOpen = false;
            }
        });
        new Picker({
            parent: document.getElementById(`${widget.id}-background-color`)!,
            popup: 'right', // 'right'(default), 'left', 'top', 'bottom'
            editor: false,
            color: widget.backgroundColor || '#000000',
            onChange: (newCol) => {
                (document as any).documentElement.style.setProperty(`--${widget.id}-background-color`, newCol.rgbaString);

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
                toggleWidgetColorPicker(true);
                textColOpen = true;
            },
            onClose: () => {
                toggleWidgetColorPicker(false);
                textColOpen = false;
            }
        });


        document.getElementById(`delete-${widget.id}`)!.addEventListener('click', () => removeWidget(widget.id));


        if (widget.type === 'weather') {
            widget.settings.width = widget.settings.width > 1 ? widget.settings.width : 2;
            widget.settings.height = widget.settings.height > 1 ? widget.settings.height : 2;
            widget.settings.city = widget.settings.city ? widget.settings.city : "delft";
            setTimeout(() => {
                weatherEl.addWeatherListener(widget, widget.id);
                (document.getElementById(widget.id + '-cityInput') as HTMLInputElement).value = widget.settings.city;
                weatherEl.getWeather(widget.id, widget.settings.city);
            }, 100);
        }

        widgets.push(widget);
    };


    const getDashboardConfig = function () {
        return widgets.map(widget => widget.getConfig());
    };


    // Loads the user configuration in the dashboard
    const load = function () {
        loadModel();
        loadGrid();
    };


    const loadModel = function () {
        let widgetData: any = service.getConfig();
        widgets = [];
        widgetData = Array.isArray(widgetData) ? widgetData : [];

        widgets = widgetData.map((widget: any) => {
            // what if widget does not have a type
            return new CTabWidgetTypes.cTabTypeMap[widget.type](widget.id, widget.settings, widget.backgroundColor, widget.textColor)
        });

    };

    const loadGrid = function () {
        // add the widgets to the grid
        for (let key in widgets) {
            if (widgets.hasOwnProperty(key)) {
                let widget = widgets[key];
                addWidgetToGrid(widget);
            }
        }

    };

    return service;

}


// Independent functions
// From w3 to add clock
function startTime() {
    let clocks = document.querySelectorAll('.ctab-item-clock');
    if (clocks.length > 0) {
        const todayDate = new Date();
        const timezone = CTabSettings.getTimezone();
        const today = todayDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: timezone,
            hour12: false
        });
        clocks.forEach(a => a.children[0].innerHTML = today);
        setTimeout(startTime, 500);
    }
}

export default grid;
