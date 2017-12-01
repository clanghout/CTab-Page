"use strict";

function grid() {
    var service = {};
    service.grid = $(".grid-stack");
    service.count = 0;
    service.widgets = {};
    let widgetFactory = new WidgetFactory();
    let dirty = false;

    var options = {
        animate: true,
        cellHeight: 60,
        verticalMargin: 0,
        float: true,
        disableOneColumnMode: true,
        removable: true,
        width: 12
    };

    service.initialize = function () {
        service.grid.gridstack(options);
        service.gridData = service.grid.data('gridstack');
        let curConfig = service.getConfig();
        console.log("current config", curConfig);


        // Batch update to add all widgets at once
        service.gridData.batchUpdate();
        // for (let widgetKey in curConfig) {
        //     let widget = curConfig[widgetKey];
        //     console.log("widget from config: ", widget);
        //     let content = widget.content;
        //     service.addWidgetToGrid(new widgetFactory(
        //         `<div>
        //             <div class="grid-stack-item-content">
        //                 ${content}
        //             </div>
        //         </div>
        //         `, 0, 0, 1, 1, true, 1, 2, 1, 2, 0)
        //     );
        // }
        service.load();
        service.gridData.commit();

        window.onbeforeunload = function () {
            //service.saveGrid();
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
        var ids = [];
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
        console.log("widget", widget.toString());

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
        this.createWidget = function (title, contentUrl, settings, id) {
            var widget = function () {
            };
            widget.settings = settings;
            widget.title = title;
            widget.contentUrl = contentUrl;

            // TODO HTML and javascript need to be separated
            widget.getTag = function () {
                return title + '<a href="' + contentUrl + '"><span class="ctab-widget-link"></span></a>';
            };

            // The basic template for a widget
            widget.widgetTemplate = function () {
                return '<div>' +
                    '<div class="grid-stack-item-content">' +
                    '<div id="' +
                    id +
                    '" class="ctab-widget-body">' +
                    this.getTag() +
                    '</div>' +
                    '</div>' +
                    '</div>';
            };

            widget.getConfig = function () {
                return {
                    "title": this.title,
                    "settings": settings,
                    "contentUrl": contentUrl,
                };
            };

            widget.toString = function () {
                return "{Title: " + title + ",\n" +
                    "settings: " + JSON.stringify(settings) +
                    ",\ncontentUrl: " + contentUrl + "\n" +
                    "}"
            };

            return widget;
        };
    }

    service.getConfig = function () {
        return JSON.parse(window.localStorage.getItem("CTabConfig"));
    };

    service.setConfig = function (config) {
        console.log("set storage", config);
        if (typeof config !== 'string') {
            config = JSON.stringify(config);
        }
        window.localStorage.setItem("CTabConfig", config);
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
            let widget = widgetFactory.createWidget(title, contentUrl, settings, i);
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

    return service;
}