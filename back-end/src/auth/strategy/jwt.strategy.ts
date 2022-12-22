import { ObjectId } from 'mongodb';
import { Injectable, UnauthorizedException } from '@nestjs/common';
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
					const data = <string>req?.cookies['token'];
					if (!data) return null;

					const parsed = <JwtTokenData>JSON.parse(data);
					return parsed.token;
				},
			]),
		});
	}

	async validate(payload: JwtPayload) {
		if (!payload?.id) throw new UnauthorizedException();
		if (!(payload?.status >= 0 && payload?.status <= 2)) throw new UnauthorizedException();
		payload.id = new ObjectId(payload.id);
		return payload;
	}
}
