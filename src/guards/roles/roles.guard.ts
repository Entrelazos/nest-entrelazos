// RolesGuard
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/types/role.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user }: { user: User } = context.switchToHttp().getRequest();

    if (!user || !user.roles) {
      console.error('RolesGuard - User or roles not found');
      return false;
    }

    const hasRole = requiredRoles.some((role) =>
      user.roles.map((userRole) => userRole.role_name).includes(role),
    );

    if (!hasRole) {
      console.error('RolesGuard - Access denied for roles:', requiredRoles);
    }

    return hasRole;
  }
}
