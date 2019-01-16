"use strict";

function grid() {
    let service = {};
    service.count = 0;
    service.widgets = {};
    let widgetFactory = new WidgetFactory();
    let dirty = false;

    const options = {
        // Muuri options
        dragEnabled: true,
        // items: document.querySelector(".grid").querySelectorAll('.item')



        // Gridstack options:
        // animate: true,
        // cellHeight: 60,
        // verticalMargin: 5,
        // float: true,
        // disableOneColumnMode: true,
        // width: 12,
        // removable: '.trash', // Trash area has to exist: div.trash is enough => with style to display
        // removeTimeout: 100
    };
    const defaultWidgetColor = "#fff";

    const noteChanged = () => {
        dirty = true;
    };

    const hasChanges = () => {
        let saved = service.getConfig();
        let current = service.getDashboardConfig();
        // compare strings since object compare is always different with ==
        if (JSON.stringify(saved) !== JSON.stringify(current)) {
            if (dirty) {
                return true;
            }
            console.log("Changes exist but dirty is false");
            return true;
        }
        return false;
    };

    service.initialize = function () {
        service.grid = new Muuri(".grid", options);
        // service.grid.gridstack(options);
        // service.gridData = service.grid.data('gridstack');
        let curConfig = service.getConfig();
        console.log("current config", curConfig);


        // Batch update to add all widgets at once
        // service.gridData.batchUpdate();
        service.load();
        // service.gridData.commit();


        // Save whenever you leave the screen
        window.onbeforeunload = function () {
            // dirty state is implemented loosely (did not care much before, dirty in the probability of change)
            // so an extra check is also added comparing the current state to the saved state
            if (hasChanges()) {
                return "You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?";
            }
            // service.saveGrid(); // Disabled to enable dev edit
        };

        service.grid.on("change", function (event, items) {
            dirty = true;
            // When you change the title of a widget, a gridstack onChange event is retrieved with
            // items === 'undefined'.
            if (typeof items !== 'undefined') {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].id in service.widgets) {
                        service.update(items[i].id, items[i]);
                        // Call to textfill library, dynamically adapting the font size
                        $('#' + items[i].id).textfill({
                            minFontPixels: 10,
                            allowOverflow: true,
                        });
                    }
                }
            }
        });
        // Call to textfill library, calculate font sizes that make the text fit in the boxes.
        Object.keys(service.widgets).forEach(i => $('#' + i).textfill({
            minFontPixels: 10,
            allowOverflow: true,
        }));
        // Start clocks
        startTime();
        // Set dirty to false, since note widgets might have set the state to dirty
        document.querySelectorAll(".note").forEach(note => {
            note.addEventListener('change', noteChanged);
            note.addEventListener('keyup', noteChanged);
        });
        dirty = false;
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
        // service.gridData.grid._sortNodes();
        let ids = [];
        // _.map($('.grid > .item:visible'),
        //     function (el) {
        //         el = $(el);
        //         ids.push(el.data('_gridstack_node')["id"]);
        //     });
        return ids;
    };

    service.removeWidget = function (id) {
        // _.map($('.grid-stack > .grid-stack-item:visible'),
        //     function (el) {
        //         el = $(el);
        //         // id is saved in gridstack as a string while the parameter is an integer
        //         if (el.data('_gridstack_node')["id"] == id) {
        //             service.gridData.removeWidget(el);
        //         }
        //     });
    };

    service.addWidgetToGrid = function (widget, id, autoPos) {
        if (typeof id === 'undefined') {
            service.count++;
            widget.id = service.count;
        } else {
            if (typeof id === "number") {
                widget.id = id;
            } else {
                widget.id = parseInt(id);
            }
        }

        service.widgets[service.count] = widget;
        widget.settings.autoPosition = !!autoPos;
        let itemElem = document.createElement('div');
        itemElem.innerHTML = widget.widgetTemplate();
        service.grid.add(itemElem.firstChild, {index:widget.id});
        // service.gridData.addWidget(
        //     widget.widgetTemplate(),
        //     widget.settings.x,
        //     widget.settings.y,
        //     widget.settings.width,
        //     widget.settings.height,
        //     widget.settings.autoPosition,
        //     widget.settings.minWidth,
        //     widget.settings.maxWidth,
        //     widget.settings.minHeight,
        //     widget.settings.maxHeight,
        //     widget.id);
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
            widget.type = type;
            widget.id = id;

            // TODO HTML and javascript need to be separated
            //  option: https://github.com/polymer/lit-element#minimal-example
            //  option: vue components
            widget.getTag = () => `<span>${widget.title}</span><a href="${widget.contentUrl}" id="${widget.title}"><span class="ctab-widget-link"></span></a>`;

            widget.getHtmlControls = () => `<div class="ctab-widget-controls"><div class="deletebutton">${this.id}</div></div>`;


            widget.colorInfo = function () {
                let styleInfo = 'style="';
                styleInfo += this.textcolor !== undefined ? `color:${this.textcolor};` : "";
                styleInfo += this.color !== undefined ? `--item-color:${this.color};` :
                    `--item-color:${defaultWidgetColor};`;
                //TODO document.style.setproperty
                return styleInfo + '"';
            };

            // The basic template for a widget
            widget.widgetTemplate = function () {
                // TODO types: custom elements + scalable (getTag() for example)
                if (type === "clock")
                    return `<div class="item h${this.settings.height} w${this.settings.width}">
                                <div class="item-content"${this.colorInfo()}>
                                    <div id="${this.id}" class="ctab-widget-body txt">
                                    </div>
                                </div>
                             </div>`;
                else if (type === "note") {
                    let templateString = `<div class="item"> 
                                <div class="item-content"  ${this.colorInfo()}> 
                                    ${this.getHtmlControls()}
                                    <div id="${this.id}" class="ctab-widget-body note">
                                        <textarea id="note-${this.id}">${this.title}</textarea>
                                    </div> 
                                </div> 
                            </div>`;
                    return templateString;
                } else if (type === "buienradar") {
                    return `<div class="item">
                                <div class="item-content"${this.colorInfo()}>
                                    <div id="${this.id}" class="ctab-widget-body">
                                        <IFRAME SRC="https://api.buienradar.nl/image/1.0/RadarMapNL?w=256&h=256" NORESIZE SCROLLING=NO HSPACE=0 VSPACE=0 FRAMEBORDER=0 MARGINHEIGHT=0 MARGINWIDTH=0 WIDTH=256 HEIGHT=256></IFRAME>
                                    </div>
                                </div>
                             </div>`;
                } else
                    return `<div class="item"> 
                                <div class="item-content" ${this.colorInfo()}> 
                                    ${this.getHtmlControls()} 
                                    <div id="${this.id}" class="ctab-widget-body"> 
                                        ${this.getTag()} 
                                    </div> 
                                </div> 
                            </div>`;
            };

            widget.getConfig = function () {
                return {
                    title: this.title,
                    settings: this.settings,
                    contentUrl: this.contentUrl,
                    color: this.color,
                    textcolor: this.textcolor,
                    type: this.type,
                    id: this.id
                };
            };

            widget.toString = () => `{
                Title: ${this.title},
                settings: ${JSON.stringify(this.settings)},
                contentUrl: ${this.contentUrl},
                color: ${this.color},
                textcolor: ${this.textcolor}
            }`;

            return widget;
        };
    }

    service.getConfig = function () {
        try {
            let chromeresult = chrome.storage.sync.get(['CTabConfig'], function (res) {
                return res;
            });
        } catch (error) {
            console.info("cant find chrome result");
        }
        let lsConfig = window.localStorage.getItem("CTabConfig");
        let config = [];
        try {
            config = JSON.parse(lsConfig);
        } catch (error) {
            console.error(`Config could not be parsed, found configuration:`, lsConfig);
            console.error(error);
        }
        return config;
    };

    service.setConfig = function (config) {
        if (typeof config !== 'string') {
            config = JSON.stringify(config);
        }
        window.localStorage.setItem("CTabConfig", config);
        // chrome.storage.sync.set({"CTabConfig": config}); // TODO: Too much data apparently, maybe save per widget? instead of whole json at once -> title can only occur once
    };
    service.saveGrid = function () {
        if (hasChanges()) {
            service.setConfig(service.getDashboardConfig());
            dirty = false;
            return "Configuration saved!";
        } else {
            return "nothing to save";
        }
    };

    service.getDashboardConfig = function () {
        let configuration = [];
        let ids = service.getSortedWidgets();
        for (let i = 0; i < ids.length; i++) {
            let w = service.widgets[ids[i]];
            let wc = w.getConfig();
            if (w.type === 'note') {
                // save internals of node objects
                let innerText = document.querySelector('#note-' + wc.id).value;
                if (innerText.replace(/\s/g, '').length !== 0) {
                    wc.title = innerText.trim();
                }
            }
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
                widgets: [{
                    widgetConfig: {"width": 2, "height": 2},
                    title: "github",
                    contentUrl: 'https://www.github.com'
                }],
            };
            service.setConfig(sampleConfiguration);
        }
        if (addSampleWidgets) {
            console.log("adding debug widget");
            let settings = {
                x: 5,
                y: 5,
                width: 1,
                height: 1,
                autoPosition: true,
                minWidth: 1,
                maxWidth: 2,
                minHeight: 1,
                maxHeight: 2,
                id: 0
            };
            service.addWidgetToGrid(widgetFactory.createWidget("testwidget", "https://www.facebook.com", settings, service.count + 1), service.count, true);
            service.count++;
        }
    };

    service.simpleAdd = function (title, url, color, textcolor, type) {
        service.addWidgetToGrid(widgetFactory.createWidget(title, url, {
            autoPosition: true,
        }, service.count + 1, color, textcolor, type), service.count, true);
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
