import { AUser } from '../../entities/users/AUser';

declare global {
    namespace Express {
        interface Request {
            user?: AUser | null;
        }
    }
}
