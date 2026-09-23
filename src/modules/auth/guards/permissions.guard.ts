import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission } from '../enums/permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get permissions required by the endpoint
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If endpoint has no permission requirement,
    // allow the request
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Get logged-in user from JWT
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check whether user exists
    if (!user) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    /*
     * Permission mapping based on user's role.
     *
     * ADMIN → all product permissions
     * USER  → read product permission only
     */

    let userPermissions: Permission[] = [];

    if (user.role === 'ADMIN') {
      userPermissions = [
        Permission.PRODUCT_CREATE,
        Permission.PRODUCT_READ,
        Permission.PRODUCT_UPDATE,
        Permission.PRODUCT_DELETE,
      ];
    }

    if (user.role === 'USER') {
      userPermissions = [Permission.PRODUCT_READ];
    }

    // Check whether user has all required permissions
    const hasPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermissions) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
