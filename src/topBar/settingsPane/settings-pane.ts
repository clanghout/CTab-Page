import { customElement, html, LitElement, property } from "lit-element";
import vanillaPicker from "vanilla-picker";

@customElement('settings-pane')
export default class SettingsPane extends LitElement {
    // Declare observed properties
    @property()
    adjective = 'awesome';

    private backgroundImg: HTMLImageElement | null = document.querySelector("#background");
    private bgUrlVal: HTMLInputElement | null = document.querySelector("#background-url-value");

    private weatherTimeoutInput: HTMLInputElement | null = document.querySelector("#weather-timeout");

    private backgroundApplyButton: HTMLButtonElement | null = document.querySelector(
        "#background-apply");
    private settingsMainSaveButton: HTMLButtonElement | null = document.querySelector(
        "#settings-main-save-button");
    private unsavedChangesWarningCheckbox: HTMLInputElement | null = document.querySelector(
        "#unsaved-changes-warning");
    private openInNewTabCheckbox: HTMLInputElement | null = document.querySelector("#link-new-tab");
    private disableAddWidgetOnBookmarkCheckbox: HTMLInputElement | null = document.querySelector(
        "#disable-bookmarking-adds-widget");
    private weatherAPIKeyInput: HTMLInputElement | null = document.querySelector("#weather-API-key");
    private timezoneSelect: HTMLSelectElement | null = document.querySelector("#timezone-select");
    private experimentalFeaturesCheckbox: HTMLInputElement | null = document.querySelector(
        "#experimental-features-checkbox");
    private muuriFillgaps: HTMLInputElement | null = document.querySelector("#muuri-fillgaps");
    private currentSettings = JSON.parse(window.localStorage.getItem("CTab-settings") ?? '{}');

    constructor() {
        super();
        this.backgroundApplyButton!.addEventListener("click", () => {
            this.getBackgroundSetting();
        });
        this.settingsMainSaveButton!.addEventListener("click", () => {
            this.save();
        });


        // Color pickers

        new vanillaPicker({
            parent: document.getElementById("widget-border-color")!,
            popup: "bottom", // "right"(default), "left", "top", "bottom"
            editor: true,
            color: this.currentSettings.borderColor ?? "#02151a40",
            onChange: (newColor) => {
                document.documentElement.style.setProperty("--widget-border-color",
                    newColor.rgbaString);
                this.currentSettings.borderColor = newColor.rgbaString;
            },
            onDone: (newColor) => {
                this.currentSettings.borderColor = newColor.rgbaString;
                this.save();
            }
        });

        new vanillaPicker({
            parent: document.getElementById("background-color-picker")!,
            popup: "bottom", // "right"(default), "left", "top", "bottom"
            editor: true,
            color: this.currentSettings.backgroundColor ?? "#6abbd0ff",
            onChange: (newColor) => {
                document.documentElement.style.setProperty("--background-color",
                    newColor.rgbaString);
                this.currentSettings.backgroundColor = newColor.rgbaString;
            },
            onDone: (newColor) => {
                this.currentSettings.backgroundColor = newColor.rgbaString;
                this.save();
            }
        });

        document.documentElement.style.setProperty("--widget-border-color",
            this.currentSettings.borderColor);

        this.backgroundImg!.src = this.currentSettings.background;
        if(typeof this.currentSettings.backgroundRadioSelected === "number") {
            (<HTMLInputElement>document.getElementsByName("background")[this.currentSettings.backgroundRadioSelected]).checked = true;
            if(this.currentSettings.backgroundRadioSelected === 2) {
                (this.bgUrlVal)!.value = this.currentSettings.background ?? "#6abbd0ff";
            }
        }

        this.unsavedChangesWarningCheckbox!.checked = this.currentSettings.unsavedChangesWarningEnabled
            ?? false;
        this.unsavedChangesWarningCheckbox!.addEventListener("click", () => {
            this.currentSettings.unsavedChangesWarningEnabled = this.unsavedChangesWarningCheckbox!.checked;
            this.save();
        });

        this.openInNewTabCheckbox!.checked = this.currentSettings.openInNewTab ?? false;
        this.openInNewTabCheckbox!.addEventListener("click", () => {
            this.currentSettings.openInNewTab = this.openInNewTabCheckbox!.checked;
            this.save();
        });

        this.disableAddWidgetOnBookmarkCheckbox!.checked = this.currentSettings.disableAddWidgetOnBookmark
            ?? false;
        this.disableAddWidgetOnBookmarkCheckbox!.addEventListener("click", () => {
            this.currentSettings.disableAddWidgetOnBookmark = this.disableAddWidgetOnBookmarkCheckbox!.checked;
            this.save();
        });

        this.weatherAPIKeyInput!.value = this.currentSettings.weatherAPIKey ?? "";
        this.weatherAPIKeyInput!.addEventListener("change", () => {
            this.currentSettings.weatherAPIKey = this.weatherAPIKeyInput!.value;
            this.save();
        });


        // weather timeout
        this.weatherTimeoutInput!.value = this.currentSettings.weatherTimeout ?? 60 * 15;
        this.weatherTimeoutInput!.addEventListener("change", () => {
            this.currentSettings.weatherTimeout = this.weatherTimeoutInput!.value;
            this.save();
        });

        // Timezone
        this.timezoneSelect!.selectedIndex = this.currentSettings.timezoneIndex ?? 374; //default to Europe/Amsterdam
        this.timezoneSelect!.addEventListener("change", () => {
            this.currentSettings.timezone = this.timezoneSelect!.options[this.timezoneSelect!.selectedIndex].innerText;
            this.currentSettings.timezoneIndex = this.timezoneSelect!.selectedIndex;
            this.save();
        });
        this.muuriFillgaps!.checked = this.currentSettings.muuriFillgaps ?? false;
        this.muuriFillgaps!.addEventListener("click", () => {
            this.currentSettings.muuriFillgaps = this.muuriFillgaps!.checked;
            this.save();
        });
        // experimental features check
        this.experimentalFeaturesCheckbox!.checked = this.currentSettings.experimentalFeatures
            ?? false;
        this.experimentalFeaturesCheckbox!.addEventListener("change", () => {
            this.currentSettings.experimentalFeatures = this.experimentalFeaturesCheckbox!.checked;
            this.save();
        });
    }

    private getBackgroundSetting(): void {
        let selectedBackgroundOption: string = "";
        let backgroundOptions: NodeListOf<HTMLElement> | null = document.getElementsByName(
            "background");
        for(let i = 0, length = backgroundOptions.length; i < length; i++) {
            if((<HTMLInputElement>backgroundOptions[i]).checked) {
                selectedBackgroundOption = (<HTMLInputElement>backgroundOptions[i]).value;
                this.currentSettings.backgroundRadioSelected = i;
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
                    convertToBase64(selectedFile, (base64) => {
                        this.currentSettings.background = base64;
                        this.backgroundImg!.src = this.currentSettings.background;
                    });
                }
                break;
            }
            case "url": {
                this.currentSettings.background = this.bgUrlVal!.value;
                break;
            }
            case "color": {
                this.currentSettings.background = "";
                break;
            }
            case "random":
            default: {
                this.currentSettings.background = "https://source.unsplash.com/random/1920x1080";
                break;
            }
        }
        this.backgroundImg!.src = this.currentSettings.background;
        this.save();
    }

    private save(): void {
        window.localStorage.setItem("CTab-settings", JSON.stringify(this.currentSettings));
    }

    public getWeatherTimeoutValue(): number {
        return this.currentSettings.weatherTimeout * 1000;
    }

    public getTimezone() {
        return this.currentSettings.timezone;
    }

    public getWeatherAPIKey() {
        return this.currentSettings.weatherAPIKey;
    }

    public getShowUnsavedWarning() {
        return this.currentSettings.unsavedChangesWarningEnabled;
    }

    public getNewTab() {
        return this.currentSettings.openInNewTab;
    }

    public getAddWidgetOnBookmarkIsDisabled() {
        return this.currentSettings.disableAddWidgetOnBookmark;
    }

    public getExperimentalFeatures() {
        return this.currentSettings.experimentalFeatures;
    }

    public getMuuriFillgaps() {
        return this.currentSettings.muuriFillgaps;
    }

    render() {
        return html`<div>settings pane menu</div>
<div>modal backdrop</div>`;
    }
}
