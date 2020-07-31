import {CTabWidgetElement} from "./cTabWidgetTypeBase";
import {Item} from "muuri";

export class WidgetCollection {
    constructor(public collection: Array<CTabWidget>) {}

    static empty(): WidgetCollection {
        return new WidgetCollection([]);
    }

    push(widget: CTabWidget) {
        this.collection.push(widget);
    }

    removeById(id: string): Item | null {
        let index: number = this.collection.findIndex((widget) => {
            return widget.getWidgetId() === id;
        });

        if (index > -1) {
            let item = this.collection[index].item;

            this.collection.splice(index, 1);

            return item;
        }

        return null;
    }

    getWidgetElements(): Array<CTabWidgetElement> {
        return this.collection.map((val) => {
            return val.widgetElement
        })
    }

    getWidgetForId(searchId: string): CTabWidget | undefined {
        return this.collection.find((item) => {
            return item.getWidgetId() == searchId;
        })
    }
}

export class CTabWidget {

    constructor(public item: Item, public widgetElement: CTabWidgetElement){}

    getWidgetId(): string {
        return this.widgetElement.id;
    }
}