import settingsMenu from "../controls/settingsMenu";
import muuri, { GridOptions } from "muuri";

export class GridWrapper {


    public grid: muuri;

    constructor(gridIdentifier: string | HTMLElement) {
        this.grid = new muuri(gridIdentifier, this.muuriOptions);
    }

}

