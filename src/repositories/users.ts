import { dbClient } from '../database/client';
import { users } from '../database/schema';
import { AUser } from '../entities/users/AUser';
import { and, eq } from 'drizzle-orm';
import { ExpectedError } from '../errors';
import { HTTPSTATUS } from '../constants/http';
import { Users } from '../schemas';
import { buildUser } from '../factories/users';

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

export async function getByEmail(email: string): Promise<AUser | null> {
    const [result] = await dbClient.select()
        .from(users)
        .where(
            and(
                eq(users.isDeleted, false),
                eq(users.email, email)
            )
        );

    if (!result) {
        return null;
    }

    return buildUser(result);
}

export async function update(original: Users.Shape, updated: Users.Shape): Promise<boolean> {
    const result = await dbClient
        .update(users)
        .set(updated)
        .where(eq(users.id, original.id));

    return result.changes > 0;
}

export async function updateSingleProperty(original: Users.Shape, prop: string, value: string): Promise<boolean> {
    const result = await dbClient
        .update(users)
        .set({
            [prop]: value,
            updatedAt: new Date().toISOString()
        })
        .where(eq(users.id, original.id));

    return result.changes > 0;
}


export async function logicalDeletion(id: number): Promise<boolean> {
    const result = await dbClient
        .update(users)
        .set({ isDeleted: true })
        .where(eq(users.id, id));

    return result.changes > 0;
}