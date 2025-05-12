import { encrypt, isEqualTo } from "../../../../src/utils/cryptography";

describe('Testing my cryptography util functions', () => {
    const plainText = 'mySecretPassword';

    it('should encrypt a string and produce a different value', () => {
        const hashed = encrypt(plainText);

        expect(hashed).not.toBe(plainText);
        expect(typeof hashed).toBe('string');
        expect(hashed.length).toBeGreaterThan(0);
    });

    it('should return true when comparing original text with its encrypted version', () => {
        const hashed = encrypt(plainText);

        const result = isEqualTo(plainText, hashed);

        expect(result).toBe(true);
    });

    it('should return false when comparing wrong text with an encrypted version', () => {
        const hashed = encrypt(plainText);

        const result = isEqualTo('wrongPassword', hashed);

        expect(result).toBe(false);
    });
});