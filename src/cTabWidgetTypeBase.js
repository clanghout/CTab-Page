var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _this = this;
var Helper = require('./cTabWidgetTypeHelper');
abstract;
var CTabWidget = (function () {
    function CTabWidget() {
        this.abstract = getTemplateCore;
    }
    return CTabWidget;
})();
(function () { return string; });
constructor(public, id, string, public, settings, baseSettings, public, backgroundColor, string, public, textColor, string);
{
}
widgetTemplate: (function () { return string = function () {
    var template = "<div class=\"item he" + _this.settings.height + " w" + _this.settings.width + "\">\n                        <div class=\"item-content\" " + _this.colorInfo() + ">\n" + _this.getHtmlControls() + "\n<div class=\"ctab-widget-drag-handle hidden\" id=\"drag-handle-" + _this.id + "\">\n<span style=\"top:0; left: 0;\">&#8598</span>\n<span style=\"top:0; right: 0;\">&#8599</span>\n<span style=\"bottom:0; right: 0;\">&#8600</span>\n<span style=\"bottom:0; left: 0;\">&#8601</span>\n</div>";
    template += _this.getTemplateCore();
    template += "</div></div>";
    return template;
}; });
getConfig = function () {
    return {
        settings: _this.settings,
        backgroundColor: _this.backgroundColor,
        textColor: _this.textColor,
        id: _this.id,
        type: Helper.lookupConstructorName(_this.constructor.name.replace("cTabWidgetType_", ""))
    };
};
colorInfo = function () {
    return "style=\"color: var(--" + _this.id + "-text-color);\n        background-color: var(--" + _this.id + "-background-color);\n        --item-background-color:" + _this.backgroundColor + ";\n        \"";
};
getHtmlControls = function () {
    return ("<div class=\"ctab-widget-controls hidden\" id=\"controls-" + _this.id + "\">\n                    <div class=\"deletebutton\">\n                        <button id=\"delete-" + _this.id + "\" style=\"padding: 0; border: 0; background: transparent;\">\u274C</button>\n                    </div>\n                    <div class=\"vanilla-color-picker widget-control-picker\" id=\"" + _this.id + "-text-color\" style=\"color:var(--" + _this.id + "-text-color); border-color: var(--" + _this.id + "-text-color); background-color: rgba(255,255,255,.8)\">tc</div>\n                    <div class=\"vanilla-color-picker widget-control-picker\" id=\"" + _this.id + "-background-color\" style=\"background-color: var(--" + _this.id + "-background-color); border-color: var(--" + _this.id + "-background-color);\">bg</div>\n                </div>");
};
getType = this.constructor.name.replace("cTabWidgetType_", "");
abstract;
var TitleWidget = (function (_super) {
    __extends(TitleWidget, _super);
    function TitleWidget(id, settings, backgroundColor, textColor) {
        var _this = this;
        _super.call(this, id, settings, backgroundColor, textColor);
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.getConfig = function () {
            _this.settings.title = (document.querySelector('#note-' + _this.id));
            as;
            HTMLTextAreaElement;
            value.replace(/\s\s/g, '\s');
            return {
                settings: _this.settings,
                backgroundColor: _this.backgroundColor,
                id: _this.id,
                textColor: _this.textColor,
                type: _this.constructor.name.replace("cTabWidgetType_", "")
            };
        };
    }
    ;
    return TitleWidget;
})(CTabWidget);
