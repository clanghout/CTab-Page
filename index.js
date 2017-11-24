var grid = grid();
var widget = new grid.widgetFactory();
console.log("widget object", widget);
grid.addWidgetToGrid(new widget(
    `<div>
<div class="grid-stack-item-content">
    <img style="width: 100%; height: 90%; margin: 0; padding-right: 5px;" src="icon.png" />
</div></div>
`,0,0,1,1,true,1,2,1,2,0));

function supportsImports() {
    return 'import' in document.createElement('link');
}

if (supportsImports()) {
    console.log("Good to go!")// Good to go!
} else {
    console.log("Use other libraries/require systems to load files")// Use other libraries/require systems to load files.
}


var configuration = {
    "widgets":[{"widgetConfig":{"width":2,"height":2},"title":"github","content":"https://www.github.com"}],

};