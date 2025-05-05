export class ExpectedError extends Error {
    public readonly status: number;
    public readonly details: unknown;

    constructor(status: number, message: string, details: unknown | null = null) {
        super(message);
        this.status = status;
        this.details = details
        this.name = this.constructor.name;
    }
}