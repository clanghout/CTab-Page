var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cTabWidgetTypeBase_1 = require("./cTabWidgetTypeBase");
var WeatherWidget = (function (_super) {
    __extends(WeatherWidget, _super);
    function WeatherWidget(id, settings, backgroundColor, textColor) {
        var _this = this;
        _super.call(this, id, settings, backgroundColor, textColor);
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.getTemplateCore = function () {
            return "<div id=\"" + _this.id + "\" class=\"ctab-widget-body\">\n                                        <input type=\"text\" id=\"" + _this.id + "-cityInput\" style=\"width: 60%;float:left;\">\n                                        <button id=\"" + _this.id + "-cityInputButton\" data-id=\"" + _this.id + "\" style=\"font-size: 11px; width: 30%;float:left background-color: #eee; border-radius: 3px; border: 1px solid #ccc;\">Change<br> city</button>\n                                    <br>\n                                        <span id=\"" + _this.id + "-output\" style=\"width: 100%; white-space: nowrap;\">Loading weather</span>\n                                    </div>";
        };
    }
    return WeatherWidget;
})(cTabWidgetTypeBase_1.CTabWidget);
exports.WeatherWidget = WeatherWidget;
var LinkWidget = (function (_super) {
    __extends(LinkWidget, _super);
    function LinkWidget(id, settings, backgroundColor, textColor) {
        var _this = this;
        _super.call(this, id, settings, backgroundColor, textColor);
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.getTag = function () { return ("<span style=\"line-height: 100%;\">" + _this.settings.title + "</span>\n<a href=\"" + _this.settings.url + "\" " + (_this.settings.newTab ? 'target="_blank"' : "") + " id=\"" + _this.settings.title + "\">\n    <span class=\"ctab-widget-link\"></span>\n</a>"); };
        this.getTemplateCore = function () {
            return "<div id=\"" + _this.id + "\" class=\"ctab-widget-body\"> \n                                        " + _this.getTag() + " \n                                    </div>";
        };
        this.getConfig = function () {
            return {
                settings: _this.settings,
                backgroundColor: _this.backgroundColor,
                textColor: _this.textColor,
                id: _this.id,
                type: _this.constructor.name.replace("cTabWidgetType_", "")
            };
        };
    }
    return LinkWidget;
})(cTabWidgetTypeBase_1.TitleWidget);
exports.LinkWidget = LinkWidget;
var ClockWidget = (function (_super) {
    __extends(ClockWidget, _super);
    function ClockWidget(id, settings, backgroundColor, textColor) {
        var _this = this;
        _super.call(this, id, settings, backgroundColor, textColor);
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.getTemplateCore = function () {
            return "<div id=\"" + _this.id + "\" class=\"ctab-widget-body ctab-item-clock\"><span></span></div>";
        };
    }
    return ClockWidget;
})(cTabWidgetTypeBase_1.CTabWidget);
exports.ClockWidget = ClockWidget;
var BuienradarWidget = (function (_super) {
    __extends(BuienradarWidget, _super);
    function BuienradarWidget(id, settings, backgroundColor, textColor) {
        var _this = this;
        _super.call(this, id, settings, backgroundColor, textColor);
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.getTemplateCore = function () {
            return "<div id=\"" + _this.id + "\" class=\"ctab-widget-body\">\n                                        <IFRAME SRC=\"https://api.buienradar.nl/image/1.0/RadarMapNL?w=256&h=256\" NORESIZE SCROLLING=NO HSPACE=0 VSPACE=0 FRAMEBORDER=0 MARGINHEIGHT=0 MARGINWIDTH=0 WIDTH=256 HEIGHT=256></IFRAME>\n                                    </div>";
        };
    }
    return BuienradarWidget;
})(cTabWidgetTypeBase_1.CTabWidget);
exports.BuienradarWidget = BuienradarWidget;
var NoteWidget = (function (_super) {
    __extends(NoteWidget, _super);
    function NoteWidget(id, settings, backgroundColor, textColor) {
        var _this = this;
        _super.call(this, id, settings, backgroundColor, textColor);
        this.id = id;
        this.settings = settings;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.getTemplateCore = function () {
            return "<div id=\"" + _this.id + "\" class=\"ctab-widget-body ctab-item-note\">\n                                        <textarea id=\"note-" + _this.id + "\">" + _this.settings.title + "</textarea>\n                                    </div>";
        };
    }
    return NoteWidget;
})(cTabWidgetTypeBase_1.TitleWidget);
exports.NoteWidget = NoteWidget;
