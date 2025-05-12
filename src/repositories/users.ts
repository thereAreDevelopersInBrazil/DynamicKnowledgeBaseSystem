import { dbClient } from '../database/client';
import { users } from '../database/schema';
import { AUser } from '../entities/users/AUser';
import { and, eq, ne } from 'drizzle-orm';
import { ExpectedError } from '../errors';
import { HTTPSTATUS } from '../constants/http';
import { Users } from '../schemas';
import { buildUser } from '../factories/users';
import { PatchPossibleValues } from '../schemas/abstracts';

export async function insert(user: AUser): Promise<number> {

    const result = await dbClient.insert(users).values({
        name: user.getName(),
        email: user.getEmail(),
        password: user.getPassword(),
        role: user.getRole()
    });

    if (!result || !result.lastInsertRowid) {
        throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, 'Unexpected error while detecting the created user data!');
    }

    return Number(result.lastInsertRowid);
}

export async function replace(user: AUser): Promise<number> {
    const result = await dbClient.insert(users).values({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        password: user.getPassword(),
        role: user.getRole()
    }).onConflictDoUpdate({
        target: users.id,
        set: {
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole()
        }
    });

    if (!result) {
        throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, 'Unexpected error while replacing user data!');
    }

    if (result?.lastInsertRowid) {
        return Number(result.lastInsertRowid);
    }

    return user.getId();
}

export async function getAll(): Promise<AUser[] | null> {
    const result = await dbClient.select()
        .from(users)
        .where(
            and(
                eq(users.isDeleted, false),
            )
        );

    if (!result) {
        return null;
    }

    const entities: AUser[] = result.map((result: Users.Shape) => {
        return buildUser(result)
    });

    return entities;
}

export async function getById(id: number): Promise<AUser | null> {
    const [result] = await dbClient.select()
        .from(users)
        .where(
            and(
                eq(users.isDeleted, false),
                eq(users.id, id)
            )
        );

    if (!result) {
        return null;
    }

    return buildUser(result);
}

export async function getByEmail(email: string, exclude: number | null = null): Promise<AUser | null> {
    const [result] = await dbClient.select()
        .from(users)
        .where(
            and(
                eq(users.isDeleted, false),
                eq(users.email, email),
                exclude ? ne(users.id, exclude) : undefined
            )
        );

    if (!result) {
        return null;
    }

    return buildUser(result);
}

export async function update(id: number, entity: AUser): Promise<boolean> {
    const result = await dbClient
        .update(users)
        .set({
            name: entity.getName(),
            email: entity.getEmail(),
            password: entity.getPassword(),
            role: entity.getRole()
        })
        .where(eq(users.id, id));

    return result.changes > 0;
}

export async function updateSingleProperty(id: number, prop: string, value: PatchPossibleValues): Promise<boolean> {
    const result = await dbClient
        .update(users)
        .set({ [prop]: value })
        .where(eq(users.id, id));

    return result.changes > 0;
}


export async function logicalDeletion(id: number): Promise<boolean> {
    const user = await getById(id);
    const result = await dbClient
        .update(users)
        .set({ email: "deleted_" + user?.getEmail(), isDeleted: true })
        .where(eq(users.id, id));

    return result.changes > 0;
}