"use strict";

import {baseSettings, CTabWidget, CTabWidgetSerialized, linkSettings} from "./cTabWidgetTypeBase";
import * as CTabWidgetTypes from './cTabWidgetType';
import {cTabTypeMap, widgetNameList} from "./cTabWidgetTypeHelper";
import Picker from 'vanilla-picker';
import CTabSettings from "./settingsMenu";
import * as weatherEl from './weatherControls';
import * as widgetTypes from "./cTabWidgetType";
import BigText from 'big-text.js-patched';
// @ts-ignore Muuri does not export an object as of version 0.7.1; it is listed as a TODO in their source code
import Muuri from "muuri";

(window as any).browser = (() => {
    return (window as any).browser || (window as any).chrome || (window as any).msBrowser;
})();

const styleElem = document.head.appendChild(document.createElement('style'));

// grid return object
interface CTabGrid {
    initialize: () => void;
    saveGrid: () => string;
    simpleAdd: (type: string, settings: baseSettings, backgroundColor: string, textColor: string) => void;
    debug: (sampleConfig: boolean, addSampleWidgets: boolean) => void;

    setConfig: (config: CTabWidgetSerialized[]) => void;
    getConfig: () => CTabWidgetSerialized[];
}


// module function; this will be exported
function grid(): CTabGrid {
    let grid: any;
    let widgets: CTabWidget[] = [];
    let widgetColorPickerOpen: boolean = false;
    let dirty: boolean = false;
    const options = {
        // Muuri options
        dragEnabled: true,
        dragStartPredicate: {
            distance: 0,
            delay: 0,
            handle: '.ctab-widget-drag-handle'
        },
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

    // Function to be called to initialize the CTab page.
    //  This function will
    const initialize = function (): void {
        CTabSettings.initialize();
        grid = new Muuri(".grid", options);
        loadModel();

        // @ts-ignore - no return for not showing a before-unload alert
        window.onbeforeunload = function () {
            // dirty state is implemented loosely (did not care much before, dirty in the probability of change)
            // so an extra check is also added comparing the current state to the saved state
            if (hasChanges() && CTabSettings.getShowUnsavedWarning()) {
                // You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?
                return "";
            }
            // service.saveGrid(); // Disabled to enable dev edit | possibly reenable with an autosave option in settings
        };

        // Start clocks
        startTime();
        document.querySelectorAll(".ctab-item-note").forEach(note => {
            note.addEventListener('change', noteChanged);
            note.addEventListener('keyup', noteChanged);
        });
        // Set dirty to false, since note widgets might have set the state to dirty
        dirty = false;

    };

    // Retrieve the current config from the browser's localstorage
    const getConfig = (): CTabWidgetSerialized[] => {
        let lsConfig = window.localStorage.getItem("CTabConfig") || "{}";
        let config: CTabWidgetSerialized[] = [];
        try {
            config = JSON.parse(lsConfig);
        } catch (error) {
            console.error(`Config could not be parsed, found configuration:`, lsConfig);
            console.error(error);
        }
        return config;
    };

    // Write param to localStorage
    const setConfig = (config: CTabWidgetSerialized[]) => {
        window.localStorage.setItem("CTabConfig", JSON.stringify(config));
    };

    //
    // Returns message if save call is executed or not
    const saveGrid: () => string = () => {
        if (hasChanges()) {
            service.setConfig(getDashboardConfig());
            dirty = false;
            return "Configuration saved!";
        } else {
            return "Nothing to save.";
        }
    };

    const debug = (sampleConfig: boolean, addSampleWidgets: boolean) => {
        console.log("debug:");
        if (sampleConfig) {
            console.log("using sample config");
            let sampleConfiguration = [
                {
                    "settings": {"width": 1, "height": 1},
                    "backgroundColor": "rgba(0,0,0,1)",
                    "textColor": "rgba(209,20,20,1)",
                    "id": 'i0',
                    "type": "ClockWidget"
                }];
            service.setConfig(sampleConfiguration);
        }
        if (addSampleWidgets) {
            addWidgetToGrid(new CTabWidgetTypes.LinkWidget(new Date().getTime().toString(), {
                width: 1,
                height: 1,
                title: "hallo!", url: "https://github.com",
                newTab: CTabSettings.getNewTab()
            }, "rgba(255,255,255,0.5)", "rgba(0,0,0,1)"));
        }
    };

    // Create a new widget object and add it to the dashboard.
    const simpleAdd = function (type: string, settings: baseSettings, backgroundColor: string, textColor: string) {
        dirty = true;
        try {
            addWidgetToGrid(
                new (widgetTypes as any)[type]("i" + new Date().getTime().toString(), settings, backgroundColor, textColor));
        } catch (e) {
            if (type) {
                console.log(`Widget type ${type} does not exist.`);
            }
            console.log(`Existing types are:`, widgetNameList);
            console.log(cTabTypeMap);
            console.log(widgetTypes);
            console.error(e);
        }
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

    // Toggle the colorpickers
    const toggleWidgetColorPicker = (isOpen: boolean): void => {
        widgetColorPickerOpen = isOpen;
    };

    // Listener for note widgets on change
    // Used to track whether changes are made that need to be saved.
    const noteChanged: () => void = () => {
        dirty = true;
    };

    // Check if the current state of the dashboard is different from the saved state
    const hasChanges: () => boolean = () => {
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

    const removeWidget: (id: string) => void = function (id: string) {
        // Get the outer muuri cell
        let innerId = document.getElementById(id);
        let cell = innerId!.parentElement!.parentElement;

        if (cell) {
            // remove from the grid (ui only)
            grid.remove([cell], {removeElements: true, layout: true});
            // also remove from widgets, otherwise no changes will be detected on saving.
            widgets = widgets.filter((widget: CTabWidget) => widget.id !== id);
            dirty = true;
        }
    };

    // Function that handles the addition of a widget to the actual grid.
    // Adding any necessary event listeners,
    // setting the body of the widget,
    // adding the control buttons to widgets,
    // and adapting the font size of the text using bigText
    const addWidgetToGrid = function (widget: CTabWidget) {
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

        if (widget instanceof widgetTypes.WeatherWidget) {
            widget.settings.width = widget.settings.width > 1 ? widget.settings.width : 2;
            widget.settings.height = widget.settings.height > 1 ? widget.settings.height : 2;
            widget.settings.city = widget.settings.city || "delft";
            setTimeout(() => {
                weatherEl.addWeatherListener(widget, widget.id);
                (document.getElementById(widget.id + '-cityInput') as HTMLInputElement).value = widget.settings.city;
                weatherEl.getWeather(widget.id, widget.settings.city);
            }, 100);
        }

        try {
            BigText('#' + widget.id + " > span", {
                maximumFontSize: 45,
                limitingDimension: "both",
                verticalAlign: "center"
            })
        } catch (e) {
            console.log(widget.id, widget.getType);
        }

        widgets.push(widget);
    };


    // Getter for the current config
    const getDashboardConfig = function () {
        return widgets.map(widget => widget.getConfig());
    };

    // Load in the model and add every individual widget to the grid.
    // Called by initialize;
    const loadModel = function () {
        let widgetData: CTabWidgetSerialized[] = service.getConfig();
        widgets = [];
        widgetData = Array.isArray(widgetData) ? widgetData : [];

        widgetData.filter((a: any) => a !== null).forEach((widget: CTabWidgetSerialized) => {
            // what if widget does not have a type
            try {
                if (widget.type === "LinkWidget") {
                    (widget.settings as linkSettings).newTab = CTabSettings.getNewTab();
                }
                addWidgetToGrid(new (widgetTypes as any)[widget.type](widget.id, widget.settings, widget.backgroundColor, widget.textColor));
            } catch (e) {
                if (widget) {
                    console.log(`Widget type ${widget.type} does not exist.`);
                }
                console.log(`Existing types are:`, widgetNameList);
                console.log(widgetTypes);
                console.error(e);

            }
        });

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
