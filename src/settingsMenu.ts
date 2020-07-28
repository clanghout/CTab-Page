import vanillaPicker from "vanilla-picker";

interface CTabSettingsMenu {
    initialize: () => void;
    getWeatherTimeoutValue: () => number;
    getTimezone: () => string;
    getWeatherAPIKey: () => string;
    getShowUnsavedWarning: () => boolean;
    getNewTab: () => boolean;
    getAddWidgetOnBookmarkIsDisabled: () => boolean;
    getExperimentalFeatures: () => boolean;
    getMuuriFillgaps: () => boolean;
}

function CTabSettings(): CTabSettingsMenu {
    const settingsToggleButton: HTMLButtonElement | null = document.querySelector("#settings-toggle");
    const settingsPaneDiv: HTMLDivElement | null = document.querySelector("#settingsMenu");
    const backgroundImg: HTMLImageElement | null = document.querySelector("#background");
    const bgUrlVal: HTMLInputElement | null = document.querySelector("#background-url-value");
    const modalBackdrop: HTMLDivElement | null = document.querySelector("#modal-backdrop");

    const weatherTimeoutInput: HTMLInputElement | null = document.querySelector("#weather-timeout");

    let settingsActive: boolean = false;
    const backgroundApplyButton: HTMLButtonElement | null = document.querySelector(
        "#background-apply");
    const settingsMainSaveButton: HTMLButtonElement | null = document.querySelector(
        "#settings-main-save-button");
    const unsavedChangesWarningCheckbox: HTMLInputElement | null = document.querySelector(
        "#unsaved-changes-warning");
    const openInNewTabCheckbox: HTMLInputElement | null = document.querySelector("#link-new-tab");
    const disableAddWidgetOnBookmarkCheckbox: HTMLInputElement | null = document.querySelector(
        "#disable-bookmarking-adds-widget");
    const weatherAPIKeyInput: HTMLInputElement | null = document.querySelector("#weather-API-key");
    const timezoneSelect: HTMLSelectElement | null = document.querySelector("#timezone-select");
    const experimentalFeaturesCheckbox: HTMLInputElement | null = document.querySelector(
        "#epxerimental-features-checkbox");
    const muuriFillgaps: HTMLInputElement | null = document.querySelector("#muuri-fillgaps");
    let currentSettings = JSON.parse(window.localStorage.getItem("CTab-settings") ?? '{}');


    function initialize(): void {
        // Color pickers

        new vanillaPicker({
            parent: document.getElementById("widget-border-color")!,
            popup: "bottom", // "right"(default), "left", "top", "bottom"
            editor: true,
            color: currentSettings.borderColor || "#02151a40",
            onChange: (newColor) => {
                document.documentElement.style.setProperty("--widget-border-color",
                    newColor.rgbaString);
                currentSettings.borderColor = newColor.rgbaString;
            },
            onDone: (newColor) => {
                currentSettings.borderColor = newColor.rgbaString;
                save();
            }
        });

        new vanillaPicker({
            parent: document.getElementById("background-color-picker")!,
            popup: "bottom", // "right"(default), "left", "top", "bottom"
            editor: true,
            color: currentSettings.backgroundColor || "#6abbd0ff",
            onChange: (newColor) => {
                document.documentElement.style.setProperty("--background-color",
                    newColor.rgbaString);
                currentSettings.backgroundColor = newColor.rgbaString;
            },
            onDone: (newColor) => {
                currentSettings.backgroundColor = newColor.rgbaString;
                save();
            }
        });

        document.documentElement.style.setProperty("--widget-border-color",
            currentSettings.borderColor);

        backgroundImg!.src = currentSettings.background;
        if(typeof currentSettings.backgroundRadioSelected === "number") {
            (<HTMLInputElement>document.getElementsByName("background")[currentSettings.backgroundRadioSelected]).checked = true;
            if(currentSettings.backgroundRadioSelected === 2) {
                bgUrlVal!.value = currentSettings.background || "#6abbd0ff";
            }
        }

        unsavedChangesWarningCheckbox!.checked = currentSettings.unsavedChangesWarningEnabled
            || false;
        unsavedChangesWarningCheckbox!.addEventListener("click", () => {
            currentSettings.unsavedChangesWarningEnabled = unsavedChangesWarningCheckbox!.checked;
            save();
        });

        openInNewTabCheckbox!.checked = currentSettings.openInNewTab || false;
        openInNewTabCheckbox!.addEventListener("click", () => {
            currentSettings.openInNewTab = openInNewTabCheckbox!.checked;
            save();
        });

        disableAddWidgetOnBookmarkCheckbox!.checked = currentSettings.disableAddWidgetOnBookmark
            || false;
        disableAddWidgetOnBookmarkCheckbox!.addEventListener("click", () => {
            currentSettings.disableAddWidgetOnBookmark = disableAddWidgetOnBookmarkCheckbox!.checked;
            save();
        });

        weatherAPIKeyInput!.value = currentSettings.weatherAPIKey || "";
        weatherAPIKeyInput!.addEventListener("change", () => {
            currentSettings.weatherAPIKey = weatherAPIKeyInput!.value;
            save();
        });


        // weather timeout
        weatherTimeoutInput!.value = currentSettings.weatherTimeout || 60 * 15;
        weatherTimeoutInput!.addEventListener("change", () => {
            currentSettings.weatherTimeout = weatherTimeoutInput!.value;
            save();
        });

        // Timezone
        timezoneSelect!.selectedIndex = currentSettings.timezoneIndex || 374; //default to Europe/Amsterdam
        timezoneSelect!.addEventListener("change", () => {
            currentSettings.timezone = timezoneSelect!.options[timezoneSelect!.selectedIndex].innerText;
            currentSettings.timezoneIndex = timezoneSelect!.selectedIndex;
            save();
        });
        muuriFillgaps!.checked = currentSettings.muuriFillgaps || false;
        muuriFillgaps!.addEventListener("click", () => {
            currentSettings.muuriFillgaps = muuriFillgaps!.checked;
            save();
        });
        // experimental features check
        experimentalFeaturesCheckbox!.checked = currentSettings.experimentalFeatures || false;
        experimentalFeaturesCheckbox!.addEventListener("change", () => {
            currentSettings.experimentalFeatures = experimentalFeaturesCheckbox!.checked;
            save();
        });
    }

    function getBackgroundSetting(): void {
        let selectedBackgroundOption: string = "";
        let backgroundOptions: NodeListOf<HTMLElement> | null = document.getElementsByName(
            "background");
        for(let i = 0, length = backgroundOptions.length; i < length; i++) {
            if((<HTMLInputElement>backgroundOptions[i]).checked) {
                selectedBackgroundOption = (<HTMLInputElement>backgroundOptions[i]).value;
                currentSettings.backgroundRadioSelected = i;
                break;
            }
        }

        switch(selectedBackgroundOption) {
            case "file": {
                function convertToBase64(file: File,
                    callback: (result: string | ArrayBuffer | null,
                        error: DOMException | null) => void) {
                    let reader = new FileReader();
                    reader.onloadend = function () {
                        callback(reader.result, reader.error);
                    };
                    reader.readAsDataURL(file);
                }

                const backgroundFileInput: HTMLInputElement | null = document.querySelector(
                    "#background-file-value");
                let selectedFile = backgroundFileInput!.files![0];
                // check if a file is selected
                if(selectedFile) {
                    convertToBase64(selectedFile, function (base64) {
                        currentSettings.background = base64;
                        backgroundImg!.src = currentSettings.background;
                    });
                }
                break;
            }
            case "url": {
                currentSettings.background = bgUrlVal!.value;
                break;
            }
            case "color": {
                currentSettings.background = "";
                break;
            }
            case "random":
            default: {
                currentSettings.background = "https://source.unsplash.com/random/1920x1080";
                break;
            }
        }
        backgroundImg!.src = currentSettings.background;
        save();
    }

    function save(): void {
        window.localStorage.setItem("CTab-settings", JSON.stringify(currentSettings));
    }


    settingsMainSaveButton!.addEventListener("click", () => {
        save();
    });
    backgroundApplyButton!.addEventListener("click", () => {
        getBackgroundSetting();
        // reload to let gridcontrols use new settings;
    });

    settingsToggleButton!.addEventListener("click", () => settingsToggle());


    function settingsToggle(): void {
        settingsActive = !settingsActive;
        settingsActive ? settingsPaneDiv!.classList.remove("hidden") : settingsPaneDiv!.classList.add(
            "hidden");
        settingsActive ? modalBackdrop!.classList.remove("hidden") : modalBackdrop!.classList.add(
            "hidden");
        settingsActive ? modalBackdrop!.addEventListener("click",
            settingsToggle) : modalBackdrop!.removeEventListener("click", settingsToggle);
    }

    function getWeatherTimeoutValue(): number {
        return currentSettings.weatherTimeout * 1000;
    }

    function getTimezone() {
        return currentSettings.timezone;
    }

    function getWeatherAPIKey() {
        return currentSettings.weatherAPIKey;
    }

    function getShowUnsavedWarning() {
        return currentSettings.unsavedChangesWarningEnabled;
    }

    function getNewTab() {
        return currentSettings.openInNewTab;
    }

    function getAddWidgetOnBookmarkIsDisabled() {
        return currentSettings.disableAddWidgetOnBookmark;
    }

    function getExperimentalFeatures() {
        return currentSettings.experimentalFeatures;
    }

    function getMuuriFillgaps() {
        return currentSettings.muuriFillgaps;
    }

    return {
        initialize: initialize,
        getWeatherTimeoutValue: getWeatherTimeoutValue,
        getTimezone: getTimezone,
        getWeatherAPIKey: getWeatherAPIKey,
        getShowUnsavedWarning: getShowUnsavedWarning,
        getNewTab: getNewTab,
        getAddWidgetOnBookmarkIsDisabled: getAddWidgetOnBookmarkIsDisabled,
        getExperimentalFeatures: getExperimentalFeatures,
        getMuuriFillgaps: getMuuriFillgaps,
    };
}

export default CTabSettings();
