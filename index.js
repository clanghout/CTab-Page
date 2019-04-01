(() => {
    const defines = {};
    const entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies, factory };
        entry[0] = name;
    }
    define("require", ["exports"], (exports) => {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: (name) => resolve(name) });
    });
    define("cTabWidgetType", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class CTabWidget {
            constructor(id, settings, backgroundColor, textColor) {
                this.id = id;
                this.settings = settings;
                this.backgroundColor = backgroundColor;
                this.textColor = textColor;
                this.widgetTemplate = () => {
                    let template = `<div class="item he${this.settings.height} w${this.settings.width}">
                            <div class="item-content" ${this.colorInfo()}>
    ${this.getHtmlControls()}
    <div class="ctab-widget-drag-handle hidden" id="drag-handle-${this.id}">
    <span style="top:0; left: 0;">&#8598</span>
    <span style="top:0; right: 0;">&#8599</span>
    <span style="bottom:0; right: 0;">&#8600</span>
    <span style="bottom:0; left: 0;">&#8601</span>
    </div>`;
                    template += this.getTemplateCore();
                    template += `</div></div>`;
                    return template;
                };
                this.getConfig = () => {
                    return {
                        settings: this.settings,
                        backgroundColor: this.backgroundColor,
                        textColor: this.textColor,
                        id: this.id,
                        type: this.constructor.name
                    };
                };
                this.colorInfo = () => {
                    return `style="color: var(--${this.id}-text-color);
            background-color: var(--${this.id}-background-color);
            --item-background-color:${this.backgroundColor};
            "`;
                };
                this.getHtmlControls = () => `<div class="ctab-widget-controls hidden" id="controls-${this.id}">
                        <div class="deletebutton">
                            <button id="delete-${this.id}" style="padding: 0; border: 0; background: transparent;">❌</button>
                        </div>
                        <div class="vanilla-color-picker widget-control-picker" id="${this.id}-text-color" style="color:var(--${this.id}-text-color); border-color: var(--${this.id}-text-color); background-color: rgba(255,255,255,.8)">tc</div>
                        <div class="vanilla-color-picker widget-control-picker" id="${this.id}-background-color" style="background-color: var(--${this.id}-background-color); border-color: var(--${this.id}-background-color);">bg</div>
                    </div>`;
            }
        }
        exports.CTabWidget = CTabWidget;
        class TitleWidget extends CTabWidget {
            constructor(id, settings, backgroundColor, textColor) {
                super(id, settings, backgroundColor, textColor);
                this.id = id;
                this.settings = settings;
                this.backgroundColor = backgroundColor;
                this.textColor = textColor;
                this.getConfig = () => {
                    this.settings.title = document.querySelector('#note-' + this.id).value.replace(/\s/g, '').trim();
                    return {
                        settings: this.settings,
                        backgroundColor: this.backgroundColor,
                        id: this.id,
                        textColor: this.textColor,
                        type: this.constructor.name
                    };
                };
            }
            ;
        }
        exports.TitleWidget = TitleWidget;
        class WeatherWidget extends CTabWidget {
            constructor(id, settings, backgroundColor, textColor) {
                super(id, settings, backgroundColor, textColor);
                this.id = id;
                this.settings = settings;
                this.backgroundColor = backgroundColor;
                this.textColor = textColor;
                this.getTemplateCore = () => {
                    return `<div id="${this.id}" class="ctab-widget-body">
                                            <input type="text" id="${this.id}-cityInput" style="width: 60%;float:left;">
                                            <button id="${this.id}-cityInputButton" data-id="${this.id}" style="font-size: 11px; width: 30%;float:left background-color: #eee; border-radius: 3px; border: 1px solid #ccc;">Change<br> city</button>
                                        <br>
                                            <span id="${this.id}-output" style="width: 100%; white-space: nowrap;">Loading weather</span>
                                        </div>`;
                };
            }
        }
        exports.WeatherWidget = WeatherWidget;
        class LinkWidget extends TitleWidget {
            constructor(id, settings, backgroundColor, textColor, newTab) {
                super(id, settings, backgroundColor, textColor);
                this.id = id;
                this.settings = settings;
                this.backgroundColor = backgroundColor;
                this.textColor = textColor;
                this.newTab = newTab;
                this.getTag = () => `<span style="line-height: 100%;">${this.settings.title}</span>
    <a href="${this.settings.url}" ${this.newTab ? 'target="_blank"' : ""} id="${this.settings.title}">
        <span class="ctab-widget-link"></span>
    </a>`;
                this.getTemplateCore = () => {
                    return `<div id="${this.id}" class="ctab-widget-body"> 
                                            ${this.getTag()} 
                                        </div>`;
                };
                this.getConfig = () => {
                    return {
                        settings: this.settings,
                        backgroundColor: this.backgroundColor,
                        textColor: this.textColor,
                        id: this.id,
                        type: this.constructor.name
                    };
                };
            }
        }
        exports.LinkWidget = LinkWidget;
        class ClockWidget extends CTabWidget {
            constructor(id, settings, backgroundColor, textColor) {
                super(id, settings, backgroundColor, textColor);
                this.id = id;
                this.settings = settings;
                this.backgroundColor = backgroundColor;
                this.textColor = textColor;
                this.getTemplateCore = () => {
                    return `<div id="${this.id}" class="ctab-widget-body ctab-item-clock"><span></span></div>`;
                };
            }
        }
        exports.ClockWidget = ClockWidget;
        class BuienradarWidget extends CTabWidget {
            constructor(id, settings, backgroundColor, textColor) {
                super(id, settings, backgroundColor, textColor);
                this.id = id;
                this.settings = settings;
                this.backgroundColor = backgroundColor;
                this.textColor = textColor;
                this.getTemplateCore = () => {
                    return `<div id="${this.id}" class="ctab-widget-body">
                                            <IFRAME SRC="https://api.buienradar.nl/image/1.0/RadarMapNL?w=256&h=256" NORESIZE SCROLLING=NO HSPACE=0 VSPACE=0 FRAMEBORDER=0 MARGINHEIGHT=0 MARGINWIDTH=0 WIDTH=256 HEIGHT=256></IFRAME>
                                        </div>`;
                };
            }
        }
        exports.BuienradarWidget = BuienradarWidget;
        class NoteWidget extends TitleWidget {
            constructor(id, settings, backgroundColor, textColor) {
                super(id, settings, backgroundColor, textColor);
                this.id = id;
                this.settings = settings;
                this.backgroundColor = backgroundColor;
                this.textColor = textColor;
                this.getTemplateCore = () => {
                    return `<div id="${this.id}" class="ctab-widget-body ctab-item-note">
                                            <textarea id="note-${this.id}">${this.settings.title}</textarea>
                                        </div>`;
                };
            }
        }
        exports.NoteWidget = NoteWidget;
        exports.cTabTypeMap = [BuienradarWidget, NoteWidget, ClockWidget, LinkWidget, WeatherWidget].reduce((acc, curr) => {
            acc[curr.name] = curr;
            return acc;
        }, {});
    });
    define("settingsMenu", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        let CTabSettings = () => {
            const settingsToggleButton = document.querySelector('#settings-toggle');
            const settingsPaneDiv = document.querySelector('#settingsMenu');
            const backgroundImg = document.querySelector('#background');
            const bgUrlVal = document.querySelector('#background-url-value');
            const weatherTimeoutInput = document.querySelector('#weather-timeout');
            let settingsActive = false;
            const backgroundApplyButton = document.querySelector('#background-apply');
            const settingsMainSaveButton = document.querySelector('#settings-main-save-button');
            const unsavedChangesWarningCheckbox = document.querySelector('#unsaved-changes-warning');
            const openInNewTabCheckbox = document.querySelector('#link-new-tab');
            const weatherAPIKeyInput = document.querySelector('#weather-API-key');
            const timezoneSelect = document.querySelector('#timezone-select');
            let currentSettings = JSON.parse(window.localStorage.getItem('CTab-settings')) || {};
            const initialize = function () {
                // Color pickers
                new Picker({
                    parent: document.getElementById('widget-border-color'),
                    popup: 'bottom',
                    editor: true,
                    color: currentSettings.borderColor,
                    onChange: (newColor) => {
                        document.documentElement.style.setProperty('--widget-border-color', newColor.rgbaString);
                        currentSettings.borderColor = newColor.rgbaString;
                    },
                    onDone: (newColor) => {
                        currentSettings.borderColor = newColor.rgbaString;
                        save();
                    }
                });
                new Picker({
                    parent: document.getElementById('background-color-picker'),
                    popup: 'bottom',
                    editor: true,
                    color: currentSettings.backgroundColor,
                    onChange: (newColor) => {
                        document.documentElement.style.setProperty('--background-color', newColor.rgbaString);
                        currentSettings.backgroundColor = newColor.rgbaString;
                    },
                    onDone: (newColor) => {
                        currentSettings.backgroundColor = newColor.rgbaString;
                        save();
                    }
                });
                document.documentElement.style.setProperty('--widget-border-color', currentSettings.borderColor);
                backgroundImg.src = currentSettings.background;
                if (typeof currentSettings.backgroundRadioSelected === 'number') {
                    document.getElementsByName('background')[currentSettings.backgroundRadioSelected].checked = true;
                    if (currentSettings.backgroundRadioSelected === 2) {
                        bgUrlVal.value = currentSettings.background;
                    }
                }
                unsavedChangesWarningCheckbox.checked = currentSettings.unsavedChangesWarningEnabled || false;
                unsavedChangesWarningCheckbox.addEventListener('click', () => {
                    currentSettings.unsavedChangesWarningEnabled = unsavedChangesWarningCheckbox.checked;
                    save();
                });
                openInNewTabCheckbox.checked = currentSettings.openInNewTab || false;
                openInNewTabCheckbox.addEventListener('click', () => {
                    currentSettings.openInNewTab = openInNewTabCheckbox.checked;
                    save();
                });
                weatherAPIKeyInput.value = currentSettings.weatherAPIKey || "";
                weatherAPIKeyInput.addEventListener('change', () => {
                    currentSettings.weatherAPIKey = weatherAPIKeyInput.value;
                    save();
                });
                // weather timeout
                weatherTimeoutInput.value = currentSettings.weatherTimeout || 60 * 15;
                weatherTimeoutInput.addEventListener('change', () => {
                    currentSettings.weatherTimeout = weatherTimeoutInput.value;
                    save();
                });
                // Timezone
                timezoneSelect.selectedIndex = currentSettings.timezoneIndex || 421; //default to Europe/Amsterdam
                timezoneSelect.addEventListener('change', () => {
                    currentSettings.timezone = timezoneSelect.options[timezoneSelect.selectedIndex].innerText;
                    currentSettings.timezoneIndex = timezoneSelect.selectedIndex;
                    save();
                });
            };
            function getBackgroundSetting() {
                let selectedBackgroundOption = "";
                let backgroundOptions = document.getElementsByName('background');
                for (let i = 0, length = backgroundOptions.length; i < length; i++) {
                    if (backgroundOptions[i].checked) {
                        selectedBackgroundOption = backgroundOptions[i].value;
                        currentSettings.backgroundRadioSelected = i;
                        break;
                    }
                }
                switch (selectedBackgroundOption) {
                    case 'file':
                        const convertToBase64 = function (file, callback) {
                            let reader = new FileReader();
                            reader.onloadend = function () {
                                callback(reader.result, reader.error);
                            };
                            reader.readAsDataURL(file);
                        };
                        const backgroundFileInput = document.querySelector("#background-file-value");
                        let selectedFile = backgroundFileInput.files[0];
                        // check if a file is selected
                        if (selectedFile) {
                            convertToBase64(selectedFile, function (base64) {
                                currentSettings.background = base64;
                                backgroundImg.src = currentSettings.background;
                            });
                        }
                        break;
                    case 'url':
                        let backgroundUrlValue = bgUrlVal.value;
                        currentSettings.background = backgroundUrlValue;
                        break;
                    case 'color':
                        currentSettings.background = "";
                        break;
                    case 'random':
                    default:
                        currentSettings.background = "https://source.unsplash.com/random/1920x1080";
                        break;
                }
                backgroundImg.src = currentSettings.background;
                save();
            }
            function save() {
                window.localStorage.setItem('CTab-settings', JSON.stringify(currentSettings));
            }
            settingsMainSaveButton.addEventListener('click', () => {
                save();
            });
            backgroundApplyButton.addEventListener('click', () => {
                getBackgroundSetting();
                // reload to let gridcontrols use new settings;
            });
            settingsToggleButton.addEventListener('click', () => settingsToggle());
            function settingsToggle() {
                settingsActive = !settingsActive;
                settingsActive ? settingsPaneDiv.classList.remove('hidden') : settingsPaneDiv.classList.add('hidden');
            }
            const getWeatherTimeoutValue = function () {
                return currentSettings.weatherTimeout * 1000;
            };
            const getTimezone = function () {
                return currentSettings.timezone;
            };
            const getWeatherAPIKey = function () {
                return currentSettings.weatherAPIKey;
            };
            const getShowUnsavedWarning = function () {
                return currentSettings.unsavedChangesWarningEnabled;
            };
            const getNewTab = function () {
                return currentSettings.openInNewTab;
            };
            return {
                initialize: initialize,
                getWeatherTimeoutValue: getWeatherTimeoutValue,
                getTimezone: getTimezone,
                getWeatherAPIKey: getWeatherAPIKey,
                getShowUnsavedWarning: getShowUnsavedWarning,
                getNewTab: getNewTab
            };
        };
        exports.default = CTabSettings();
    });
    define("weatherControls", ["require", "exports", "settingsMenu"], function (require, exports, settingsMenu_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const defaultWeatherTimeout = 1000 * 60 * 15;
        // Retrieves the past information on weather from the local storage
        let knownWeather = JSON.parse(window.localStorage.getItem('weatherInfo') || '{}');
        // Dictionary of weather type to emoji
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
        exports.getWeather = (id, city) => {
            let weatherOutputElem = document.getElementById(id + '-output');
            let weatherTimeout = settingsMenu_1.default.getWeatherTimeoutValue() || defaultWeatherTimeout;
            if (knownWeather && knownWeather.hasOwnProperty(city) && (new Date().getTime() - knownWeather[city].retrievedAt) < weatherTimeout) {
                if (weatherOutputElem !== null) {
                    weatherOutputElem.innerText = tempFormat(knownWeather[city]);
                }
            }
            else {
                city = city === "" ? "delft" : city;
                const apiKey = settingsMenu_1.default.getWeatherAPIKey();
                fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`).then(response => response.json().then(data => ({
                    data: data,
                    status: response.status
                })).then(res => {
                    knownWeather[city] = res.data;
                    knownWeather[city].retrievedAt = new Date().getTime();
                    window.localStorage.setItem('weatherInfo', JSON.stringify(knownWeather));
                    if (weatherOutputElem !== null) {
                        weatherOutputElem.innerText = tempFormat(res.data);
                    }
                })).catch((err) => {
                    console.log(err);
                    if (weatherOutputElem !== null) {
                        weatherOutputElem.innerText = weatherEmoji.Error + "no (valid) key";
                    }
                });
            }
        };
        // Export this function
        function addWeatherListener(widget, id) {
            const cityButton = document.getElementById(id + '-cityInputButton');
            if (cityButton) {
                cityButton.addEventListener('click', () => {
                    const cityNameInput = document.getElementById(id + '-cityInput');
                    if (cityNameInput !== null) {
                        let city = cityNameInput.value;
                        widget.settings.city = city;
                        exports.getWeather(id, city);
                    }
                });
            }
            else {
                console.log("Could not find the 'change' button corresponding to widget", id);
            }
        }
        exports.addWeatherListener = addWeatherListener;
    });
    define("gridControls", ["require", "exports", "settingsMenu", "cTabWidgetType", "weatherControls"], function (require, exports, settingsMenu_2, CTabWidgetTypes, weatherEl) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        window.browser = (() => {
            return window.browser || window.chrome || window.msBrowser;
        })();
        const styleElem = document.head.appendChild(document.createElement('style'));
        function grid() {
            let grid;
            let widgets = [];
            let widgetColorPickerOpen = false;
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
                    id: function (item, _element) {
                        return parseFloat(item._id);
                    },
                    title: function (_item, element) {
                        const ctabBody = [].slice.call(element.children[0].children).filter((el) => el.classList.contains("ctab-widget-body"))[0];
                        if (ctabBody.classList.contains('ctab-item-clock')) {
                            return "ZZZ";
                        }
                        if (ctabBody.classList.contains('ctab-item-note')) {
                            return "ZZZ";
                        }
                        return ctabBody.children[0].innerText.toUpperCase();
                    }
                }
            };
            const initialize = function () {
                const muuriCopy = window.Muuri;
                grid = new muuriCopy(".grid", options);
                load();
                // Save whenever you leave the screen
                // TODO: fix with muuri
                // @ts-ignore - no return for not showing a before-unload alert
                window.onbeforeunload = function () {
                    // dirty state is implemented loosely (did not care much before, dirty in the probability of change)
                    // so an extra check is also added comparing the current state to the saved state
                    if (hasChanges() && settingsMenu_2.default.getShowUnsavedWarning()) {
                        return "You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?";
                    }
                    // service.saveGrid(); // Disabled to enable dev edit
                };
                // TODO: fix with muuri
                // service.grid.on("change", function (event, items) {
                //     dirty = true;
                //     // When you change the title of a widget, a gridstack onChange event is retrieved with
                //     // items === 'undefined'.
                //     if (typeof items !== 'undefined') {
                //         for (let i = 0; i < items.length; i++) {
                //             if (items[i].id in service.widgets) {
                //                 service.update(items[i].id, items[i]);
                //                 // Call to textfill library, dynamically adapting the font size
                //                 $('#' + items[i].id).textfill({
                //                     minFontPixels: 10,
                //                     allowOverflow: true,
                //                 });
                //             }
                //         }
                //     }
                // });
                // Call to textfill library, calculate font sizes that make the text fit in the boxes.
                widgets.forEach(i => $('#' + i.id).textfill({
                    minFontPixels: 12,
                    allowOverflow: true,
                }));
                // Start clocks
                startTime();
                document.querySelectorAll(".ctab-item-note").forEach(note => {
                    note.addEventListener('change', noteChanged);
                    note.addEventListener('keyup', noteChanged);
                });
                // Set dirty to false, since note widgets might have set the state to dirty
                dirty = false;
                $('.ctab-item-clock').textfill({
                    minFontPixels: 10,
                    allowOverflow: true,
                });
            };
            const getConfig = () => {
                let lsConfig = window.localStorage.getItem("CTabConfig") || "{}";
                let config = [];
                try {
                    config = JSON.parse(lsConfig);
                }
                catch (error) {
                    console.error(`Config could not be parsed, found configuration:`, lsConfig);
                    console.error(error);
                }
                return config;
            };
            const setConfig = (config) => {
                if (config.length >= 1)
                    window.localStorage.setItem("CTabConfig", JSON.stringify(config));
                else {
                    console.log("config too small", config);
                }
            };
            // Returns message if save call is executed or not
            const saveGrid = () => {
                if (hasChanges()) {
                    service.setConfig(getDashboardConfig());
                    dirty = false;
                    return "Configuration saved!";
                }
                else {
                    return "nothing to save";
                }
            };
            const debug = (sampleConfig, addSampleWidgets) => {
                console.log("debug:");
                if (sampleConfig) {
                    console.log("using sample config");
                    let sampleConfiguration = [{
                            settings: { "width": 2, "height": 2, title: "github" },
                            contentUrl: 'https://www.github.com',
                            newTab: settingsMenu_2.default.getNewTab()
                        }];
                    service.setConfig(sampleConfiguration);
                }
                if (addSampleWidgets) {
                    addWidgetToGrid(new CTabWidgetTypes.LinkWidget(widgets.length, {
                        width: 1,
                        height: 1,
                        title: "hallo!", url: "https://github.com"
                    }, "rgba(255,255,255,0.5)", "rgba(0,0,0,1)", settingsMenu_2.default.getNewTab()));
                }
            };
            const simpleAdd = function (type, settings, backgroundColor, textColor) {
                addWidgetToGrid(new CTabWidgetTypes.cTabTypeMap[type](widgets.length, settings, backgroundColor, textColor));
            };
            // Define return object
            let service = {
                initialize: initialize,
                saveGrid: saveGrid,
                simpleAdd: simpleAdd,
                debug: debug,
                setConfig: setConfig,
                getConfig: getConfig
            };
            const toggleWidgetColorPicker = (isOpen) => {
                widgetColorPickerOpen = isOpen;
            };
            const noteChanged = () => {
                dirty = true;
            };
            const hasChanges = () => {
                let saved = service.getConfig();
                let current = getDashboardConfig();
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
            const removeWidget = function (id) {
                // Get the outer muuri cell
                let innerId = document.getElementById(id.toString());
                let cell = innerId.parentElement.parentElement;
                if (cell) {
                    // remove from the grid (ui only)
                    grid.remove([cell], { removeElements: true, layout: true });
                    // also remove from widgets, otherwise no changes will be detected on saving.
                    delete widgets[id];
                }
            };
            const addWidgetToGrid = function (widget) {
                let itemElem = document.createElement('div');
                itemElem.innerHTML = widget.widgetTemplate();
                let textColOpen = false;
                itemElem.firstChild.addEventListener('mouseover', () => {
                    if (!widgetColorPickerOpen) {
                        const controlPanel = document.getElementById(`controls-${widget.id}`);
                        const controlDragHandle = document.getElementById(`drag-handle-${widget.id}`);
                        const biggerZIndex = "4";
                        controlPanel.classList.remove('hidden');
                        controlDragHandle.classList.remove('hidden');
                        controlPanel.style.zIndex = biggerZIndex;
                        controlPanel.parentElement.style.zIndex = biggerZIndex;
                        controlPanel.parentElement.parentElement.style.zIndex = biggerZIndex;
                    }
                });
                itemElem.firstChild.addEventListener('mouseout', () => {
                    if (!textColOpen) {
                        const controlPanel = document.getElementById(`controls-${widget.id}`);
                        const controlDragHandle = document.getElementById(`drag-handle-${widget.id}`);
                        const smallerZIndex = "1";
                        controlPanel.style.zIndex = smallerZIndex;
                        controlPanel.parentElement.style.zIndex = smallerZIndex;
                        controlPanel.parentElement.parentElement.style.zIndex = smallerZIndex;
                        controlPanel.classList.add('hidden');
                        controlDragHandle.classList.add('hidden');
                    }
                });
                grid.add(itemElem.firstChild, { index: widget.id });
                new Picker({
                    parent: document.getElementById(`${widget.id}-text-color`),
                    popup: 'right',
                    editor: false,
                    color: widget.textColor || '#000000',
                    onChange: (newCol) => {
                        document.documentElement.style.setProperty(`--${widget.id}-text-color`, newCol.rgbaString);
                        widget.textColor = newCol.rgbaString;
                    },
                    onDone: (newCol) => {
                        widget.textColor = newCol.rgbaString;
                    },
                    onOpen: () => {
                        toggleWidgetColorPicker(true);
                        textColOpen = true;
                    },
                    onClose: () => {
                        toggleWidgetColorPicker(false);
                        textColOpen = false;
                    }
                });
                new Picker({
                    parent: document.getElementById(`${widget.id}-background-color`),
                    popup: 'right',
                    editor: false,
                    color: widget.backgroundColor || '#000000',
                    onChange: (newCol) => {
                        document.documentElement.style.setProperty(`--${widget.id}-background-color`, newCol.rgbaString);
                        let widgetElement = document.getElementById(`${widget.id}`);
                        if (widgetElement) {
                            widgetElement.style.setProperty(`--item-background-color`, newCol.rgbaString);
                            styleElem.innerHTML = `#${widget.id}:before {background-color: ${newCol.rgbaString}`;
                        }
                        widget.backgroundColor = newCol.rgbaString;
                    },
                    onDone: (newCol) => {
                        widget.backgroundColor = newCol.rgbaString;
                    },
                    onOpen: () => {
                        toggleWidgetColorPicker(true);
                        textColOpen = true;
                    },
                    onClose: () => {
                        toggleWidgetColorPicker(false);
                        textColOpen = false;
                    }
                });
                document.getElementById(`delete-${widget.id}`).addEventListener('click', () => removeWidget(widget.id));
                if (widget.type === 'weather') {
                    widget.settings.width = widget.settings.width > 1 ? widget.settings.width : 2;
                    widget.settings.height = widget.settings.height > 1 ? widget.settings.height : 2;
                    widget.settings.city = widget.settings.city ? widget.settings.city : "delft";
                    setTimeout(() => {
                        weatherEl.addWeatherListener(widget, widget.id);
                        document.getElementById(widget.id + '-cityInput').value = widget.settings.city;
                        weatherEl.getWeather(widget.id, widget.settings.city);
                    }, 100);
                }
                widgets.push(widget);
            };
            const getDashboardConfig = function () {
                return widgets.map(widget => widget.getConfig());
            };
            // Loads the user configuration in the dashboard
            const load = function () {
                loadModel();
                loadGrid();
            };
            const loadModel = function () {
                let widgetData = service.getConfig();
                widgets = [];
                widgetData = Array.isArray(widgetData) ? widgetData : [];
                widgets = widgetData.map((widget) => {
                    // what if widget does not have a type
                    return new CTabWidgetTypes.cTabTypeMap[widget.type](widget.id, widget.settings, widget.backgroundColor, widget.textColor);
                });
            };
            const loadGrid = function () {
                // add the widgets to the grid
                for (let key in widgets) {
                    if (widgets.hasOwnProperty(key)) {
                        let widget = widgets[key];
                        addWidgetToGrid(widget);
                    }
                }
            };
            return service;
        }
        // Independent functions
        // From w3 to add clock
        function startTime() {
            let clocks = document.querySelectorAll('.ctab-item-clock');
            if (clocks.length > 0) {
                const todayDate = new Date();
                const timezone = settingsMenu_2.default.getTimezone();
                const today = todayDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZone: timezone,
                    hour12: false
                });
                clocks.forEach(a => a.children[0].innerHTML = today);
                setTimeout(startTime, 500);
            }
        }
        exports.default = grid;
    });
    define("index", ["require", "exports", "gridControls", "settingsMenu"], function (require, exports, gridControls_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        window.browser = (() => {
            return window.browser || window.chrome || window.msBrowser;
        })();
        // The toast box that can be used to show a message to the user.
        const toastBox = document.querySelector("#toast");
        const today = new Date();
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dateField = document.querySelector('#currDate');
        dateField.innerText = `${weekdays[today.getDay()]} ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
        function showToast(message) {
            if (toastBox !== null) {
                toastBox.innerText = message;
                toastBox.classList.remove('hidden');
                setTimeout(() => {
                    toastBox.classList.add("hidden");
                }, 2000);
            }
        }
        let CTabGrid = gridControls_1.default();
        CTabGrid.initialize();
        // Save the grid and show the result to user using toastBox.
        function saveGrid() {
            const saveResult = CTabGrid.saveGrid();
            showToast(saveResult);
        }
        const saveButton = document.querySelector("#saveButton");
        saveButton.addEventListener('click', saveGrid);
        /// Adding Widgets
        const widgetTypeChanger = document.querySelector("#typeDropdown");
        // Show or hide the title and url input fields in the simple add area.
        function widgetTypeFieldVisibilityControl(showTitle, showUrl) {
            const hiddenClassName = "hidden";
            let title = document.querySelector("#addTitle");
            let titleLabel = document.querySelector("#titleLabel");
            let url = document.querySelector("#addUrl");
            let urlLabel = document.querySelector("#urlLabel");
            if (title !== null && titleLabel !== null && url !== null && urlLabel !== null) {
                let titleClassList = title.classList;
                let titleLabelClassList = titleLabel.classList;
                let urlClassList = url.classList;
                let urlLabelClassList = urlLabel.classList;
                if (showTitle) {
                    titleClassList.remove(hiddenClassName);
                    titleLabelClassList.remove(hiddenClassName);
                }
                else {
                    titleClassList.add(hiddenClassName);
                    titleLabelClassList.add(hiddenClassName);
                }
                if (showUrl) {
                    urlClassList.remove(hiddenClassName);
                    urlLabelClassList.remove(hiddenClassName);
                }
                else {
                    urlClassList.add(hiddenClassName);
                    urlLabelClassList.add(hiddenClassName);
                }
            }
        }
        if (widgetTypeChanger !== null) {
            widgetTypeChanger.addEventListener('change', () => {
                const curVal = widgetTypeChanger.value;
                if (curVal === "link") {
                    widgetTypeFieldVisibilityControl(true, true);
                }
                if (curVal === "buienradar") {
                    widgetTypeFieldVisibilityControl(false, false);
                }
                if (curVal === "clock") {
                    widgetTypeFieldVisibilityControl(false, false);
                }
                if (curVal === "note") {
                    widgetTypeFieldVisibilityControl(true, false);
                }
                if (curVal === "weather") {
                    widgetTypeFieldVisibilityControl(false, false);
                }
            });
        }
        // New Add button
        const addMenu = document.querySelector('#addMenu');
        const floatingAddButton = document.querySelector('#floatingAddButton');
        const addCancelButton = document.querySelector('#addCancelButton');
        const widgetAddButton = document.querySelector('#widgetAddButton');
        // Add the configured widget to the dashboard
        function addWidget() {
            let title = document.querySelector("#addTitle");
            let url = document.querySelector("#addUrl");
            let bgcolor = document.querySelector('#addBGC');
            let textcolor = document.querySelector('#addTC');
            if (title !== null && url !== null && bgcolor !== null && textcolor !== null && widgetTypeChanger !== null && (title.value !== "" || widgetTypeChanger.value === "clock" || widgetTypeChanger.value === "weather" || widgetTypeChanger.value === "buienradar")) {
                CTabGrid.simpleAdd(widgetTypeChanger.value, { width: 1, height: 1 }, bgcolor.value, textcolor.value);
                title.value = "";
                url.value = "";
                // Trigger hiding of the add window
                if (addCancelButton !== null) {
                    addCancelButton.click();
                }
            }
            else {
                showToast("Unable to add widget: A title is required.");
            }
        }
        if (addMenu !== null) {
            addMenu.classList.add('hidden');
        }
        if (widgetAddButton !== null && floatingAddButton !== null && addMenu !== null && addCancelButton !== null) {
            widgetAddButton.addEventListener('click', addWidget);
            floatingAddButton.addEventListener('click', () => {
                floatingAddButton.classList.add('hidden');
                addMenu.classList.remove('hidden');
            });
            addCancelButton.addEventListener('click', () => {
                floatingAddButton.classList.remove('hidden');
                addMenu.classList.add('hidden');
            });
        }
        // Accept the 'Enter' key as alternative to clicking on the 'Add' button with the mouse, when interacting with the 'addMenu'.
        // Doesn't work for the background/text backgroundColor selectors as the browser seems to override the 'Enter' key for it (i.e. opens the backgroundColor palette).
        ['#typeDropdown', '#addTitle', '#addUrl', '#widgetAddButton'].forEach((item) => {
            const itemElem = document.querySelector(item);
            if (itemElem !== null) {
                itemElem.addEventListener('keydown', (e) => {
                    if (e.key === "Enter") {
                        addWidget();
                    }
                });
            }
        });
        /// Dev mode
        const devConfigBox = document.querySelector("#devConfig");
        const clearButton = document.querySelector("#clearButton");
        const debugButton = document.querySelector("#debugButton");
        const backupButton = document.querySelector("#backupButton");
        const devEnabledCheckbox = document.querySelector("#devEnabled");
        const devOpacityButton = document.querySelector("#opacityButton");
        const configField = document.querySelector("#configFieldInput");
        const devSaveButton = document.querySelector("#saveDevConfig");
        //TODO: const loadBackupButton: HTMLButtonElement | null = document.querySelector('#loadBackupButton');
        // Show or hide developer mode specific buttons
        function devSwitch(displayStyle) {
            if (devConfigBox && clearButton && debugButton) {
                devConfigBox.style.display = displayStyle;
                devConfigBox.classList.remove("hidden");
                clearButton.style.display = displayStyle;
                debugButton.style.display = displayStyle;
            }
            // document.querySelector("#widescreenButton").style.display = displayStyle;
        }
        // disable dev mode by default
        devSwitch('none');
        clearButton.addEventListener('click', () => CTabGrid.debug(true, false));
        debugButton.addEventListener('click', () => CTabGrid.debug(false, true));
        backupButton.addEventListener('click', saveCurrentConfig);
        devEnabledCheckbox.addEventListener('change', (a) => {
            if (a !== null && a.srcElement !== null)
                if (a.srcElement.checked) {
                    devSwitch('block');
                }
                else {
                    devSwitch('none');
                }
        });
        devSaveButton.addEventListener('click', () => {
            let config = JSON.parse(configField.value);
            CTabGrid.setConfig(config);
        });
        devOpacityButton.addEventListener('click', () => {
            let config = configField.value;
            configField.value = config.replace(/(backgroundColor":"rgba\([0-9]+,[0-9]+,[0-9]+,)([0-9.]+)((?=\)"))/gm, "$1 0.5$3");
        });
        configField.value = prettyPrintConfig(CTabGrid.getConfig());
        const streamSaver = window.steamSaver;
        function saveCurrentConfig() {
            const fileStream = streamSaver.createWriteStream('config.json');
            const writer = fileStream.getWriter();
            const encoder = new TextEncoder;
            let data = JSON.stringify(CTabGrid.getConfig());
            let uint8array = encoder.encode(data + "\n\n");
            writer.write(uint8array);
            writer.close();
        }
        function prettyPrintConfig(config) {
            if (config) {
                let result = "[";
                for (let i = 0; i < config.length; i++) {
                    result += i === 0 ? "\n\t" : ",\n\t";
                    result += JSON.stringify(config[i]);
                }
                return result + "\n]";
            }
            return "";
        }
        /// Chrome extension specific
        try {
            window.browser.commands.onCommand.addListener(saveGrid);
            window.browser.bookmarks.onCreated.addListener(function (id, bookmark) {
                console.log("id", id);
                console.log("bookmark", bookmark);
                CTabGrid.simpleAdd("LinkWidget", { width: 1, height: 1, title: bookmark.title, url: bookmark.url }, "#fff", "#000");
            });
        }
        catch (e) {
            // not on chrome
            console.log("Did not execute chrome extension specific code");
        }
    });
    //# sourceMappingURL=index.js.map
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            const dependencies = ['exports'];
            const factory = (exports) => {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch (_a) {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies, factory };
        }
    }
    const instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        const define = get_define(name);
        instances[name] = {};
        const dependencies = define.dependencies.map(name => resolve(name));
        define.factory(...dependencies);
        const exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports.default : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve(entry[0]);
    }
})();