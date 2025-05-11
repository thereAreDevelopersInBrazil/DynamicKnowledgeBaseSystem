import { Admin } from "../entities/users/Admin";
import { AUser } from "../entities/users/AUser";
import { Editor } from "../entities/users/Editor";
import { Viewer } from "../entities/users/Viewer";
import { Users } from "../schemas";

type Constructor = new (props: Users.Shape) => AUser;

const strategy: Record<string, Constructor> = {
    "Admin": Admin,
    "Editor": Editor,
    "Viewer": Viewer,
};

export function buildUser(props: Users.Shape) {
    const concreteClass = strategy[props.role];

    if (!concreteClass) {
        throw new Error(`Unsupported user role: ${props.role}`);
    }

    return new concreteClass(props)
}