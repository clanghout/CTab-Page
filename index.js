//EMERENCY CLEAR: window.localStorage.setItem("CTabConfig", "[]");
let CTabGrid = grid();

CTabGrid.initialize();

function supportsImports() {
    return 'import' in document.createElement('link');
}

document.querySelector("#saveButton").addEventListener('click', CTabGrid.saveGrid);
document.querySelector("#clearButton").addEventListener('click', () => CTabGrid.debug(true, false));
document.querySelector("#debugButton").addEventListener('click', () => CTabGrid.debug(false, true));

document.querySelector("#saveDevConfig").addEventListener('click', () => {
    let config = document.querySelector("#configFieldInput").value;
    CTabGrid.setConfig(config);
});

document.querySelector("#configFieldInput").value = JSON.stringify(CTabGrid.getConfig());
document.querySelector('#simpleAddButton').addEventListener('click', simpleAddWidget);

function simpleAddWidget() {
    let title = document.querySelector("#simpleAddTitle");
    let url = document.querySelector("#simpleAddUrl");
    if (title.value !== "") {
        CTabGrid.simpleAdd(title.value, url.value);
        title.value = "";
        url.value = "";
    }
}