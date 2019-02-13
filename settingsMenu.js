// import Picker from './node_modules/vanilla-picker/dist/vanilla-picker.mjs';

let CTabSettings = () => {
    let settings = {};
    const settingsToggleButton = document.getElementById('settings-toggle');
    const settingsPaneDiv = document.getElementById('settingsMenu');
    const backgroundImg = document.getElementById('background');
    const bgUrlVal = document.getElementById('background-url-value');

    const weatherTimeoutInput = document.getElementById('weather-timeout');

    let settingsActive = false;
    const backgroundApplyButton = document.getElementById('background-apply');
    const settingsMainSaveButton = document.getElementById('settings-main-save-button');
    const unsavedChangesWarningCheckbox = document.getElementById('unsaved-changes-warning');
    const openInNewTabCheckbox = document.getElementById('link-new-tab');
    const weatherAPIKeyInput = document.getElementById('weather-API-key');
    let currentSettings = JSON.parse(window.localStorage.getItem('CTab-settings')) || {};


    settings.initialize = function () {
        // Color pickers
        new Picker({
            parent: document.getElementById('widget-border-color'),
            popup: 'bottom', // 'right'(default), 'left', 'top', 'bottom'
            editor: true,
            color: currentSettings.borderColor,
            onChange: (newCol) => {
                document.documentElement.style.setProperty('--widget-border-color', newCol.rgbaString);
                currentSettings.borderColor = newCol.rgbaString;
            },
            onDone: (newCol) => {
                currentSettings.borderColor = newCol.rgbaString;
                save();
            }
        });

        new Picker({
            parent: document.getElementById('background-color-picker'),
            popup: 'bottom', // 'right'(default), 'left', 'top', 'bottom'
            editor: true,
            color: currentSettings.backgroundColor,
            onChange: (newCol) => {
                document.documentElement.style.setProperty('--background-color', newCol.rgbaString);
                currentSettings.backgroundColor = newCol.rgbaString;
            },
            onDone: (newCol) => {
                currentSettings.backgroundColor = newCol.rgbaString;
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
    };

    settings.initialize();

    function getBackgroundSetting() {
        let selectedBackgroundOption;
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
                File.prototype.convertToBase64 = function (callback) {
                    let reader = new FileReader();
                    reader.onloadend = function (e) {
                        callback(e.target.result, e.target.error);
                    };
                    reader.readAsDataURL(this);
                };

                let selectedFile = document.getElementById("background-file-value").files[0];
                // check if a file is selected
                if (selectedFile) {
                    selectedFile.convertToBase64(function (base64) {
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

    settings.getWeatherTimeoutValue = function () {
        return currentSettings.weatherTimeout * 1000;
    };

    settings.getWeatherAPIKey = function () {
        return currentSettings.weatherAPIKey;
    };

    settings.getShowUnsavedWarning = function () {
        return currentSettings.unsavedChangesWarningEnabled;
    };

    settings.getNewTab = function () {
        return currentSettings.openInNewTab;
    };

    return settings;
};

export {CTabSettings};
