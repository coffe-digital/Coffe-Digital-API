import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../../permission/enum/permission.enum';
import { PERMISSIONS_KEY } from '../../permission/decorators/permission-endpoint.decorator';
import { RolePermissionService } from '../role_permission.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    // Assumindo que a entidade `user` possui os cargos e permissões carregados
    const userPermissions = await this.getUserPermissions(user.roleId);

    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }

  private async getUserPermissions(roleId: number): Promise<Permission[]> {
    // Aqui você deve buscar no banco de dados as permissões associadas aos cargos do usuário
    // Exemplo:
    const rolePermissions =
      await this.rolePermissionService.findPermissionsByRole(roleId);

    return rolePermissions.map((rp) => rp.name as Permission);
  }
}
