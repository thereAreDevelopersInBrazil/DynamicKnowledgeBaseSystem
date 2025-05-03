import { AResource } from "./AResource";
import { Resources } from "../../schemas";

export class Article extends AResource {

    /**
     * We also could have Article specific properties like:
     * Author, Publication Date, etc..
    */

    constructor(article: Resources.Shape) {
        super(article);
    }

    /**
     * Because there are no resource type-specific use cases in the current challenge scope,
     * I decided to include those methods for demonstration purposes
     * I did not turn them into interfaces cause differently from users-related interfaces
     * I would not have reuse/multiple implementations of the same interface
     * So it would be useless, overengineering
     * 
    */

    public read(): void {

    }
}