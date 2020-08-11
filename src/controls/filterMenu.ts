import  {WidgetElement} from "../widgets/widgetElement";
import Grid from "muuri";

interface Tags {
    getEnabled(): Array<string>;

    getAvailable(): Array<string>;

    setAvailableAll(): void;

    setEnabled(tagNames: Array<string>): void;
}

class Tags implements Tags {
    private allTags: Set<string> = new Set();
    private enabledTags: Set<string> = new Set();

    constructor(private widgets: Array<WidgetElement>) {

    }

    // return all tags which are linked to widgets which the user wants to keep
    getEnabled(): Array<string> {
        return [...this.enabledTags];
    }

    // Get all unique available tags which are part of the grid.
    // A tag is "available" if any widget specifies a the tag name.
    getAvailable(): Array<string> {
        this.setAvailableAll();
        return [...this.allTags]
    }

    // Add all unique tags which are part of the grid to the "available tags" set.
    setAvailableAll(): void {
        this.allTags = new Set();
        this.widgets.forEach(vi => {
            vi.settings.tags.forEach(vj => {
                this.allTags.add(vj)
            });
        });
    }

    // Set the given tags as user enabled.
    setEnabled(toBeEnabled: Array<string>): void {
        this.enabledTags = new Set();
        toBeEnabled.forEach(tagName => {
            this.enabledTags.add(tagName);
        });
    }
}

export default class TagFilterMenu {
    filterMenuActive: boolean = false;
    tagData: Tags;

    constructor(widgets: Array<WidgetElement>, readonly grid: Grid) {
        this.tagData = new Tags(widgets);
        this.updateAvailableTagList();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelector("#filter-menu-save-button")!.addEventListener("click", () => this.updateGridOnSave());
        document.querySelector("#filter-menu-toggle")!.addEventListener("click", () => this.filterMenuToggle());
    }

    updateAvailableTagList() {
        function template(name: string): string {
            return `<div class="filter-menu-tag-list-item"><label><input type="checkbox" class="filter-menu-tag-checkbox" data-tag-checkbox-name="${name}">${name}</label></div>`;
        }

        function mkCheckboxes(tags: Array<string>): string {
            return tags.map(tag => template(tag)).join("");
        }

        let tagList = document.querySelector("#filter-menu-tag-list");
        tagList!.innerHTML = mkCheckboxes(this.tagData!.getAvailable());
    }

    // Check the filter list for tags which a user wants to keep (i.e. widgets which include the tag should be shown)
    // Returns the amount of selected tags.
    public updateEnabledTagList(): number {
        let checkboxes = document.querySelectorAll(".filter-menu-tag-checkbox");

        let checks: Array<string> = [];
        checkboxes.forEach(elem => {
            let checkbox: HTMLInputElement | null = elem as HTMLInputElement;
            let attr: string | null = checkbox.getAttribute("data-tag-checkbox-name");

            if (checkbox.checked && attr) {
                checks.push(attr)
            }
        });

        this.tagData!.setEnabled(checks);

        return checks.length;
    }

    updateGridOnSave(): void {
        let amountOfTagsSelected: number = this.updateEnabledTagList();

        // if no checkboxes are selected, we want to show all items on the grid.
        let showAll: boolean = amountOfTagsSelected <= 0;

        this.filterGridByTags(showAll);
    }


    // This function uses the enabled tag list to show/hide widgets within the grid.
    filterGridByTags(showAll: boolean): void {
        if (showAll) {
            let items = this.grid.getItems();
            this.grid.show(items);
            return;
        }

        let toBeEnabled: Array<string> = this.tagData!.getEnabled();
        let shows = this.grid.getItems().filter((item) => {
            let elem = item.getElement();
            let tags = elem!.getAttribute("data-tags")!.split(",");

            return tags.length > 0 && tags.some((tag) => toBeEnabled.includes(tag));
        });

        let hides = this.grid.getItems().filter((item) => {
            return !shows.includes(item);
        });

        this.grid.show(shows);
        this.grid.hide(hides);
    }

    // open/close filter menu
    filterMenuToggle(): void {
        let filterMenuPaneDiv = document.querySelector("#filter-menu");
        let modalBackdrop = document.querySelector("#modal-backdrop");

        this.filterMenuActive = !this.filterMenuActive;
        this.filterMenuActive ? filterMenuPaneDiv!.classList.remove("hidden") : filterMenuPaneDiv!.classList.add("hidden");
        this.filterMenuActive ? modalBackdrop!.classList.remove("hidden") : modalBackdrop!.classList.add("hidden");
        this.filterMenuActive ? modalBackdrop!.addEventListener("click", this.filterMenuToggle)
            : modalBackdrop!.removeEventListener("click", this.filterMenuToggle);
    }
}

