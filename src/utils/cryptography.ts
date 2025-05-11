import { hash, compare } from 'bcrypt';

export async function encrypt(text: string): Promise<string> {
    return await hash(text, 10);
}

export async function isEqualTo(source: string, encrypted: string): Promise<boolean> {
    return await compare(source, encrypted);
}