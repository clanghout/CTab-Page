interface CTabSettingsMenu {
    initialize: () => void;
    getWeatherTimeoutValue: () => number;
    getTimezone: () => string;
    getWeatherAPIKey: () => string;
    getShowUnsavedWarning: () => boolean;
    getNewTab: () => boolean;
}
declare const _default: CTabSettingsMenu;
export default _default;
