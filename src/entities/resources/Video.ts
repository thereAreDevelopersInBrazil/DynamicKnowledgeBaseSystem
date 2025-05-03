import { AResource } from "./AResource";
import { Resources } from "../../schemas";

export class Video extends AResource {

    /**
     * We also could have Video specific properties like:
     * Duration, format, quality, etc...
    */

    constructor(video: Resources.Shape) {
        super(video);
    }

    /**
     * Because there are no resource type-specific use cases in the current challenge scope,
     * I decided to include those methods for demonstration purposes
     * I did not turn them into interfaces cause differently from users-related interfaces
     * I would not have reuse/multiple implementations of the same interface
     * So it would be useless, overengineering
     * 
    */

    public play(): void {

    }

    public pause(): void {

    }
}