import { v4 as uuidv4 } from 'uuid';
import { Abstracts } from '../../schemas';

export abstract class AEntity {

    protected id: string;
    protected createdAt: Date;
    protected updatedAt: Date;

    constructor(entity: Abstracts.Shape) {
        this.id = entity.id ? entity.id : uuidv4();
        const now = new Date();
        this.createdAt = entity.createdAt ? entity.createdAt : now;
        this.updatedAt = entity.updatedAt ? entity.updatedAt : now;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    protected touch() {
        this.updatedAt = new Date();
    }
}