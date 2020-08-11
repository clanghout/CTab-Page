import { BaseSettings, CTabWidgetSerialized, LinkSettings, TitleSettings } from "./widgets/widgetElement";
import * as widgetTypes from "./widgets/widgets";
import settingsMenu from "./controls/settingsMenu";

// @ts-ignore streamsaver is no module, but adds to global scope
import streamsaver from "streamsaver";
import gridControls from "./grid/gridControls";

let windowWrapper = window as any;
windowWrapper.browser = (() => {
    return windowWrapper.browser || windowWrapper.chrome || windowWrapper.msBrowser;
})();


// The toast box that can be used to show a message to the user.
const toastBox: HTMLElement | null = document.querySelector("#toast");
const today = new Date();
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dateField: HTMLElement = document.querySelector("#currDate") as HTMLElement;
dateField.innerText = `${weekdays[today.getDay()]} ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

function showToast(message: string): void {
    if (toastBox !== null) {
        toastBox.innerText = message;
        toastBox.classList.remove("hidden");
        setTimeout(() => {
            toastBox.classList.add("hidden");
        }, 2000);
    }
}


let cTabGrid = new gridControls();

// Save the grid and show the result to user using toastBox.
function saveGrid(): void {
    const saveResult = cTabGrid.saveGrid();
    cTabGrid.filterMenu.updateAvailableTagList();
    showToast(saveResult);
}


const saveButton: HTMLButtonElement = document.querySelector("#saveButton") as HTMLButtonElement;
saveButton.addEventListener("click", saveGrid);

//default sort
cTabGrid.grid.sort("orderIndex");

const sortingDropdown: HTMLSelectElement | null = document.querySelector("#sortingDropdown");
sortingDropdown!.addEventListener("change", () => {
    let sortMode = sortingDropdown!.value;
    switch (sortMode) {
        case "id-desc" : {
            cTabGrid.grid.sort("id:desc");
            break;
        }
        case "alpha-asc" : {
            cTabGrid.grid.sort("title");
            break;
        }
        case "alpha-desc" : {
            cTabGrid.grid.sort("title:desc");
            break;
        }
        case "tag-alpha": {
            cTabGrid.grid.sort("tagAlpha");
            break;
        }
        case "id-asc": {
            cTabGrid.grid.sort("id");
            break;
        }
        case "user-order":
        default: {
            cTabGrid.grid.sort("orderIndex");
            break;
        }
    }
});


/// Adding Widgets
const widgetTypeChanger: HTMLSelectElement = document.querySelector("#typeDropdown") as HTMLSelectElement;
Object.keys(widgetTypes).forEach((widget) => {
    let option: HTMLOptionElement = document.createElement("option");
    option.innerText = widget.replace("Widget", "");
    option.value = widget;
    widgetTypeChanger.add(option);
});

// Show or hide the title and url input fields in the add area.
function widgetTypeFieldVisibilityControl(showTitle: boolean, showUrl: boolean): void {
    const hiddenClassName = "hidden";
    let title = document.querySelector("#addTitle");
    let titleLabel = document.querySelector("#titleLabel");
    let url = document.querySelector("#addUrl");
    let urlLabel = document.querySelector("#urlLabel");
    if (title !== null && titleLabel !== null && url !== null && urlLabel !== null) {
        let titleClassList = title.classList;
        let titleLabelClassList = titleLabel.classList;
        let urlClassList = url.classList;
        let urlLabelClassList = urlLabel.classList;
        if (showTitle) {
            titleClassList.remove(hiddenClassName);
            titleLabelClassList.remove(hiddenClassName);
        } else {
            titleClassList.add(hiddenClassName);
            titleLabelClassList.add(hiddenClassName);
        }
        if (showUrl) {
            urlClassList.remove(hiddenClassName);
            urlLabelClassList.remove(hiddenClassName);
        } else {
            urlClassList.add(hiddenClassName);
            urlLabelClassList.add(hiddenClassName);
        }
    }
}

// set css property to show or hide experimental features
document.documentElement.style.setProperty("--experimental-features-display",
    settingsMenu.getExperimentalFeatures() ? "initial" : "none");

widgetTypeFieldVisibilityControl(false, false);


if (widgetTypeChanger !== null) {
    widgetTypeChanger.addEventListener("change", () => {
        const curVal = widgetTypeChanger.value;

        if (curVal === "LinkWidget") {
            widgetTypeFieldVisibilityControl(true, true);
        } else {
            widgetTypeFieldVisibilityControl(false, false);
        }
    });
}

// New Add button
const modalBackdrop: HTMLDivElement | null = document.querySelector("#modal-backdrop");
const addMenu: HTMLElement | null = document.querySelector("#addMenu");
const floatingAddButton: HTMLButtonElement | null = document.querySelector("#floatingAddButton");
const addCancelButton: HTMLButtonElement | null = document.querySelector("#addCancelButton");
const widgetAddButton: HTMLButtonElement | null = document.querySelector("#widgetAddButton");

// Add the configured widget to the dashboard
function addWidget(): void {
    let title: HTMLInputElement | null = document.querySelector("#addTitle");
    let url: HTMLInputElement | null = document.querySelector("#addUrl");
    let bgcolor: HTMLInputElement | null = document.querySelector("#addBGC");
    let textcolor: HTMLInputElement | null = document.querySelector("#addTC");

    let settings: BaseSettings = {width: 1, height: 1, tags: [], orderIndex: Number.MAX_SAFE_INTEGER};
    let errorList: Array<string> = [];
    switch (widgetTypeChanger.value) {
        case "BuienradarWidget": {
            settings.width = 2;
            settings.height = 4;
            break;
        }
        case "WeatherWidget": {
            settings.width = 2;
            settings.height = 2;
            break;
        }
        case "LinkWidget": {
            if(title && title.value !== "") {
                if(url && url.value !== "") {
                    (settings as LinkSettings).title = title.value;
                    (settings as LinkSettings).url = url.value;
                } else {
                    // link widgets without link were originally used as notes, but since note widgets exist, this is no longer necessary.
                    errorList.push("url is missing");
                }
            } else {
                errorList.push("title is missing");
            }
            break;
        }
        case "NoteWidget": {
            settings.width = 2;
            settings.height = 2;
            (settings as TitleSettings).title = "";
            break;
        }
        case "ClockWidget": {
            break;
        }
        default: {
            errorList.push("Type missing");
            break;
        }
    }
    if (errorList.length > 0) {

        showToast(`Unable to add widget:${errorList.reduce((acc, curr) => ` ${acc}${curr}`, "")}.`);
    } else {

        cTabGrid.createWidget(widgetTypeChanger.value, settings, bgcolor!.value, textcolor!.value);
        title!.value = "";
        url!.value = "";

        // Trigger hiding of the add window
        addCancelButton!.click();
    }
}

addMenu!.classList.add("hidden");
widgetAddButton!.addEventListener("click", addWidget);

function closeAdd() {
    floatingAddButton!.classList.remove("hidden");
    addMenu!.classList.add("hidden");
    modalBackdrop!.classList.add("hidden");
}

floatingAddButton!.addEventListener("click", () => {
    floatingAddButton!.classList.add("hidden");
    addMenu!.classList.remove("hidden");
    modalBackdrop!.classList.remove("hidden");
    modalBackdrop!.addEventListener("click", closeAdd);
});
addCancelButton!.addEventListener("click", () => {
    closeAdd();
    modalBackdrop!.removeEventListener("click", closeAdd);
});


// Accept the "Enter" key as alternative to clicking on the "Add" button with the mouse, when interacting with the "addMenu".
// Doesn't work for the background/text backgroundColor selectors as the browser seems to override the "Enter" key for it (i.e. opens the backgroundColor palette).
["#typeDropdown", "#addTitle", "#addUrl", "#widgetAddButton"].forEach((item) => {
    const itemElem: HTMLElement | null = document.querySelector(item);
    itemElem!.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            addWidget();
        }
    });

});


/// Dev mode
const devConfigBox: HTMLDivElement | null = document.querySelector("#devConfig");
const devArea: HTMLDivElement | null = document.querySelector("#dev-area");
const backupButton: HTMLButtonElement | null = document.querySelector("#backupButton");
const devEnabledCheckbox: HTMLInputElement | null = document.querySelector("#devEnabled");
const devOpacityButton: HTMLButtonElement | null = document.querySelector("#opacityButton");
const configField: HTMLInputElement | null = document.querySelector("#configFieldInput");
const devSaveButton: HTMLButtonElement | null = document.querySelector("#saveDevConfig");
const loadBackupButton: HTMLInputElement | null = document.querySelector("#loadBackupButton");

// Show or hide developer mode specific buttons
function devSwitch(displayStyle: string): void {
    devConfigBox!.style.display = displayStyle;
    devArea!.style.display = displayStyle;
    devConfigBox!.classList.remove("hidden");
    devArea!.classList.remove("hidden");
}

loadBackupButton!.addEventListener("change", () => {
    if (loadBackupButton!.files!.length > 0) {
        let file = loadBackupButton!.files![0];
        let fr = new FileReader();
        fr.onload = () => {
            configField!.value = fr.result as string;
        };
        fr.readAsText(file);
    }
});

// disable dev mode by default
devSwitch("none");

backupButton!.addEventListener("click", saveCurrentConfig);
devEnabledCheckbox!.addEventListener("change", (a) => {
    if (a !== null && a.target !== null) {
        if((a.target as HTMLInputElement).checked) {
            devSwitch("inline");
        } else {
            devSwitch("none");
        }
    }
});

devSaveButton!.addEventListener("click", () => {
    let config = JSON.parse(configField!.value);
    cTabGrid.setConfig(config);
});

devOpacityButton!.addEventListener("click", () => {
    let config = configField!.value;
    configField!.value = config.replace(/(backgroundColor":"rgba\([0-9]+,[0-9]+,[0-9]+,)([0-9.]+)((?=\)"))/gm, "$1 0.5$3");

});

configField!.value = prettyPrintConfig(cTabGrid.getConfig());

// saving config to file
function saveCurrentConfig() {
    const fileStream = streamsaver.createWriteStream(`config-${new Date().valueOf()}.json`);
    const writer = fileStream.getWriter();
    const encoder = new TextEncoder;
    let data = JSON.stringify(cTabGrid.getConfig());
    let uint8Array = encoder.encode(`${data}

`);

    writer.write(uint8Array);
    writer.close();
}

function prettyPrintConfig(config: Array<CTabWidgetSerialized>): string {
    if (config) {
        let result = "[";
        for (let i = 0; i < config.length; i++) {
            result += i === 0 ? "\n\t" : ",\n\t";
            result += JSON.stringify(config[i]);
        }
        return `${result}
]`;
    }
    return "";
}

/// Chrome extension specific
try {
    windowWrapper.browser.commands.onCommand.addEventListener(saveGrid);
    windowWrapper.browser.bookmarks.onCreated.addEventListener(function (_id: any, bookmark: any): any | null {

        // If user checks the disableAddWidgetOnBookmark setting, then we don't want to add a bookmark.
        // Hence, if it is not checked, we do want to add a bookmark.
        if (!settingsMenu.getAddWidgetOnBookmarkIsDisabled()) {
            cTabGrid.createWidget("LinkWidget", {
                width: 1,
                height: 1,
                title: (bookmark.title as string),
                url: (bookmark.url as string)
            } as LinkSettings, "#fff", "#000");
        }
    });
} catch (e) {
    // not on chrome
    console.log("Did not execute extension specific code");
}
