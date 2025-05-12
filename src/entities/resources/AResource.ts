import { AEntity } from "../abstracts/AEntity";
import { Resources } from "../../schemas";

export abstract class AResource<T extends Resources.Types> extends AEntity {
    protected props: Resources.Shape<T>

    constructor(props: Resources.Shape<T>) {
        super(props);
        this.props = props;
    }

    public getUrl(): string {
        return this.props.url;
    }

    public setUrl(url: string): void {
        this.props.url = url;
    }

    public getDescription(): string {
        return this.props.description;
    }

    public setDescription(description: string): void {
        this.props.description = description;
    }
    public getType(): T {
        return this.props.type;
    }

    public setType(type: T): void {
        this.props.type = type;
    }

    public getDetails(): Resources.DetailsMap[T] {
        return this.props.details;
    }

    public setDetails(details: Resources.DetailsMap[T]): void {
        this.props.details = details;
    }

    public toJson(): object {
        return {
            id: this.getId(),
            url: this.getUrl(),
            description: this.getDescription(),
            type: this.getType(),
            details: this.getDetails(),
            createdAt: this.getCreatedAt(),
            updatedAt: this.getUpdatedAt()
        };
    }
}