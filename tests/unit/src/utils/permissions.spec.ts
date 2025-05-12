import { ALL } from "../../../../src/constants/permissions";
import { isPermission, isPermissions } from "../../../../src/utils/permissions";

describe('Testing my permissions util functions', () => {
    const validPermission: string = ALL[0];
    const invalidPermission = 'INVALID_PERMISSION';

    it('should return true for a valid permission', () => {
        expect(isPermission(validPermission)).toBe(true);
    });

    it('should return false for an invalid permission', () => {
        expect(isPermission(invalidPermission)).toBe(false);
    });

    it('should return true for an array of valid permissions', () => {
        const permissions = ALL.slice(0, 3);
        expect(isPermissions(permissions)).toBe(true);
    });

    it('should return false if any permission in the array is invalid', () => {
        const permissions = [ALL[0], 'SOMETHING_WRONG'];
        expect(isPermissions(permissions)).toBe(false);
    });
});