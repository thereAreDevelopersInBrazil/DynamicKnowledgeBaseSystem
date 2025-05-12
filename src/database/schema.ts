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
        .$onUpdateFn(() => new Date().toISOString())
};

export const topics = sqliteTable('topics', {
    ...idSchema,
    name: text().notNull(),
    content: text(),
    version: integer().default(1),
    parentTopicId: integer().references((): AnySQLiteColumn => topics.id),
    ...timeStampsSchemas,
    isDeleted: integer({ mode: 'boolean' }).default(false).notNull()
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

export const resources_topics = sqliteTable('resources_topics', {
    ...idSchema,
    resourceId: integer().references((): AnySQLiteColumn => resources.id).notNull(),
    topicId: integer().references((): AnySQLiteColumn => topics.id).notNull(),
});


export const resources = sqliteTable('resources', {
    ...idSchema,
    url: text().notNull(),
    description: text().notNull(),
    type: text().$type<Resources.Types>().notNull(),
    details: text({ mode: 'json' }).$type<Resources.TypesDetails>().notNull(),
    isDeleted: integer({ mode: 'boolean' }).default(false).notNull(),
    ...timeStampsSchemas
});

export const users = sqliteTable('users', {
    ...idSchema,
    name: text().notNull(),
    //I REMOVED THE .unique() from email cause sqlite dosent support CREATE INDEX IF NOT EXISTS and always try to create it crashing the app start when npx drizzle-kit push runs
    email: text().notNull(),
    password: text().notNull(),
    role: text().$type<Users.Roles>().notNull(),
    isDeleted: integer({ mode: 'boolean' }).default(false).notNull(),
    ...timeStampsSchemas
});