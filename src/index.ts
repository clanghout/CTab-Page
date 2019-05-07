import grid from './gridControls';
import {baseSettings, linkSettings, titleSettings} from "./cTabWidgetTypeBase";
import {widgetNameList} from "./cTabWidgetTypeHelper";


(<any>window).browser = (() => {
    return (<any>window).browser || (<any>window).chrome || (<any>window).msBrowser;
})();


// The toast box that can be used to show a message to the user.
const toastBox: HTMLElement | null = document.querySelector("#toast");
const today = new Date();
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dateField: HTMLElement = document.querySelector('#currDate') as HTMLElement;
dateField.innerText = `${weekdays[today.getDay()]} ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

function showToast(message: string): void {
    if (toastBox !== null) {
        toastBox.innerText = message;
        toastBox.classList.remove('hidden');
        setTimeout(() => {
            toastBox.classList.add("hidden");
        }, 2000);
    }
}


let CTabGrid = grid();
CTabGrid.initialize();

// Save the grid and show the result to user using toastBox.
function saveGrid(): void {
    const saveResult = CTabGrid.saveGrid();
    showToast(saveResult);
}


const saveButton: HTMLButtonElement = document.querySelector("#saveButton") as HTMLButtonElement;
saveButton.addEventListener('click', saveGrid);


/// Adding Widgets
const widgetTypeChanger: HTMLSelectElement = document.querySelector("#typeDropdown") as HTMLSelectElement;
widgetNameList.forEach((widget) => {
    let option: HTMLOptionElement = document.createElement('option');
    option.innerText = widget.replace("Widget", "");
    option.value = widget;
    widgetTypeChanger.add(option);
});

// Show or hide the title and url input fields in the simple add area.
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

widgetTypeFieldVisibilityControl(false, false);


if (widgetTypeChanger !== null) {
    widgetTypeChanger.addEventListener('change', () => {
        const curVal = widgetTypeChanger.value;

        if (curVal === "LinkWidget") {
            widgetTypeFieldVisibilityControl(true, true);
        } else {
            widgetTypeFieldVisibilityControl(false, false);
        }
    });
}

// New Add button
const modalBackdrop: HTMLDivElement | null = document.querySelector('#modal-backdrop');
const addMenu: HTMLElement | null = document.querySelector('#addMenu');
const floatingAddButton: HTMLButtonElement | null = document.querySelector('#floatingAddButton');
const addCancelButton: HTMLButtonElement | null = document.querySelector('#addCancelButton');
const widgetAddButton: HTMLButtonElement | null = document.querySelector('#widgetAddButton');

// Add the configured widget to the dashboard
function addWidget(): void {
    let title: HTMLInputElement | null = document.querySelector("#addTitle");
    let url: HTMLInputElement | null = document.querySelector("#addUrl");
    let bgcolor: HTMLInputElement | null = document.querySelector('#addBGC');
    let textcolor: HTMLInputElement | null = document.querySelector('#addTC');

    let settings: baseSettings = {width: 1, height: 1};
    let errorList: string[] = [];
    switch (widgetTypeChanger.value) {
        case "BuienradarWidget":
            settings.width = 2;
            settings.height = 4;
            break;
        case "WeatherWidget":
            settings.width = 2;
            settings.height = 2;
            break;
        case "LinkWidget":
            if (title && title.value !== "") {
                if (url && url.value !== "") {
                    (settings as linkSettings).title = title.value;
                    (settings as linkSettings).url = url.value;
                } else {
                    // link widgets without link were originally used as notes, but since note widgets exist, this is no longer necessary.
                    errorList.push("url is missing");
                }
            } else {
                errorList.push("title is missing");
            }
            break;
        case "NoteWidget":
            settings.width = 2;
            settings.height = 2;
            (settings as titleSettings).title = "";
            break;
        case "ClockWidget":
            break;
        default:
            errorList.push("Type missing");
            break;
    }
    if (errorList.length > 0) {

        showToast(`Unable to add widget:${errorList.reduce((acc, curr) => " " + acc + curr, "")}.`);
    } else {

        CTabGrid.simpleAdd(widgetTypeChanger.value, settings, bgcolor!.value, textcolor!.value);
        title!.value = "";
        url!.value = "";

        // Trigger hiding of the add window
        addCancelButton!.click();
    }
}

addMenu!.classList.add('hidden');
widgetAddButton!.addEventListener('click', addWidget);
const closeAdd = () => {
    floatingAddButton!.classList.remove('hidden');
    addMenu!.classList.add('hidden');
    modalBackdrop!.classList.add('hidden');
};
floatingAddButton!.addEventListener('click', () => {
    floatingAddButton!.classList.add('hidden');
    addMenu!.classList.remove('hidden');
    modalBackdrop!.classList.remove('hidden');
    modalBackdrop!.addEventListener('click', closeAdd);
});
addCancelButton!.addEventListener('click', () => {
    closeAdd();
    modalBackdrop!.removeEventListener("click", closeAdd);
});


// Accept the 'Enter' key as alternative to clicking on the 'Add' button with the mouse, when interacting with the 'addMenu'.
// Doesn't work for the background/text backgroundColor selectors as the browser seems to override the 'Enter' key for it (i.e. opens the backgroundColor palette).
['#typeDropdown', '#addTitle', '#addUrl', '#widgetAddButton'].forEach((item) => {
    const itemElem: HTMLElement | null = document.querySelector(item);
    itemElem!.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            addWidget();
        }
    });

});


/// Dev mode
const devConfigBox: HTMLDivElement | null = document.querySelector("#devConfig");
const clearButton: HTMLButtonElement | null = document.querySelector("#clearButton");
const debugButton: HTMLButtonElement | null = document.querySelector("#debugButton");
const backupButton: HTMLButtonElement | null = document.querySelector("#backupButton");
const devEnabledCheckbox: HTMLInputElement | null = document.querySelector("#devEnabled");
const devOpacityButton: HTMLButtonElement | null = document.querySelector("#opacityButton");
const configField: HTMLInputElement | null = document.querySelector("#configFieldInput");
const devSaveButton: HTMLButtonElement | null = document.querySelector("#saveDevConfig");
const loadBackupButton: HTMLInputElement | null = document.querySelector('#loadBackupButton');

// Show or hide developer mode specific buttons
function devSwitch(displayStyle: string): void {
    if (devConfigBox && clearButton && debugButton) {
        devConfigBox.style.display = displayStyle;
        devConfigBox.classList.remove("hidden");
        clearButton.style.display = displayStyle;
        debugButton.style.display = displayStyle;
    }
    // document.querySelector("#widescreenButton").style.display = displayStyle;
}

loadBackupButton!.addEventListener('change', () => {
    if (loadBackupButton!.files!.length > 0) {
        let file = loadBackupButton!.files![0];
        let fr = new FileReader();
        fr.onload = () => {
            configField!.innerText = fr.result as string;
        };
        fr.readAsText(file);
        // fr.readAsDataURL(file);

    }
})

// disable dev mode by default
devSwitch('none');
clearButton!.addEventListener('click', () => CTabGrid.debug(true, false));
debugButton!.addEventListener('click', () => CTabGrid.debug(false, true));
backupButton!.addEventListener('click', saveCurrentConfig);
devEnabledCheckbox!.addEventListener('change', (a) => {
    if (a !== null && a.srcElement !== null)
        if ((a.srcElement as HTMLInputElement).checked) {
            devSwitch('block');
        } else {
            devSwitch('none');
        }
});

devSaveButton!.addEventListener('click', () => {
    let config = JSON.parse(configField!.value);
    CTabGrid.setConfig(config);
});
devOpacityButton!.addEventListener('click', () => {
    let config = configField!.value;
    configField!.value = config.replace(/(backgroundColor":"rgba\([0-9]+,[0-9]+,[0-9]+,)([0-9.]+)((?=\)"))/gm, "$1 0.5$3");

});

configField!.value = prettyPrintConfig(CTabGrid.getConfig());

const streamSaver = (window as any).steamSaver;

function saveCurrentConfig() {
    const fileStream = streamSaver.createWriteStream('config.json');
    const writer = fileStream.getWriter();
    const encoder = new TextEncoder;
    let data = JSON.stringify(CTabGrid.getConfig());
    let uint8array = encoder.encode(data + "\n\n");

    writer.write(uint8array);
    writer.close();
}

function prettyPrintConfig(config: any): string {
    if (config) {
        let result = "[";
        for (let i = 0; i < config.length; i++) {
            result += i === 0 ? "\n\t" : ",\n\t";
            result += JSON.stringify(config[i]);
        }
        return result + "\n]";
    }
    return "";
}


/// Chrome extension specific
try {
    (window as any).browser.commands.onCommand.addListener(saveGrid);

    (window as any).browser.bookmarks.onCreated.addListener(function (id: any, bookmark: any) {
        console.log("id", id);
        console.log("bookmark", bookmark);
        CTabGrid.simpleAdd("LinkWidget", {
            width: 1,
            height: 1,
            title: (bookmark.title as string),
            url: (bookmark.url as string)
        } as linkSettings, "#fff", "#000");

    });
} catch (e) {
    // not on chrome
    console.log("Did not execute chrome extension specific code");
}
