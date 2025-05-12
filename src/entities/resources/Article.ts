import { AResource } from "./AResource";
import { Resources } from "../../schemas";

export class Article extends AResource<'Article'> {

    constructor(article: Resources.Shape<'Article'>) {
        super(article);
    }

    public getPublicationDate(): string {
        return this.props.details.publicationDate;
    }

    public setPublicationDate(publicationDate: string): void {
        this.props.details.publicationDate = publicationDate;
    }

    public toJson(): object {
        return {
            id: this.getId(),
            url: this.getUrl(),
            description: this.getDescription(),
            type: this.getType(),
            ...(this.getPublicationDate() ? { publicationDate: this.getPublicationDate() } : { details: this.getDetails() }),
            createdAt: this.getCreatedAt(),
            updatedAt: this.getUpdatedAt()
        };
    }
}