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
export default CTabSettings();
//# sourceMappingURL=settingsMenu.js.map