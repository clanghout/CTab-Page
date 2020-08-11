import {WidgetElement} from "./widgetElement";
import {Item} from "muuri";

export class WidgetCollection {
    constructor(public collection: Array<Widget>) {}

    static empty(): WidgetCollection {
        return new WidgetCollection([]);
    }

    push(widget: Widget) {
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

    getWidgetElements(): Array<WidgetElement> {
        return this.collection.map((val) => {
            return val.widgetElement
        })
    }

    getWidgetForId(searchId: string): Widget | undefined {
        return this.collection.find((item) => {
            return item.getWidgetId() == searchId;
        })
    }
}

export class Widget {

    constructor(public item: Item, public widgetElement: WidgetElement){}

    getWidgetId(): string {
        return this.widgetElement.id;
    }
}
