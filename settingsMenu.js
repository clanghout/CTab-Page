let CTabSettings = () => {
    let settings = {};
    const settingsToggleButton = document.getElementById('settings-toggle');
    const settingsPaneDiv = document.getElementById('settingsMenu');
    const backgroundImg = document.getElementById('background');
// const backgroundDiv = document.getElementById('background-div');
    const bgColVal = document.getElementById('background-color-value');
    const bgUrlVal = document.getElementById('background-url-value');

    const weatherTimeoutInput = document.getElementById('weather-timeout');

    let settingsActive = false;
    const settingsSaveButton = document.getElementById('settings-save');
    let currentSettings = JSON.parse(window.localStorage.getItem('CTab-settings')) || {};


    settings.initialize = function() {
        backgroundImg.src = currentSettings.background;
        backgroundImg.style.backgroundColor = currentSettings.backgroundColor;
        if (typeof currentSettings.backgroundRadioSelected === 'number') {
            document.getElementsByName('background')[currentSettings.backgroundRadioSelected].checked = true;
            if (currentSettings.backgroundRadioSelected === 2) {
                bgUrlVal.value = currentSettings.background;
            }
            if (currentSettings.backgroundRadioSelected === 3) {
                bgColVal.value = currentSettings.backgroundColor;
            }
        }


        // weather timeout
        weatherTimeoutInput.value = currentSettings.weatherTimeout || 60 * 15;
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
                // backgroundDiv.style.backgroundColor = document.getElementById('background-color-value').value;
                backgroundImg.style.backgroundColor = bgColVal.value;
                currentSettings.backgroundColor = backgroundImg.style.backgroundColor;
                break;
            case 'random':
            default:
                currentSettings.background = "https://source.unsplash.com/random/1920x1080";
                break;
        }
        backgroundImg.src = currentSettings.background;
    }


    settingsSaveButton.addEventListener('click', () => {
        getBackgroundSetting();
        window.localStorage.setItem('CTab-settings', JSON.stringify(currentSettings));
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

    return settings;
};

export {CTabSettings};
