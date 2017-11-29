let CTabGrid = grid();

CTabGrid.initialize();

function supportsImports() {
    return 'import' in document.createElement('link');
}

document.querySelector("#saveButton").addEventListener('click',CTabGrid.saveGrid);
document.querySelector("#clearButton").addEventListener('click',window.localStorage.clear);
document.querySelector("#debugButton").addEventListener('click',() => CTabGrid.debug(false,true));

document.querySelector("#saveDevConfig").addEventListener('click',() => {
    let config = document.querySelector("#configFieldInput").value;
    CTabGrid.setConfig(config);
});

document.querySelector("#configFieldInput").value = JSON.stringify(CTabGrid.getConfig());