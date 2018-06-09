"use strict";

function grid() {
    let service = {};
    service.grid = $(".grid-stack");
    service.count = 0;
    service.widgets = {};
    let widgetFactory = new WidgetFactory();
    let defaultWidgetColor = "#fff";
    let dirty = false;

    const options = {
        animate: true,
        cellHeight: 60,
        verticalMargin: 5,
        float: true,
        disableOneColumnMode: true,
        width: 12,
        removable: '.trash', // Trash area has to exist: div.trash is enough => with style to display
        removeTimeout: 100
    };

    service.initialize = function () {
        service.grid.gridstack(options);
        service.gridData = service.grid.data('gridstack');
        let curConfig = service.getConfig();
        console.log("current config", curConfig);


        // Batch update to add all widgets at once
        service.gridData.batchUpdate();
        service.load();
        service.gridData.commit();

        // Save whenever you leave the screen
        window.onbeforeunload = function () {
            //service.saveGrid(); // Disabled to keep me from accidentally clearing my config
        };

        service.grid.on("change", function (event, items) {
            dirty = true;
            // When you change the title of a widget, a gridstack onChange event is retrieved with
            // items === 'undefined'.
            if (typeof items !== 'undefined') {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].id in service.widgets) {
                        service.update(items[i].id, items[i]);
                    }
                }
            }
        });

        // Start clocks
        startTime();
    };

    // Update the mutable object in the model.widgets
    // two way binding
    service.update = function (id, item) {
        let widget = service.widgets[id];
        widget.settings.x = item.x;
        widget.settings.y = item.y;
        widget.settings.width = item.width;
        widget.settings.minWidth = item.minWidth;
        widget.settings.maxWidth = item.maxWidth;
        widget.settings.height = item.height;
        widget.settings.minHeight = item.minHeight;
        widget.settings.maxHeight = item.maxHeight;
        // hardcode autoposition to false to actually load the widget on the same spot next time.
        widget.settings.autoPosition = false;
    };


    service.getSortedWidgets = function () {
        service.gridData.grid._sortNodes();
        let ids = [];
        _.map($('.grid-stack > .grid-stack-item:visible'),
            function (el) {
                el = $(el);
                ids.push(el.data('_gridstack_node')["id"]);
            });
        return ids;
    };

    service.removeWidget = function (id) {
        _.map($('.grid-stack > .grid-stack-item:visible'),
            function (el) {
                el = $(el);
                // id is saved in gridstack as a string while the parameter is an integer
                if (el.data('_gridstack_node')["id"] == id) {
                    service.gridData.removeWidget(el);
                }
            });
    };

    service.addWidgetToGrid = function (widget, id, autoPos) {
        if (typeof id === 'undefined') {
            service.count++;
            widget.id = service.count;
        } else {
            widget.id = id;
        }

        service.widgets[service.count] = widget;
        if (autoPos) {
            widget.settings.autoPosition = true;
        } else {
            widget.settings.autoposition = false;
        }
        service.gridData.addWidget(
            widget.widgetTemplate(),
            widget.settings.x,
            widget.settings.y,
            widget.settings.width,
            widget.settings.height,
            widget.settings.autoposition,
            widget.settings.minWidth,
            widget.settings.maxWidth,
            widget.settings.minHeight,
            widget.settings.maxHeight,
            widget.id);
        widget.settings.autoPosition = false;
    };

    function WidgetFactory() {
        this.createWidget = function (title, contentUrl, settings, id, color, textcolor, type) {
            let widget = function () {
            };
            widget.settings = settings;
            widget.title = title;
            widget.contentUrl = contentUrl;
            widget.color = color;
            widget.textcolor = textcolor;

            // TODO HTML and javascript need to be separated
            //  https://github.com/polymer/lit-element#minimal-example
            widget.getTag = function () {
                return title + '<a href="' + contentUrl + '" id="' + title + '"><span class="ctab-widget-link"></span></a>';
            };

            widget.getHtmlControls = function () {
                return `<div class="ctab-widget-controls"><div class="deletebutton">${this.id}</div></div>`;
            };

            widget.colorInfo = function () {
                let styleInfo = 'style="';
                styleInfo += this.textcolor !== undefined ? 'color:' + this.textcolor + ';' : "";
                styleInfo += this.color !== undefined ? '--item-color:' + this.color + ';' :
                    "--item-color:" + defaultWidgetColor + ";";
                //TODO document.style.setproperty
                return styleInfo + '"';
            };

            // The basic template for a widget

            widget.widgetTemplate = function () {
                if (typeof type === "undefined")
                    return '<div>' +
                        '<div class="grid-stack-item-content"' + this.colorInfo() + '>' +
                        this.getHtmlControls() +
                        '<div id="' +
                        id +
                        '" class="ctab-widget-body">' +
                        this.getTag() +
                        '</div>' +
                        '</div>' +
                        '</div>';
                return '<div>' +
                    '<div class="grid-stack-item-content"' + this.colorInfo() + '>' +
                    '<div id="' +
                    id +
                    '" class="ctab-widget-body txt">' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            };

            widget.getConfig = function () {
                return {
                    "title": this.title,
                    "settings": settings,
                    "contentUrl": contentUrl,
                    "color": color,
                    "textcolor": textcolor,
                    "type":type
                };
            };

            widget.toString = function () {
                return "{Title: " + title + ",\n" +
                    "settings: " + JSON.stringify(settings) +
                    ",\ncontentUrl: " + contentUrl + "\n" +
                    ",\ncolor: " + color + "\n" +
                    ",\ntextcolor: " + textcolor + "\n" +
                    "}";
            };
            return widget;
        };
    }

    service.getConfig = function () {
        let chromeresult = chrome.storage.sync.get(['CTabConfig'], function (res) {
            return res;
        });
        console.log("chromeresult", chromeresult);
        return JSON.parse(window.localStorage.getItem("CTabConfig"));
    };

    service.setConfig = function (config) {
        console.log("set storage", config);
        if (typeof config !== 'string') {
            config = JSON.stringify(config);
        }
        window.localStorage.setItem("CTabConfig", config);
        // chrome.storage.sync.set({"CTabConfig": config}); // TODO: Too much data apparently, maybe save per widget? instead of whole json at once -> title can only occur once
    };
    service.saveGrid = function () {
        if (dirty) {
            console.log("curconfig genereated: ", service.getDashboardConfig());
            service.setConfig(service.getDashboardConfig());
            dirty = false;
        }
        else {
            console.log("nothing to save");
        }
    };

    service.loadLinkPreview = function () {
        console.log(Object.keys(service.widgets));
        Object.keys(service.widgets).forEach(a =>
            $("#" + service.widgets[a].title).linkpreview({
                previewContainer: $("#" + service.widgets[a].title).before(),
                errorMessage: "unable to load"
            }));
    };

    service.getDashboardConfig = function () {
        let configuration = [];
        let ids = service.getSortedWidgets();
        for (let i = 0; i < ids.length; i++) {
            let w = service.widgets[ids[i]];
            let wc = w.getConfig();
            configuration = configuration.concat(wc);
        }
        return configuration;
    };


    // Loads the user configuration in the dashboard
    service.load = function () {
        service.loadModel();
        service.loadGrid();
    };

    service.loadModel = function () {
        let widgetData = service.getConfig();
        service.widgets = {};
        widgetData = Array.isArray(widgetData) ? widgetData : [];

        for (let i = 0; i < widgetData.length; i++) {
            let title = widgetData[i].title;
            let settings = widgetData[i].settings;
            let contentUrl = widgetData[i].contentUrl;
            let color = widgetData[i].color;
            let textcolor = widgetData[i].textcolor;
            let type = widgetData[i].type;
            let widget = widgetFactory.createWidget(title, contentUrl, settings, i, color, textcolor, type);
            widget.prototype.id = service.count;
            service.widgets[service.count] = widget;
            service.count++;
        }

    };

    service.loadGrid = function () {
        // add the widgets to the grid
        for (let key in service.widgets) {
            if (service.widgets.hasOwnProperty(key)) {
                let widget = service.widgets[key];
                service.addWidgetToGrid(widget, key, false);
            }
        }

    };


    service.debug = function (sampleConfig, addSampleWidgets) {
        console.log("debug:");
        if (sampleConfig) {
            console.log("using sample config");
            let sampleConfiguration = {
                "widgets": [{
                    "widgetConfig": {"width": 2, "height": 2},
                    "title": "github",
                    "contentUrl": 'https://www.github.com'
                }],
            };
            CTabGrid.setConfig(sampleConfiguration);
        }
        if (addSampleWidgets) {
            console.log("adding widget");
            let settings = {
                'x': 5,
                'y': 5,
                'width': 1,
                'height': 1,
                'autoposition': true,
                'minWidth': 1,
                'maxWidth': 2,
                'minHeight': 1,
                'maxHeight': 2,
                'id': 0
            };
            service.addWidgetToGrid(widgetFactory.createWidget("testwidget", "https://www.facebook.com", settings, service.count + 1), service.count, true);
            service.count++;
        }
    };

    service.simpleAdd = function (title, url, color, textcolor) {
        service.addWidgetToGrid(widgetFactory.createWidget(title, url, {
            'autoposition': true,
        }, service.count + 1, color, textcolor), service.count, true);
        service.count++;
    };

    // From w3 to add clock
    function startTime() {
        let clocks = document.querySelectorAll('.txt');
        if (clocks.length > 0) {
            let today = new Date();
            const h = today.getHours();
            let m = today.getMinutes();
            let s = today.getSeconds();
            m = checkTime(m);
            s = checkTime(s);
            clocks.forEach(a => a.innerHTML =
                h + ":" + m + ":" + s);
            setTimeout(startTime, 500);
        }
    }

    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        } // add zero in front of numbers < 10
        return i;
    }


    return service;
}

export {grid};
