import { AUser } from "./AUser";
import { Users } from "../../schemas";
import { isPermissions } from "../../utils/permissions";
import { VIEWER } from "../../constants/permissions";

export class Viewer extends AUser {
    constructor(viewer: Users.Shape) {
        super(viewer);
        this.permissions = isPermissions(VIEWER) ? VIEWER : [];
    }

    /**
     * Because there are no role-specific use cases in the current challenge scope,
     * I decided to include those interfaces/methods for demonstration purposes to showcase Interface Segregation and advanced OOP design.
    */

    public leaveAnEditingSuggestion() {
        /**
            * At least viewers can do something rsrs
            * Implemented from interface IViewer
        */
    }
}