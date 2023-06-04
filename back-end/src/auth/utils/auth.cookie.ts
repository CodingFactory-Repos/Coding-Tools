import cookie from 'cookie';

export const createAuthCookie = (strategy: string) => {
	return cookie.serialize('token', strategy, {
		httpOnly: true,
		secure: true, // config.jwt.cookie.secure
		maxAge: 60 * 60 * 24 * 30,
		sameSite: 'none', // config.jwt.cookie.samesite
		path: '/',
	});
};

export const expireAuthCookie = () => {
	return cookie.serialize('token', '', {
		httpOnly: true,
		secure: true, // config.jwt.cookie.secure
		expires: new Date(0),
		sameSite: 'none', // config.jwt.cookie.samesite
		path: '/',
	});
};
