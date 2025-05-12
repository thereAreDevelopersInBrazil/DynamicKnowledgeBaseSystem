import { Abstracts } from '../../schemas';

export abstract class AEntity {

    protected props: Abstracts.Shape;

    constructor(props: Abstracts.Shape) {
        this.props = props;
        const now = new Date().toISOString();
        this.props.createdAt ??= now;
        this.props.updatedAt ??= now;
    }

    getId(): number {
        return this.props.id;
    }

    getCreatedAt(): string {
        return this.props.createdAt ? this.props.createdAt : new Date().toISOString();
    }

    getUpdatedAt(): string {
        return this.props.updatedAt ? this.props.updatedAt : new Date().toISOString();
    }
}