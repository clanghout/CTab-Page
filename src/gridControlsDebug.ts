import CTabGrid from './gridControls'
import CTabSettings from "./settingsMenu";
import {LinkWidget} from './cTabWidgetType';

export {
    debugSetGridToUseSampleConfig,
    debugAddSampleWidgetToGrid
}

function debugSetGridToUseSampleConfig(ctab: CTabGrid): void {
    console.log("using sample config");
    let sampleConfiguration = [
        {
            "settings": {"width": 1, "height": 1},
            "backgroundColor": "rgba(0,0,0,1)",
            "textColor": "rgba(209,20,20,1)",
            "id": 'i0',
            "type": "ClockWidget"
        }];
    ctab.setConfig(sampleConfiguration);
}

function debugAddSampleWidgetToGrid(ctab: CTabGrid): void {
    ctab.addWidgetToGrid(new LinkWidget(new Date().getTime().toString(), {
        width: 1,
        height: 1,
        title: "hallo!", url: "https://github.com",
        newTab: CTabSettings.getNewTab()
    }, "rgba(255,255,255,0.5)", "rgba(0,0,0,1)"));
}