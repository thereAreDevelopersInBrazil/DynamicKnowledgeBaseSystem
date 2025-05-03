import { Abstracts } from '../../schemas';

export abstract class AEntity {

    protected id: number;
    protected createdAt: string;
    protected updatedAt: string;

    constructor(entity: Abstracts.Shape) {
        this.id = entity.id;
        const now = new Date().toISOString();
        this.createdAt = entity.createdAt ? entity.createdAt : now;
        this.updatedAt = entity.updatedAt ? entity.updatedAt : now;
    }

    getId(): number {
        return this.id;
    }

    getCreatedAt(): string {
        return this.createdAt;
    }

    getUpdatedAt(): string {
        return this.updatedAt;
    }

    protected touch() {
        this.updatedAt = new Date().toISOString();
    }
}