//EMERENCY CLEAR:window.localStorage.setItem("CTabConfig", "[]");
//
//window.localStorage.setItem("CTabConfig", '[{"title":"Facebook","settings":{"x":0,"y":0,"width":1,"height":1,"autoposition":false,"minWidth":"1","maxWidth":"2","minHeight":"1","maxHeight":"2","id":0,"autoPosition":false},"contentUrl":"https://www.facebook.com"},{"title":"GitHub","settings":{"x":1,"y":0,"width":1,"height":1,"autoposition":false,"minWidth":"1","maxWidth":"2","minHeight":"1","maxHeight":"2","id":0,"autoPosition":false},"contentUrl":"https://www.github.com"},{"title":"Youtube","settings":{"x":2,"y":0,"width":1,"height":1,"autoposition":false,"minWidth":"1","maxWidth":"2","minHeight":"1","maxHeight":"2","id":0,"autoPosition":false},"contentUrl":"https://www.youtube.com"},{"title":"Advent","settings":{"x":3,"y":0,"width":1,"height":1,"autoposition":false,"minWidth":"1","maxWidth":"2","minHeight":"1","maxHeight":"2","id":0,"autoPosition":false},"contentUrl":"http://adventofcode.com/"},{"title":"jsprototypecheckdit","settings":{"x":4,"y":0,"autoposition":false,"autoPosition":false,"width":3,"height":1},"contentUrl":"https://www.youtube.com/watch?v=MLsg-jv2D08&feature=youtu.be"},{"title":"BrightSpace","settings":{"x":7,"y":0,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"https://brightspace.tudelft.nl/d2l/home/6647"},{"title":"Twitter","settings":{"x":0,"y":2,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"https://twitter.com/"},{"title":"Inbox","settings":{"x":1,"y":1,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"https://inbox.google.com/?pli=1"},{"title":"Calendar","settings":{"x":8,"y":0,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"https://calendar.google.com/calendar/r?hl=nl#h"},{"title":"RemoteDesktop","settings":{"x":2,"y":1,"autoposition":false,"autoPosition":false,"width":2,"height":1},"contentUrl":"https://remotedesktop.google.com/access"},{"title":"Reisplanner","settings":{"x":6,"y":5,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"https://www.ns.nl/en/journeyplanner/"},{"title":"NSWiFi","settings":{"x":9,"y":0,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"http://www.nstrein.ns.nl"},{"title":"Steam","settings":{"x":10,"y":0,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"http://store.steampowered.com/"},{"title":"Twitch","settings":{"x":0,"y":1,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"https://www.twitch.tv/"},{"title":"Tutor","settings":{"x":11,"y":0,"autoposition":false,"autoPosition":false,"width":1,"height":1},"contentUrl":"http://www.tutor.tudelft.nl/"}]');
let CTabGrid = grid();

CTabGrid.initialize();

function devSwitch(displayStyle) {
    document.querySelector(".devConfig").style.display = displayStyle;
    document.querySelector("#clearButton").style.display = displayStyle;
    document.querySelector("#debugButton").style.display = displayStyle;
    document.getElementById("widescreenButton").style.display = displayStyle;
}

// disable dev mode by default
devSwitch('none');

function supportsImports() {
    return 'import' in document.createElement('link');
}

document.getElementById("saveButton").addEventListener('click', CTabGrid.saveGrid);
document.getElementById("previewButton").addEventListener('click', CTabGrid.loadLinkPreview);
document.getElementById("clearButton").addEventListener('click', () => CTabGrid.debug(true, false));
document.getElementById("debugButton").addEventListener('click', () => CTabGrid.debug(false, true));
document.getElementById("backupButton").addEventListener('click', saveCurConfig);
document.getElementById("devEnabled").addEventListener('change', (a) => {
    if (a.srcElement.checked) {
        devSwitch('block')
    }
    else {
        devSwitch('none')
    }
});


document.querySelector("#saveDevConfig").addEventListener('click', () => {
    let config = document.querySelector("#configFieldInput").value;
    config = config.replace(/\s+/g, "");
    console.log("I want to save this", config);
    CTabGrid.setConfig(config);
});

document.querySelector("#configFieldInput").value = prettyPrintConfig(CTabGrid.getConfig());
document.querySelector('#simpleAddButton').addEventListener('click', simpleAddWidget);

function saveCurConfig() {
    console.log(JSON.stringify(CTabGrid.getConfig()));
}

function simpleAddWidget() {
    let title = document.querySelector("#simpleAddTitle");
    let url = document.querySelector("#simpleAddUrl");
    if (title.value !== "") {
        CTabGrid.simpleAdd(title.value, url.value);
        title.value = "";
        url.value = "";
    }
}

function prettyPrintConfig(config) {
    let result = "[";
    for (let i = 0; i < config.length; i++) {
        result += i === 0 ? "\n\t" : ",\n\t";
        result += JSON.stringify(config[i]);
    }
    return result + "\n]";
}

// $("#google").linkpreview();