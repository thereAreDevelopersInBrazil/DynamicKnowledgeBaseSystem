import { AResource } from "../entities/resources/AResource";
import { Article } from "../entities/resources/Article";
import { Pdf } from "../entities/resources/Pdf";
import { Video } from "../entities/resources/Video";
import { Resources } from "../schemas";


type ResourceConstructor<T extends Resources.Types> = new (props: Resources.Shape<T>) => AResource<T>;

const strategy: {
    [K in Resources.Types]: ResourceConstructor<K>;
} = {
    Article: Article as unknown as ResourceConstructor<'Article'>,
    Pdf: Pdf as unknown as ResourceConstructor<'Pdf'>,
    Video: Video as unknown as ResourceConstructor<'Video'>,
};

export function buildResource<T extends Resources.Types>(props: Resources.Shape<T>): AResource<T> {
    const Concrete = strategy[props.type];
    return new Concrete(props);
}