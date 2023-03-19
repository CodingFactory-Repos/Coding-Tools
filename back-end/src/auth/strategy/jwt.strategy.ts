import { ObjectId } from 'mongodb';
import { Injectable, UnauthorizedException, Logger as NestLogger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { config } from 'src/config/config';
import { JwtTokenData, JwtPayload } from 'src/auth/interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor() {
		super({
			ignoreExpiration: false,
			secretOrKey: config.jwt.secret,
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					try {
						const data = <string>req?.cookies['token'];
						if (!data) return null;

						const parsed = <JwtTokenData>JSON.parse(data);
						return parsed.token;
					} catch(err) {
						if(err instanceof Error) {
							NestLogger.error(err.message);
						}
						return null
					}
				},
			]),
		});
	}

	async validate(payload: JwtPayload) {
		if (!payload?.id) throw new UnauthorizedException();
		if (!(payload?.role >= 0 && payload?.role <= 2)) throw new UnauthorizedException();
		payload.id = new ObjectId(payload.id);
		return payload;
	}
}
