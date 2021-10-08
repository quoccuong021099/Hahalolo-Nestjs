import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndMerge<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('RolesGuard ~ roles: ', roles);

    if (!roles) return true;

    // const requiredRoles = 'admin';
    // console.log('Không phân quyền: ', roles.includes(requiredRoles));

    // // Not Authorized
    // if (!roles.includes('admin')) {
    //   return false;
    // }

    const requiredRolesArr = !(
      roles.includes('admin') && roles.includes('manager')
    );
    console.log('Không phân quyền: ', requiredRolesArr);

    // Not Authorized
    if (requiredRolesArr) {
      return false;
    }

    return true;
  }
}
