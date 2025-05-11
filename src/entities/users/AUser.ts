import { AEntity } from "../abstracts/AEntity";
import { Users } from "../../schemas";
import { isPermission } from "../../utils/permissions";
import { Permissions } from "../../types";

export abstract class AUser extends AEntity {
    protected props: Users.Shape;
    protected permissions: Permissions[] = [];

    constructor(props: Users.Shape) {
        super(props);
        this.props = props;
    }

    public hasPermission(action: string): boolean {
        if (isPermission(action)) {
            return this.permissions.includes(action);
        }
        return false;
    }

    public getName(): string {
        return this.props.name;
    }

    public setName(name: string): void {
        this.props.name = name;
    }

    public getEmail(): string {
        return this.props.email;
    }

    public setEmail(email: string): void {
        this.props.email = email;
    }

    public getPassword(): string {
        return this.props.password;
    }

    public setPassword(password: string): void {
        this.props.password = password;
    }

    public getRole(): Users.Roles {
        return this.props.role;
    }

    public setRole(role: Users.Roles): void {
        this.props.role = role;
    }

    public toJson(): object {
        return {
            id: this.getId(),
            name: this.getName(),
            email: this.getEmail(),
            role: this.getRole(),
            createdAt: this.getCreatedAt(),
            updatedAt: this.getUpdatedAt()
        };
    }
}