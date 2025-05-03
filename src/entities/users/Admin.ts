import { AUser } from "./AUser";
import { Users } from "../../schemas";
import { IAdmin } from "../../interfaces/IAdmin";
import { IEditor } from "../../interfaces/IEditor";
import { IViewer } from "../../interfaces/IViewer";

export class Admin extends AUser implements IAdmin, IEditor, IViewer {
    constructor(admin: Users.Shape) {
        super(admin);
    }

    /**
     * Because there are no role-specific use cases in the current challenge scope,
     * I decided to include those interfaces/methods for demonstration purposes to showcase Interface Segregation and advanced OOP design.
    */

    public deleteThings(): void {
        /**
            * Admins exclusive SUPERPOWER!
            * Implemented from interface IAdmin
        */
    }

    public editThings(): void {
        /**
            * Admins have all the powers!
            * Implemented from interface IEditor
        */
    }

    public leaveAnEditingSuggestion(): void {
        /**
            * Admins have all the powers!
            * Implemented from interface IViewer
        */
    }
}