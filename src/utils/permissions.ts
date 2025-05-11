import { ALL } from "../constants/permissions";
import { Permissions } from "../types";

export function isPermission(value: string): value is Permissions {
    return (ALL as readonly string[]).includes(value);
}

export function isPermissions(values: string[]): values is Permissions[] {
    return values.every(value => (ALL as readonly string[]).includes(value));
}