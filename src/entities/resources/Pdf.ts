import { AResource } from "./AResource";
import { Resources } from "../../schemas";

export class Pdf extends AResource<'Pdf'> {

    constructor(pdf: Resources.Shape<'Pdf'>) {
        super(pdf);
    }

    public getFileSize(): number {
        return this.props.details.fileSize;
    }

    public setFileSize(fileSize: number): void {
        this.props.details.fileSize = fileSize;
    }

    public toJson(): object {
        return {
            id: this.getId(),
            url: this.getUrl(),
            description: this.getDescription(),
            type: this.getType(),
            ...(this.getFileSize() ? { fileSize: this.getFileSize() } : { details: this.getDetails() }),
            createdAt: this.getCreatedAt(),
            updatedAt: this.getUpdatedAt()
        };
    }
}