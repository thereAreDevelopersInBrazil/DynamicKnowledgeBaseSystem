import { AResource } from "./AResource";
import { Resources } from "../../schemas";

export class Video extends AResource {
    constructor(video: Resources.Shape) {
        super(video);
    }

    public play(): void {

    }

    public pause(): void {

    }
}