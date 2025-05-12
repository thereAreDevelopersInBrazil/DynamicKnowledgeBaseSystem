import { HTTPSTATUS } from "../constants/http";
import { JWT_SECRET } from "../constants/jwt";
import { ExpectedError } from "../errors";
import { getByEmail } from "../repositories/users";
import { isEqualTo } from "../utils/cryptography";
import * as jwt from "jsonwebtoken";

export async function login(email: string, password: string) {
    const result = await getByEmail(email);
    const message = 'The provided email or password are incorrect! Check and try again!';
    if (!result) {
        throw new ExpectedError(HTTPSTATUS.UNAUTHORIZED, message);
    }
    const correct = isEqualTo(password, result.getPassword());
    if (!correct) {
        throw new ExpectedError(HTTPSTATUS.UNAUTHORIZED, message);
    }

    return jwt.sign({ id: result.getId() }, JWT_SECRET, { expiresIn: '6h' });
}