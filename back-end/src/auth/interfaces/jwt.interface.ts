import { ObjectId } from 'mongodb';
import { Roles } from 'src/base/users/interfaces/users.interface';

export interface JwtTokenData {
	token: string;
}

export interface JwtPayload {
	id: string | ObjectId;
	status: Roles;
	iat: number;
	exp: number;
	refresh?: string;
}
