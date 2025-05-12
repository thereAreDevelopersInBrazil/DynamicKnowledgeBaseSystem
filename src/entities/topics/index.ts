import { AEntity } from "../abstracts/AEntity";
import { Topics } from "../../schemas";

export class Topic extends AEntity {

    protected props: Omit<Topics.Shape, 'parent' | 'children'> & {
        parent: Topic | null;
        children: Topic[];
    };

    constructor(props: Topics.Shape) {
        super(props);

        this.props = {
            ...props,
            parent: props.parent ? new Topic(props.parent) : null,
            children: (props.children ?? []).map(child => new Topic(child))
        };
    }

    public getName(): string {
        return this.props.name;
    }

    public setName(name: string): void {
        this.props.name = name;
    }

    public getContent(): string | undefined | null {
        return this.props.content;
    }

    public setContent(content: string | undefined | null): void {
        this.props.content = content;
    }

    public getVersion(): number | undefined | null {
        return this.props.version;
    }

    public setVersion(version: number | undefined | null): void {
        this.props.version = version;
    }

    public getParentTopicId(): number | null {
        return this.props.parentTopicId;
    }

    public setParentTopicId(parentTopicId: number | null): void {
        this.props.parentTopicId = parentTopicId;
    }

    public getParent(): Topic | null {
        return this.props.parent;
    }

    public setParent(parent: Topic | null): void {
        this.props.parent = parent;
    }

    public getChildren(): Topic[] {
        return this.props.children;
    }

    public setChildren(children: Topic): void {
        this.props.children.push(children);
    }


    public toJson(): object {
        return {
            id: this.getId(),
            name: this.getName(),
            content: this.getContent(),
            version: this.getVersion(),
            parentTopicId: this.getParentTopicId(),
            createdAt: this.getCreatedAt(),
            updatedAt: this.getUpdatedAt(),
            ...(this.props.parent ? { parent: this.props.parent.toJson() } : {}),
            children: this.props.children.map(child => child.toJson()),
        };
    }
}