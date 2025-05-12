import { AResource } from "./AResource";
import { Resources } from "../../schemas";

export class Video extends AResource<'Video'> {

    constructor(video: Resources.Shape<'Video'>) {
        super(video);
    }

    public getDuration(): string {
        return this.props.details.duration;
    }

    public setDuration(duration: string): void {
        this.props.details.duration = duration;
    }

    public toJson(): object {
        return {
            id: this.getId(),
            url: this.getUrl(),
            description: this.getDescription(),
            type: this.getType(),
            ...(this.getDuration() ? { duration: this.getDuration() } : { details: this.getDetails() }),
            createdAt: this.getCreatedAt(),
            updatedAt: this.getUpdatedAt()
        };
    }
}