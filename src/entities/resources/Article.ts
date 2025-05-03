import { AResource } from "./AResource";
import { Resources } from "../../schemas";

export class Article extends AResource {
    constructor(article: Resources.Shape) {
        super(article);
    }


    public read(): void {

    }
}