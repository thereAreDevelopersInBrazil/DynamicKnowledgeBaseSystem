import { AResource } from "./AResource";
import { Resources } from "../../schemas";

export class Pdf extends AResource {

    /**
     * We also could have Pdf specific properties like:
     * File size, last time file was modified, etc...
    */

    constructor(pdf: Resources.Shape) {
        super(pdf);
    }

    /**
     * Because there are no resource type-specific use cases in the current challenge scope,
     * I decided to include those methods for demonstration purposes
     * I did not turn them into interfaces cause differently from users-related interfaces
     * I would not have reuse/multiple implementations of the same interface
     * So it would be useless, overengineering
     * 
    */

    public print(): void {

    }
}