import { AEntity } from "../abstracts/AEntity";
import { Topics } from "../../schemas";

export class Topic extends AEntity {

    private name: string;
    private content?: string;
    private version?: number;
    private parent?: Topic | null;


    constructor(topic: Topics.Shape) {
        super(topic);
        this.name = topic.name;
        this.content = topic.content;
        this.version = topic.version;
        this.parent = topic.parent ? new Topic(topic.parent) : null;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getContent(): string | undefined {
        return this.content;
    }

    public setContent(content: string | undefined): void {
        this.content = content;
    }

    public getVersion(): number | undefined {
        return this.version;
    }

    public setVersion(version: number | undefined): void {
        this.version = version;
    }

    public getParent(): Topic | null | undefined {
        return this.parent;
    }

    public setParent(parent: Topic | null | undefined): void {
        this.parent = parent;
    }
}