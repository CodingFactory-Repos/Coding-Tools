import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtPayload } from '@/auth/interfaces/jwt.interface';

export enum Roles {
	PEDAGOGUE = 3,
	PRODUCT_OWNER = 2,
	USER = 1,
	ADMIN = 0,
}

@Injectable()
export class RoleValidator implements CanActivate {
	constructor(private readonly requiredRole: Roles) {}

	canActivate(context: ExecutionContext): boolean {
		const user = context.switchToHttp().getRequest().user as JwtPayload;
		return user.role === this.requiredRole;
	}
}
