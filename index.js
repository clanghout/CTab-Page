'use strict';
//EMERENCY CLEAR:window.localStorage.setItem("CTabConfig", "[]");
//
//window.localStorage.setItem("CTabConfig", '[{"title":"Facebook","settings":{"x":0,"y":0,"width":1,"height":1,"autoposition":false,"minWidth":"1","maxWidth":"2","minHeight":"1","maxHeight":"2","id":0,"autoPosition":false},"contentUrl":"https://www.facebook.com"},{"title":"GitHub","settings":{"x":1,"y":0,"width":1,"height":1,"autoposition":false,"minWidth":"1","maxWidth":"2","minHeight":"1","maxHeight":"2","id":0,"autoPosition":false},"contentUrl":"https://www.github.com"},{"title":"Youtube","settings":{"x":2,"y":0,"width":1,"height":1,"autoposition":false,"minWidth":"1","maxWidth":"2","minHeight":"1","maxHeight":"2","id":0,"autoPosition":false},"contentUrl":"https://www.youtube.com"},{"title":"Advent","settings":{"x":3,"y":0,"width":1,"height":1,"autoposition":false,"minWidth":"1","maxWidth":"2","minHeight":"1","maxHeight":"2","id":0,"autoPosition":false},"contentUrl":"http://adventofcode.com/"},{"title":"jsprototypecheckdit","settings":{"x":4,"y":0,"autoposition":false,"autoPosition":false,"width":3,"height":1},"contentUrl":"https://www.youtube.com/watch?v=MLsg-jv2D08&feature=youtu.be"},{"title":"BrightSpace","settings":{"x":7,"y":0,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"https://brightspace.tudelft.nl/d2l/home/6647"},{"title":"Twitter","settings":{"x":0,"y":2,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"https://twitter.com/"},{"title":"Inbox","settings":{"x":1,"y":1,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"https://inbox.google.com/?pli=1"},{"title":"Calendar","settings":{"x":8,"y":0,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"https://calendar.google.com/calendar/r?hl=nl#h"},{"title":"RemoteDesktop","settings":{"x":2,"y":1,"autoposition":false,"autoPosition":false,"width":2,"height":1},"contentUrl":"https://remotedesktop.google.com/access"},{"title":"Reisplanner","settings":{"x":6,"y":5,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"https://www.ns.nl/en/journeyplanner/"},{"title":"NSWiFi","settings":{"x":9,"y":0,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"http://www.nstrein.ns.nl"},{"title":"Steam","settings":{"x":10,"y":0,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"http://store.steampowered.com/"},{"title":"Twitch","settings":{"x":0,"y":1,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"https://www.twitch.tv/"},{"title":"Tutor","settings":{"x":11,"y":0,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"http://www.tutor.tudelft.nl/"}]');
import {grid} from './gridcontrols.js';

window.chrome = (() => {
    return window.browser || window.chrome || window.msBrowser;
})();

let CTabGrid = grid();
CTabGrid.initialize();

let CtabGridElement = $('.grid-stack');

const typeChangerClassChanger = (showTitle, showUrl) => {
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
};

const typeChanger = document.querySelector("#typeDropdown");
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

function devSwitch(displayStyle) {
    document.querySelector(".devConfig").style.display = displayStyle;
    document.querySelector("#clearButton").style.display = displayStyle;
    document.querySelector("#debugButton").style.display = displayStyle;
    document.querySelector("#widescreenButton").style.display = displayStyle;
}

// disable dev mode by default
devSwitch('none');

const toastBox = document.querySelector("#toast");

function showToast(message) {
    toastBox.innerText = message;
    toastBox.classList.remove('hidden');
    setTimeout(() => {
        toastBox.classList.add("hidden");
    }, 2000);
}

function saveGrid() {
    showToast(CTabGrid.saveGrid());
}

document.querySelector("#saveButton").addEventListener('click', saveGrid);
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

CtabGridElement.on('dragstart', function (event, ui) {
    document.querySelectorAll(".trash")[0].classList.add("active");
});

CtabGridElement.on('dragstop', function (event, ui) {
    document.querySelectorAll(".trash")[0].classList.remove("active");
});


// New Add button
let addMenu = document.querySelector('#addMenu');
let addButton = document.querySelector('#addButton');
let addCancelButton = document.querySelector('#simpleAddCancelButton');
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

function simpleAddWidget() {
    let title = document.querySelector("#simpleAddTitle");
    let url = document.querySelector("#simpleAddUrl");
    let bgcolor = document.querySelector('.simpleAddBGC');
    let textcolor = document.querySelector('.simpleAddTC');
    console.log(typeChanger.value);
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

// Chrome extension specific
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

