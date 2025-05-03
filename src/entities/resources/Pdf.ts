import { AResource } from "./AResource";
import { Resources } from "../../schemas";

export class Pdf extends AResource {
    constructor(pdf: Resources.Shape) {
        super(pdf);
    }

    public print(): void {

    }
}