"use strict";
/* eslint-env node, browser, jquery */
window.browser = (() => {
    return window.browser || window.chrome || window.msBrowser;
})();


import {CTabSettings} from "./settingsMenu.js";

const cTabSettings = CTabSettings();

function grid() {
    let service = {};
    service.count = 0;
    service.widgets = {};
    let widgetFactory = new WidgetFactory();
    let dirty = false;

    const options = {
        // Muuri options
        dragEnabled: true,
        layoutOnInit: false,
        layout: {
            fillGaps: false,
            horizontal: false,
            alignRight: false,
            alignBottom: false,
            rounding: false
        },
        sortData: {
            id: function (item, element) {
                return parseFloat(item._id);
            },
            title: function (item, element) {
                const ctabBody = [].slice.call(element.children[0].children).filter(el => el.classList.contains("ctab-widget-body"))[0];
                if (ctabBody.classList.contains('ctab-item-clock')) {
                    return "ZZZ";
                }
                if (ctabBody.classList.contains('ctab-item-note')) {
                    return "ZZZ";
                }
                return ctabBody.children[0].innerText.toUpperCase();
            }
        }
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

    // TODO: fix with muuri
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
        service.load();


        // Save whenever you leave the screen
        // TODO: fix with muuri
        window.onbeforeunload = function () {
            // dirty state is implemented loosely (did not care much before, dirty in the probability of change)
            // so an extra check is also added comparing the current state to the saved state
            if (hasChanges() && cTabSettings.getShowUnsavedWarning()) {
                return "You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?";
            }
            // service.saveGrid(); // Disabled to enable dev edit
        };


        // TODO: fix with muuri
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

        // TODO: fix with muuri
        // Call to textfill library, calculate font sizes that make the text fit in the boxes.
        Object.keys(service.widgets).forEach(i => $('#' + i).textfill({
            minFontPixels: 12,
            allowOverflow: true,
        }));
        // Start clocks
        startTime();
        // Set dirty to false, since note widgets might have set the state to dirty
        document.querySelectorAll(".ctab-item-note").forEach(note => {
            note.addEventListener('change', noteChanged);
            note.addEventListener('keyup', noteChanged);
        });
        dirty = false;

        $('.ctab-item-clock').textfill({
            minFontPixels: 10,
            allowOverflow: true,
        });
    };

    // Update the mutable object in the model.widgets
    // two way binding
    // TODO: fix with muuri
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


    // TODO: fix with muuri; check if necessary for deterministic saving and loading
    service.getSortedWidgets = function () {
        return Object.keys(service.widgets);
    };


    // TODO: fix with muuri; muuri call is here but check where to call this and how id should be
    service.removeWidget = function (id) {
        service.grid.remove(document.getElementById(id), {removeElements: true});
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

        widget.settings.autoPosition = !!autoPos;
        let itemElem = document.createElement('div');
        itemElem.innerHTML = widget.widgetTemplate();
        service.grid.add(itemElem.firstChild, {index: widget.id});
        widget.settings.autoPosition = false;
        if (widget.type === 'weather') {
            widget.settings.width = widget.settings.width > 1 ? widget.settings.width : 2;
            widget.settings.height = widget.settings.height > 1 ? widget.settings.height : 2;
            widget.settings.city = widget.settings.city ? widget.settings.city : "delft";
            setTimeout(() => {
                addWeatherListener(widget, widget.id);
                document.getElementById(widget.id + '-cityInput').value = widget.settings.city;
                getWeather(widget.id, widget.settings.city);
            }, 100);
        }

        service.widgets[service.count] = widget;
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

            const newTab = cTabSettings.getNewTab();

            // set default values
            widget.settings.width = settings.width ? settings.width : 1;
            widget.settings.height = settings.height ? settings.height : 1;

            // TODO HTML and javascript need to be separated
            //  option: https://github.com/polymer/lit-element#minimal-example
            //  option: vue components
            widget.getTag = () => `<span style="line-height: 100%;">${widget.title}</span><a href="${widget.contentUrl}" ${newTab ? 'target="_blank"' : ""} id="${widget.title}"><span class="ctab-widget-link"></span></a>`;

            widget.getHtmlControls = () => `<div class="ctab-widget-controls"><div class="deletebutton">${this.id}</div></div>`;


            widget.colorInfo = function () {
                let styleInfo = 'style="';
                styleInfo += widget.textcolor !== undefined ? `color:${widget.textcolor};` : "";
                styleInfo += widget.color !== undefined ? `--item-color:${widget.color};` :
                    `--item-color:${defaultWidgetColor};`;
                //TODO document.style.setproperty
                return styleInfo + '"';
            };

            // The basic template for a widget
            widget.widgetTemplate = function () {
                let template =
                    `<div class="item he${widget.settings.height} w${widget.settings.width}" data-title="${widget.title}">
                        <div class="item-content" ${widget.colorInfo()}>`;
                switch (type) {
                    case "clock" :
                        template += `<div id="${widget.id}" class="ctab-widget-body ctab-item-clock"><span></span></div>`;
                        break;
                    case "note":
                        template += `${widget.getHtmlControls()}
                                    <div id="${widget.id}" class="ctab-widget-body ctab-item-note">
                                        <textarea id="note-${widget.id}">${widget.title}</textarea>
                                    </div>`;
                        break;
                    case "buienradar":
                        template += `<div id="${widget.id}" class="ctab-widget-body">
                                        <IFRAME SRC="https://api.buienradar.nl/image/1.0/RadarMapNL?w=256&h=256" NORESIZE SCROLLING=NO HSPACE=0 VSPACE=0 FRAMEBORDER=0 MARGINHEIGHT=0 MARGINWIDTH=0 WIDTH=256 HEIGHT=256></IFRAME>
                                    </div>`;
                        break;
                    case "weather" :
                        template += `<div id="${this.id}" class="ctab-widget-body">
                                        <input type="text" id="${this.id}-cityInput" style="width: 60%;float:left;">
                                        <button id="${this.id}-cityInputButton" data-id="${this.id}" style="font-size: 11px; width: 30%;float:left background-color: #eee; border-radius: 3px; border: 1px solid #ccc;">Change<br> city</button>
                                    <br>
                                        <span id="${this.id}-output"style="width: 100%; white-space: nowrap;">Loading weather</span>
                                    </div>`;
                        break;
                    case "link":
                    default:
                        template += `${widget.getHtmlControls()} 
                                    <div id="${widget.id}" class="ctab-widget-body"> 
                                        ${widget.getTag()} 
                                    </div>`;
                        break;
                }
                template += `</div></div>`;

                return template;
            };

            widget.getConfig = function () {
                return {
                    title: widget.title,
                    settings: widget.settings,
                    contentUrl: widget.contentUrl,
                    color: widget.color,
                    textcolor: widget.textcolor,
                    type: widget.type,
                    id: widget.id
                };
            };

            return widget;
        };
    }

    service.getConfig = function () {
        try {
            let chromeresult = window.browser.storage.sync.get(['CTabConfig'], function (res) {
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
        console.log(service.grid.getItems());
        if (typeof config !== 'string') {
            config = JSON.stringify(config);
        }
        if (config.length > 1)
            window.localStorage.setItem("CTabConfig", config);
        else {
            console.log("config too small", config);
        }
        try {
            // chrome.storage.sync.set({"CTabConfig": config}); // TODO: Too much data apparently, maybe save per widget? instead of whole json at once -> title can only occur once
        } catch (e) {
            console.log("could not save to chrome sync storage");
            console.error(e);
        }
    };
    // Returns message if save call is executed or not
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
        let clocks = document.querySelectorAll('.ctab-item-clock');
        if (clocks.length > 0) {
            let today = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Europe/Amsterdam',
                hour12: false
            });
            clocks.forEach(a => a.children[0].innerHTML = today);
            setTimeout(startTime, 500);
        }
    }

    const getWeather = (id, city) => {
        let tempFormat = (data) => {
            if (data.weather) {
                console.log("Weather type(s)", data.weather.reduce((acc, curr) => acc + " - " + curr.main, ""));
                let curTemp = (data.main.temp - 273.15).toFixed(2);
                let curWeather = data.weather.reduce((acc, weatherType) => {
                    if (weatherEmoji.hasOwnProperty(weatherType.main)) {
                        return acc + weatherEmoji[weatherType.main];
                    }
                    return acc + weatherEmoji.Error;
                }, "");
                return `${curWeather} ${curTemp}°C`;
            }
            return "invalid key";
        };

        let knownWeather = window.localStorage.getItem('weatherInfo') || '{}';
        knownWeather = JSON.parse(knownWeather);

        let weatherEmoji = {
            "Mist": "🌁",
            "Haze": "🌫️",
            "Snow": "⛄",
            "Rain": "☔",
            "Clouds": "⛅",
            "Thunderstorm": "⚡",
            "Clear": "🌞",
            "Moon": "🌜",
            "Windy": "⛵",
            "Drizzle": "🌦",
            "Error": "❌",
            "Fog": "🌫️"
        };

        const defaultWeatherTimeout = 1000 * 60 * 15;
        let weatherTimeout = cTabSettings.getWeatherTimeoutValue() || defaultWeatherTimeout;
        if (knownWeather && knownWeather.hasOwnProperty(city) && (new Date().getTime() - knownWeather[city].time) < weatherTimeout) {
            document.getElementById(id + '-output').innerText = tempFormat(knownWeather[city]);
        } else {
            city = city === "" ? "delft" : city;
            const apiKey = cTabSettings.getWeatherAPIKey();
            fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`).then(response =>
                response.json().then(data => ({
                        data: data,
                        status: response.status
                    })
                ).then(res => {
                    knownWeather[city] = res.data;
                    knownWeather[city].time = new Date().getTime();
                    window.localStorage.setItem('weatherInfo', JSON.stringify(knownWeather));
                    document.getElementById(id + '-output').innerText = tempFormat(res.data);
                })).catch((err) => {
                console.log(err);
                document.getElementById(id + '-output').innerText = weatherEmoji.Error + "no (valid) key";
            });
        }
    };


    function addWeatherListener(widget, id) {
        const cityButton = document.getElementById(id + '-cityInputButton');
        if (cityButton) {
            cityButton.addEventListener('click', () => {
                let city = document.getElementById(id + '-cityInput').value;
                widget.settings.city = city;
                getWeather(id, city);
            });
        } else {
            console.log("Could not find the 'change' button corresponding to widget", id);
        }
    }

    return service;
}

export {grid};
