import { AEntity } from "../abstracts/AEntity";
import { Topics } from "../../schemas";

export class Topic extends AEntity {

    private name: string;
    private content?: string | null;
    private version?: number | null;
    private parentTopicId: number | null;
    private parent: Topic | null = null;
    private children: Topic[] = [];


    constructor(topic: Topics.Shape) {
        super(topic);
        this.name = topic.name;
        this.content = topic.content;
        this.version = topic.version;
        this.parentTopicId = topic.parentTopicId;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getContent(): string | undefined | null {
        return this.content;
    }

    public setContent(content: string | undefined | null): void {
        this.content = content;
    }

    public getVersion(): number | undefined | null {
        return this.version;
    }

    public setVersion(version: number | undefined | null): void {
        this.version = version;
    }

    public getParentTopicId(): number | null {
        return this.parentTopicId;
    }

    public setParentTopicId(parentTopicId: number | null): void {
        this.parentTopicId = parentTopicId;
    }

    public getParent(): Topic | null {
        return this.parent;
    }

    public setParent(parent: Topic | null): void {
        this.parent = parent;
    }

    public getChildren(): Topic[] {
        return this.children;
    }

    public setChildren(children: Topic): void {
        this.children.push(children);
    }


    public toJSON(): object {
        return {
            id: this.getId(),
            name: this.getName(),
            content: this.getContent(),
            version: this.getVersion(),
            parentTopicId: this.getParentTopicId(),
            createdAt: this.getCreatedAt(),
            updatedAt: this.getUpdatedAt(),
            ...(this.parent ? { parent: this.parent.toJSON() } : {}),
            children: this.children.map(child => child.toJSON()),
            
        };
    }
}