import { AEntity } from "../abstracts/AEntity";
import { Resources } from "../../schemas";

export abstract class AResource extends AEntity {
    protected topicId: number;
    protected url: string;
    protected description: string;
    protected type: Resources.Types;

    constructor(resource: Resources.Shape) {
        super(resource);
        this.topicId = resource.topicId;
        this.url = resource.url;
        this.description = resource.description;
        this.type = resource.type;
    }

    public getTopicId(): number {
        return this.topicId;
    }

    public setTopicId(topicId: number): void {
        this.topicId = topicId;
    }

    public getUrl(): string {
        return this.url;
    }

    public setUrl(url: string): void {
        this.url = url;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public getType(): Resources.Types {
        return this.type;
    }

    public setType(type: Resources.Types): void {
        this.type = type;
    }
}