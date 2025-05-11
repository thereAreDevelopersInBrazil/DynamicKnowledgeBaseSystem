import { AResource } from "../entities/resources/AResource";
import { Article } from "../entities/resources/Article";
import { Pdf } from "../entities/resources/Pdf";
import { Video } from "../entities/resources/Video";
import { Resources, Users } from "../schemas";

type Constructor = new (props: Resources.Shape) => AResource;

const strategy: Record<string, Constructor> = {
    "Video": Video,
    "Article": Article,
    "Pdf": Pdf,
};

export function factory(props: Resources.Shape) {
    const concreteClass = strategy[props.type];

    if (!concreteClass) {
        throw new Error(`Unsupported resource type: ${props.type}`);
    }

    return new concreteClass(props)
}