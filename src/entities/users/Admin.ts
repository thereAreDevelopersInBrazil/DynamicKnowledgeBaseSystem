import { AUser } from "./AUser";
import { Users } from "../../schemas";
import { IAdmin } from "../../interfaces/IAdmin";
import { IEditor } from "../../interfaces/IEditor";
import { IViewer } from "../../interfaces/IViewer";
import { ADMIN } from "../../constants/permissions";
import { isPermissions } from "../../utils/permissions";

export class Admin extends AUser implements IAdmin, IEditor, IViewer {

    constructor(props: Users.Shape) {
        super(props);
        this.permissions = isPermissions(ADMIN) ? ADMIN : [];
    }

    /**
     * Because there are no role-specific use cases in the current challenge scope,
     * I decided to include those interfaces/methods for demonstration purposes to showcase Interface Segregation and advanced OOP design.
    */

    public adminExclusiveFeature(): void {
        /**
            * Admins exclusive SUPERPOWER!
            * Implemented from interface IAdmin
        */
    }

    public editorFeature(): void {
        /**
            * Admins have all the powers!
            * Implemented from interface IEditor
        */
    }

    public viwerFeature(): void {
        /**
            * Admins have all the powers!
            * Implemented from interface IViewer
        */
    }
}