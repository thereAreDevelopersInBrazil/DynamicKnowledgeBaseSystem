import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const dynamicKnowledgeDataBase = new Database('./dynamicKnowledgeDataBase.db');
export const dbClient = drizzle(dynamicKnowledgeDataBase, { schema });