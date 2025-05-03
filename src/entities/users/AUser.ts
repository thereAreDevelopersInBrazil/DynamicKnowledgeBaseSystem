import { AEntity } from "../abstracts/AEntity";
import { Users } from "../../schemas";

export abstract class AUser extends AEntity {
    protected name: string;
    protected email: string;
    protected role: Users.Roles;

    constructor(user: Users.Shape) {
        super(user);
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getRole(): Users.Roles {
        return this.role;
    }

    public setRole(role: Users.Roles): void {
        this.role = role;
    }
}