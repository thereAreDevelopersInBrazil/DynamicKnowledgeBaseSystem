import { compareSync, hashSync } from 'bcrypt';

export function encrypt(text: string): string {
    return hashSync(text, 10);
}

export function isEqualTo(source: string, encrypted: string): boolean {
    return compareSync(source, encrypted);
}