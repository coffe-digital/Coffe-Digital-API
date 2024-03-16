import { SetMetadata } from '@nestjs/common';

export enum RolesUser {
    Admin = 'admin',
    Manager = 'gerente',
    Salesperson = 'vendedor'
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesUser[]) => SetMetadata(ROLES_KEY, roles);
