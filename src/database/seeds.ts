import { Admin } from "../entities/users/Admin";
import { replace } from "../repositories/users";
import { Users } from "../schemas";
import { encrypt } from "../utils/cryptography";

export async function seeds() {
    const defaultUserShape = {
        id: 1,
        email: "system@default.com",
        name: "System",
        password: encrypt("@DynamicKnowledge2025@"),
        role: "Admin" as Users.Roles,
    }
    const userEntity = new Admin(defaultUserShape);
    await replace(userEntity);
}