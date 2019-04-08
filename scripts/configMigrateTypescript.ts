import {CTabWidgetSerialized} from "../src/cTabWidgetTypeBase";
// @ts-ignore
let fs = require('fs');

const yourCurrSettings: any[] = [{
    "title": "GitHub",
    "contentUrl": "https://www.github.com",
    "settings": {"x": 2, "y": 1, "width": 1, "height": 1, "id": 0, "autoPosition": false},
    "backgroundColor": "rgba(1,1,1,0.5)",
    "textColor": "rgba(0,0,0,1)",
    "id": 0
}, {
    "title": "Youtube",
    "settings": {"x": 0, "y": 5, "width": 1, "height": 1, "id": 0, "autoPosition": false},
    "contentUrl": "https://www.youtube.com",
    "backgroundColor": "rgba(255,0,0,0.5)",
    "textColor": "rgba(0,0,0,1)",
    "id": 1
}, {
    "title": "ctab notes\ntest",
    "settings": {"x": 5, "y": 4, "autoPosition": false, "width": 1, "height": 2},
    "contentUrl": "",
    "backgroundColor": "rgba(0,0,0,0.5)",
    "textColor": "rgba(0,0,0,1)",
    "type": "note",
    "id": 34
}, {
    "title": "weer",
    "settings": {"autoPosition": false, "x": 6, "y": 5, "width": 2, "height": 2, "city": "amsterdam"},
    "contentUrl": "#",
    "backgroundColor": "rgba(255,255,255,0.5)",
    "textColor": "rgba(0,0,0,1)",
    "type": "weather",
    "id": 76
}, {
    "title": "test",
    "settings": {"autoPosition": false, "x": 7, "y": 0, "width": 2, "height": 4},
    "contentUrl": "test",
    "backgroundColor": "rgba(255,255,255,0.5)",
    "textColor": "rgba(0,0,0,1)",
    "type": "buienradar",
    "id": 55
}, {
    "title": "testclock",
    "settings": {"x": 2, "y": 0, "width": 2, "height": 1, "id": 0, "autoPosition": false},
    "contentUrl": "",
    "backgroundColor": "rgba(0,0,0,0.5)",
    "textColor": "rgba(0,0,0,1)",
    "type": "clock",
    "id": 47
}
];


function migrateConfig(oldConfig: any[]): CTabWidgetSerialized[] {
    return oldConfig.map((oldWidget: any) => {
        let settings: any;
        let type = "";
        let backgroundColor = oldWidget.backgroundColor || oldWidget.color || "rgba(255,255,255,0.5)";
        let textColor = oldWidget.textColor || "rgba(0,0,0,1)";
        if (oldWidget.hasOwnProperty("type")) {
            type = findType(oldWidget.type);
        } else {
            type = "LinkWidget";
        }
        settings = {
            width: oldWidget.settings.width || 1,
            height: oldWidget.settings.height || 1
        };
        if (type === "LinkWidget") {
            settings.title = oldWidget.title || "";
            settings.url = oldWidget.contentUrl || "";
        }
        if (type === "NoteWidget") {
            settings.title = oldWidget.title || "";
        }
        if (type === "WeatherWidget") {
            settings.city = oldWidget.settings.city || "dallas";
        }

        let newWidget: CTabWidgetSerialized = {
            id: oldWidget.id || 0,
            type: type,
            settings: settings,
            backgroundColor: backgroundColor,
            textColor: textColor
        };
        return newWidget;
    });
}

function findType(currType: string) {
    if (currType.includes("ote")) {
        return "NoteWidget";
    }
    if (currType.includes('lock')) {
        return "ClockWidget";
    }
    if (currType.includes('uienradar')) {
        return "BuienradarWidget";
    }
    if (currType.includes("eather")) {
        return "WeatherWidget";
    }
    return "LinkWidget";
}

fs.writeFileSync('temp.json', JSON.stringify(migrateConfig(yourCurrSettings)));
