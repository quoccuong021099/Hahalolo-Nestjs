import { SetMetadata } from '@nestjs/common';

export const CustomRoles = (role: string) => SetMetadata('roles', role);
