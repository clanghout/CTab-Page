import {WidgetElement} from "../widgets/widgetElement";
import Grid from "muuri";

interface Tags {
    getEnabled(): Array<string>;
    getAvailable(): Array<string>;
    setAvailableAll(): void;
    setEnabled(tagNames: Array<string>): void;
}

class Tags implements Tags {
constructor(private widgets: Array<WidgetElement>){

}
    private allTags: Set<string> = new Set();
    private enabledTags: Set<string> = new Set();


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

interface CTabTagFilterMenu {
    initialize: (widgets: Array<WidgetElement>, grid: Grid) => void;
    updateAvailableTagList: () => void;
}

function CTabTagFilter(): CTabTagFilterMenu {
    const filterMenuToggleButton: HTMLButtonElement | null = document.querySelector(
        "#filter-menu-toggle");
    const filterMenuPaneDiv: HTMLDivElement | null = document.querySelector("#filter-menu");
    const modalBackdrop: HTMLDivElement | null = document.querySelector("#modal-backdrop");
    const tagListDiv: HTMLDivElement | null = document.querySelector("#filter-menu-tag-list");
    const filterMenuSaveButton: HTMLButtonElement | null = document.querySelector(
        "#filter-menu-save-button");

    // Warning: should only be read from here.
    let refGrid: Grid;

    let filterMenuActive: boolean = false;
    let tagData: Tags | null = null;

// Should always be called before calling other functions.
    function initialize(widgets: Array<WidgetElement>, grid: Grid): void {
        tagData = new Tags(widgets);
        refGrid = grid;
        updateAvailableTagList();
    }

    function updateAvailableTagList(): void {
        function template(name: string): string {
            return `<div class="filter-menu-tag-list-item"><label><input type="checkbox" class="filter-menu-tag-checkbox" data-tag-checkbox-name="${name}">${name}</label></div>`;
        }

        function mkCheckboxes(tags: Array<string>): string {
            return tags.map(tag => template(tag)).join("");
        }

        tagListDiv!.innerHTML = mkCheckboxes(tagData!.getAvailable());
    }

    // Check the filter list for tags which a user wants to keep (i.e. widgets which include the tag should be shown)
// Returns the amount of selected tags.
    function updateEnabledTagList(): number {
        let checkboxes = document.querySelectorAll(".filter-menu-tag-checkbox");

        let checks: Array<string> = [];
        checkboxes.forEach(elem => {
            let checkbox: HTMLInputElement | null = elem as HTMLInputElement;
            let attr: string | null = checkbox.getAttribute("data-tag-checkbox-name");

            if(checkbox.checked && attr) {
                checks.push(attr)
            }
        });

        tagData!.setEnabled(checks);

        return checks.length;
    }

    function updateGridOnSave(): void {
        let amountOfTagsSelected: number = updateEnabledTagList();

        // if no checkboxes are selected, we want to show all items on the grid.
        let showAll: boolean = amountOfTagsSelected <= 0;

        filterGridByTags(showAll);
    }

    filterMenuSaveButton!.addEventListener("click", updateGridOnSave);

// This function uses the enabled tag list to show/hide widgets within the grid.
    function filterGridByTags(showAll: boolean): void {
        if(showAll) {
            refGrid.show(refGrid.getItems());
            return;
        }

        let toBeEnabled: Array<string> = tagData!.getEnabled();
        let shows = refGrid.getItems().filter((item) => {
            let elem = item.getElement();
            let tags = elem!.getAttribute("data-tags")!.split(",");

            return tags.length > 0 && tags.some((tag) => toBeEnabled.includes(tag));
        });

        let hides = refGrid.getItems().filter((item) => {
            return !shows.includes(item);
        });

        refGrid.show(shows);
        refGrid.hide(hides);
    }

    // open/close filter menu
    filterMenuToggleButton!.addEventListener("click", () => filterMenuToggle());

    function filterMenuToggle(): void {
        filterMenuActive = !filterMenuActive;
        filterMenuActive ? filterMenuPaneDiv!.classList.remove("hidden") : filterMenuPaneDiv!.classList.add(
            "hidden");
        filterMenuActive ? modalBackdrop!.classList.remove("hidden") : modalBackdrop!.classList.add(
            "hidden");
        filterMenuActive ? modalBackdrop!.addEventListener("click",
            filterMenuToggle) : modalBackdrop!.removeEventListener("click", filterMenuToggle);
    }

    return {
        initialize: initialize,
        updateAvailableTagList: updateAvailableTagList,
    }
}

export default CTabTagFilter();
