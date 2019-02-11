const settingsToggleButton = document.getElementById('settings-toggle');
const settingsPaneDiv = document.getElementById('settingsMenu');
const backgroundImg = document.getElementById('background');
let settingsActive = false;
const settingsSaveButton = document.getElementById('settings-save');
let currentSettings = JSON.parse(window.localStorage.getItem('CTab-settings')) || {};


function initialize() {
    backgroundImg.src = currentSettings.background;
    if (typeof currentSettings.backgroundRadioSelected === 'number') {
        document.getElementsByName('background')[currentSettings.backgroundRadioSelected].checked = true;
    }

}
initialize();

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
            let backgroundUrlValue = document.getElementById('background-url-value').value;
            currentSettings.background = backgroundUrlValue;
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
