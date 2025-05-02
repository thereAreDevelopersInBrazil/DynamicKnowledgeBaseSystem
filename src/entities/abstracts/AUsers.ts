import { AEntity } from "./AEntity";
import { Users } from "../../schemas";

export abstract class AUsers extends AEntity {
    protected name: string;
    protected email: string;
    protected role: Users.roles;

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

    public getRole(): Users.roles {
        return this.role;
    }

    public setRole(role: Users.roles): void {
        this.role = role;
    }
}