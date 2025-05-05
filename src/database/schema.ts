import { sqliteTable, text, integer, AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { Resources, Users } from "../schemas";

const idSchema = {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
};

const timeStampsSchemas = {
    createdAt: text('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`)
};

export const topics = sqliteTable('topics', {
    ...idSchema,
    name: text().notNull(),
    content: text(),
    version: integer().default(1),
    parentTopicId: integer().references((): AnySQLiteColumn => topics.id),
    ...timeStampsSchemas,
    isDeleted: integer({ mode: 'boolean' }).default(false)
});

export const topics_versions = sqliteTable('topics_versions', {
    ...idSchema,
    topicId: integer().references((): AnySQLiteColumn => topics.id),
    name: text().notNull(),
    content: text(),
    version: integer().default(1),
    parentTopicId: integer().references((): AnySQLiteColumn => topics.id),
    ...timeStampsSchemas
});

export const resources = sqliteTable('resources', {
    ...idSchema,
    topicId: integer().references((): AnySQLiteColumn => topics.id).notNull(),
    url: text().notNull(),
    description: text().notNull(),
    type: text().$type<Resources.Types>().notNull(),
    ...timeStampsSchemas
});

export const users = sqliteTable('users', {
    ...idSchema,
    name: text().notNull(),
    email: text().notNull(),
    role: text().$type<Users.Roles>().notNull(),
    ...timeStampsSchemas
});