import { AUsers } from "../abstracts/AUsers";
import { Users } from "../../schemas";
import { IEditor } from "../../interfaces/IEditor";
import { IViewer } from "../../interfaces/IViewer";

export class Editor extends AUsers implements IEditor, IViewer {
    constructor(editor: Users.Shape) {
        super(editor);
    }

    /**
     * Because there are no role-specific use cases in the current challenge scope,
     * I decided to include those interfaces/methods for demonstration purposes to showcase Interface Segregation and advanced OOP design.
    */

    public editThings(): void {
        /**
            * Editors main power
            * Implemented from interface IEditor
        */
    }

    public leaveAnEditingSuggestion(): void {
        /**
            * Editors also can leave comments and suggestions right?
            * Implemented from interface IViewer
        */
    }
}