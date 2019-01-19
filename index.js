'use strict';
//EMERGENCY CLEAR: uncomment the next line to forcefully overwrite the localstorage with an empty configuration.
// window.localStorage.setItem("CTabConfig", "[]");

import {grid} from './gridcontrols.js';

window.chrome = (() => {
    return window.browser || window.chrome || window.msBrowser;
})();

// The toast box that can be used to show a message to the user.
const toastBox = document.querySelector("#toast");

function showToast(message) {
    toastBox.innerText = message;
    toastBox.classList.remove('hidden');
    setTimeout(() => {
        toastBox.classList.add("hidden");
    }, 2000);
}

let CTabGrid = grid();
CTabGrid.initialize();

// Save the grid and show the result to user using toastBox.
function saveGrid() {
    const saveResult = CTabGrid.saveGrid();
    showToast(saveResult);
}

document.querySelector("#saveButton").addEventListener('click', saveGrid);

const sortingDropdown = document.querySelector('#sortingDropdown');
sortingDropdown.addEventListener('change', () => {
    let sortMode = sortingDropdown.value;
    switch (sortMode) {
        case "id-desc" :
            CTabGrid.grid.sort("id:desc");
            break;
        case "alpha-asc" :
            CTabGrid.grid.sort("title");
            break;
        case "alpha-desc" :
            CTabGrid.grid.sort("title:desc");
            break;
        case "id-asc" :
        default:
            CTabGrid.grid.sort("id");
            break;
    }
});


/// Adding Widgets
const widgetTypeChanger = document.querySelector("#typeDropdown");

// Show or hide the title and url input fields in the simple add area.
function widgetTypeFieldVisibilityControl(showTitle, showUrl) {
    const hiddenClassName = "hidden";
    let title = document.querySelector("#addTitle").classList;
    let titleLabel = document.querySelector("#titleLabel").classList;
    let url = document.querySelector("#addUrl").classList;
    let urlLabel = document.querySelector("#urlLabel").classList;
    if (showTitle) {
        title.remove(hiddenClassName);
        titleLabel.remove(hiddenClassName);
    } else {
        title.add(hiddenClassName);
        titleLabel.add(hiddenClassName);
    }
    if (showUrl) {
        url.remove(hiddenClassName);
        urlLabel.remove(hiddenClassName);
    } else {
        url.add(hiddenClassName);
        urlLabel.add(hiddenClassName);
    }
}

widgetTypeChanger.addEventListener('change', () => {
    const curVal = widgetTypeChanger.value;

    if (curVal === "link") {
        widgetTypeFieldVisibilityControl(true, true);
    }
    if (curVal === "buienradar") {
        widgetTypeFieldVisibilityControl(false, false);
    }
    if (curVal === "clock") {
        widgetTypeFieldVisibilityControl(false, false);
    }
    if (curVal === "note") {
        widgetTypeFieldVisibilityControl(true, false);
    }
});


// Add the configured widget to the dashboard
function addWidget() {
    let title = document.querySelector("#addTitle");
    let url = document.querySelector("#addUrl");
    let bgcolor = document.querySelector('#addBGC');
    let textcolor = document.querySelector('#addTC');
    if (title.value !== "" || widgetTypeChanger.value === "clock") {
        CTabGrid.simpleAdd(title.value, url.value, bgcolor.value, textcolor.value, widgetTypeChanger.value);
        title.value = "";
        url.value = "";

        // Trigger hiding of the add window
        addCancelButton.click();
    } else {
        showToast("Unable to add widget: A title is required.");
    }
}

// New Add button
const addMenu = document.querySelector('#addMenu');
const floatingAddButton = document.querySelector('#floatingAddButton');
const addCancelButton = document.querySelector('#addCancelButton');
addMenu.classList.add('hidden');

document.querySelector('#widgetAddButton').addEventListener('click', addWidget);
floatingAddButton.addEventListener('click', () => {
    floatingAddButton.classList.add('hidden');
    addMenu.classList.remove('hidden');
});
addCancelButton.addEventListener('click', () => {
    floatingAddButton.classList.remove('hidden');
    addMenu.classList.add('hidden');
});

// Accept the 'Enter' key as alternative to clicking on the 'Add' button with the mouse, when interacting with the 'addMenu'.
// Doesn't work for the background/text color selectors as the browser seems to override the 'Enter' key for it (i.e. opens the color palette).
['#typeDropdown', '#addTitle', '#addUrl', '#widgetAddButton'].forEach((item) => {
    document.querySelector(item).addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            addWidget();
        }
    });
});

/// Dev mode

// Show or hide developer mode specific buttons
function devSwitch(displayStyle) {

    document.querySelector(".devConfig").style.display = displayStyle;
    document.querySelector(".devConfig").classList.remove("hidden");
    document.querySelector("#clearButton").style.display = displayStyle;
    document.querySelector("#debugButton").style.display = displayStyle;
    document.querySelector("#widescreenButton").style.display = displayStyle;
}

// disable dev mode by default
devSwitch('none');
document.querySelector("#clearButton").addEventListener('click', () => CTabGrid.debug(true, false));
document.querySelector("#debugButton").addEventListener('click', () => CTabGrid.debug(false, true));
document.querySelector("#backupButton").addEventListener('click', saveCurrentConfig);
document.querySelector("#devEnabled").addEventListener('change', (a) => {
    if (a.srcElement.checked) {
        devSwitch('block');
    } else {
        devSwitch('none');
    }
});
document.querySelector("#saveDevConfig").addEventListener('click', () => {
    let config = document.querySelector("#configFieldInput").value;
    config = JSON.parse(config);
    CTabGrid.setConfig(config);
});
document.querySelector("#configFieldInput").value = prettyPrintConfig(CTabGrid.getConfig());

function saveCurrentConfig() {
    console.log(JSON.stringify(CTabGrid.getConfig()));
}

function prettyPrintConfig(config) {
    if (config) {
        let result = "[";
        for (let i = 0; i < config.length; i++) {
            result += i === 0 ? "\n\t" : ",\n\t";
            result += JSON.stringify(config[i]);
        }
        return result + "\n]";
    }
}


/// Chrome extension specific
try {
    chrome.commands.onCommand.addListener(saveGrid);

    chrome.bookmarks.onCreated.addListener(function (id, bookmark) {
        console.log("id", id);
        console.log("bookmark", bookmark);
        CTabGrid.simpleAdd(bookmark.title, bookmark.url, "#fff", "#000", "url");

    });

    chrome.history.search({text: '', maxResults: 10}, function (data) {
        data.forEach(function (page) {
            //TODO add from history?
            // console.log(page.url);
        });
    });
} catch (e) {
    // not on chrome
    console.log("Did not execute chrome extension specific code");
}

