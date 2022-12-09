import cookie from 'cookie';

import { config } from 'src/config/config';

export const createAuthCookie = (strategy: string) => {
	return cookie.serialize('token', strategy, {
		httpOnly: true,
		secure: config.jwt.cookie.secure,
		maxAge: 60 * 60 * 24 * 30,
		sameSite: config.jwt.cookie.samesite,
		path: '/',
	});
};

export const expireAuthCookie = () => {
	return cookie.serialize('token', '', {
		httpOnly: true,
		secure: config.jwt.cookie.secure,
		expires: new Date(0),
		sameSite: config.jwt.cookie.samesite,
		path: '/',
	});
};
