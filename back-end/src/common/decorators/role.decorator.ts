import { createParamDecorator, ExecutionContext, Logger as NestLogger } from '@nestjs/common';

import { JwtPayload } from '@/auth/interfaces/jwt.interface';

export const UserRole = createParamDecorator((_: unknown, context: ExecutionContext) => {
	try {
		const args = context.getArgs();
		const user = <JwtPayload>args[0].user;
		return user.role;
	} catch (e) {
		NestLogger.error(`Could not retrieve the user role from the jwt, ${e}`);
		return null;
	}
});
