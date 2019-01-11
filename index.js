'use strict';
//EMERENCY CLEAR: uncomment the next line to forcefully overwrite the localstorage with an empty configuration.
// window.localStorage.setItem("CTabConfig", "[]");

import {grid} from './gridcontrols.js';

window.chrome = (() => {
    return window.browser || window.chrome || window.msBrowser;
})();

let CTabGrid = grid();
CTabGrid.initialize();

let CtabGridElement = $('.grid-stack');

// The toast box that can be used to show a message to the user.
const toastBox = document.querySelector("#toast");
function showToast(message) {
    toastBox.innerText = message;
    toastBox.classList.remove('hidden');
    setTimeout(() => {
        toastBox.classList.add("hidden");
    }, 2000);
}

// Save the grid and show the result to user using toastBox.
function saveGrid() {
    showToast(CTabGrid.saveGrid());
}

document.querySelector("#saveButton").addEventListener('click', saveGrid);

CtabGridElement.on('dragstart', function (event, ui) {
    document.querySelectorAll(".trash")[0].classList.add("active");
});

CtabGridElement.on('dragstop', function (event, ui) {
    document.querySelectorAll(".trash")[0].classList.remove("active");
});


/// Adding Widgets
const typeChanger = document.querySelector("#typeDropdown");

// Show or hide the title and url input fields in the simple add area.

function typeChangerClassChanger(showTitle, showUrl) {
    const hiddenClassName = "hidden";
    let title = document.querySelector("#simpleAddTitle").classList;
    let titleLabel = document.querySelector("#titleLabel").classList;
    let url = document.querySelector("#simpleAddUrl").classList;
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

typeChanger.addEventListener('change', () => {
    const curVal = typeChanger.value;

    if (curVal === "link") {
        typeChangerClassChanger(true, true);
    }
    if (curVal === "clock") {
        typeChangerClassChanger(false, false);
    }
    if (curVal === "note") {
        typeChangerClassChanger(true, false);
    }
});


// Add the configured widget to the dashboard
function simpleAddWidget() {
    let title = document.querySelector("#simpleAddTitle");
    let url = document.querySelector("#simpleAddUrl");
    let bgcolor = document.querySelector('#simpleAddBGC');
    let textcolor = document.querySelector('#simpleAddTC');
    if (title.value !== "" || typeChanger.value === "clock") {
        CTabGrid.simpleAdd(title.value, url.value, bgcolor.value, textcolor.value, typeChanger.value);
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
const addButton = document.querySelector('#addButton');
const addCancelButton = document.querySelector('#simpleAddCancelButton');
addMenu.classList.add('hidden');

document.querySelector('#simpleAddButton').addEventListener('click', simpleAddWidget);
addButton.addEventListener('click', () => {
    addButton.classList.add('hidden');
    addMenu.classList.remove('hidden');
});
addCancelButton.addEventListener('click', () => {
    addButton.classList.remove('hidden');
    addMenu.classList.add('hidden');
});

// Accept the 'Enter' key as alternative to clicking on the 'Add' button with the mouse, when interacting with the 'addMenu'.
// Doesn't work for the background/text color selectors as the browser seems to override the 'Enter' key for it (i.e. opens the color palette).
['#typeDropdown', '#simpleAddTitle', '#simpleAddUrl', '#simpleAddButton'].forEach((item) => {
    document.querySelector(item).addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            simpleAddWidget();
        }
    });
});

/// Dev mode

// Show or hide developer mode specific buttons
function devSwitch(displayStyle) {
    document.querySelector(".devConfig").style.display = displayStyle;
    document.querySelector("#clearButton").style.display = displayStyle;
    document.querySelector("#debugButton").style.display = displayStyle;
    document.querySelector("#widescreenButton").style.display = displayStyle;
}

// disable dev mode by default
devSwitch('none');
document.querySelector("#clearButton").addEventListener('click', () => CTabGrid.debug(true, false));
document.querySelector("#debugButton").addEventListener('click', () => CTabGrid.debug(false, true));
document.querySelector("#backupButton").addEventListener('click', saveCurConfig);
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
    console.log("I want to save this", config);
    CTabGrid.setConfig(config);
});
document.querySelector("#configFieldInput").value = prettyPrintConfig(CTabGrid.getConfig());

function saveCurConfig() {
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

