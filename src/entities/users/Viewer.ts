import { AUser } from "./AUser";
import { Users } from "../../schemas";

export class Viewer extends AUser {
    constructor(viewer: Users.Shape) {
        super(viewer);
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