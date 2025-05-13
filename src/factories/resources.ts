import { HTTPSTATUS } from "../constants/http";
import { AResource } from "../entities/resources/AResource";
import { Article } from "../entities/resources/Article";
import { Pdf } from "../entities/resources/Pdf";
import { Video } from "../entities/resources/Video";
import { ExpectedError } from "../errors";
import { getById, getByUrl } from "../repositories/resources";
import { Resources } from "../schemas";
import { createResource } from "../services/resources";
import { WarningExposedResponse } from "../types";
import { isResourceShape } from "../utils/resources";


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

export async function buildResourcesFromMixed(resources: Resources.RequestsShape): Promise<WarningExposedResponse> {
    const built: AResource<Resources.Types>[] = [];
    const warnings: string[] = [];
    for (const resource of resources) {
        if (typeof resource === 'number') {
            const result = await getById(resource);
            if (!result) {
                warnings.push(`There is no resource with id ${resource}, it will be ignored!`);
                continue;
            }
            built.push(result);
        } else if (isResourceShape(resource)) {
            const entity = buildResource(resource);
            if (entity.getId()) {
                built.push(entity);
                continue;
            }

            try {
                const same = await getByUrl(entity.getUrl());
                if (same) {
                    warnings.push(`The resource id ${same.getId()} is already registered with the URL ${same.getUrl()} and will be used instead of creating a new one!`);
                    built.push(same);
                    continue;
                }
                const result = await createResource(entity);
                if (result) {
                    built.push(result);
                    continue;
                }
            } catch (error) {
                if (error instanceof ExpectedError) {
                    warnings.push(error.message);
                } else {
                    warnings.push(`Unexpected error while creating resources attached to the topic! Details: ${error}`);
                }
            }

        }
    }
    return {
        response: built,
        warnings
    };
}