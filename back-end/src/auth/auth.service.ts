import { ObjectId } from 'mongodb';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/base/users/users.repository';
import { DTOAuthSignin, DTOAuthSignup } from 'src/auth/dto/auth.dto';
import { AuthSignup } from 'src/auth/interfaces/auth.interface';
import { Roles, User } from 'src/base/users/interfaces/users.interface';
import { AuthEventEmitter } from 'src/auth/events/auth.events';
import { credentialsPassword } from 'src/auth/utils/auth.security';
import { verifyPassword } from 'src/common/helpers/string.helpes';
import { ServiceError } from 'src/common/decorators/catch.decorator';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		private usersRepository: UsersRepository,
		private authEventEmitter: AuthEventEmitter,
		private jwtTokenService: JwtService,
	) {}

	async signup(payload: DTOAuthSignup) {
		const user = payload as AuthSignup;
		const userExist = await this.usersRepository.userExist({ email: user.email });
		if (userExist) throw new ServiceError('BAD_REQUEST', 'Error 400');

		const hashedPassword = await credentialsPassword(user.password);
		const newUser = {} as User;
		newUser.status = user.status;
		newUser.hashedPassword = hashedPassword;
		newUser.createdAt = new Date();
		newUser.profile = {
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
		};

		this.usersRepository.createUser(newUser);

		if (user.status === Roles.productOwner) {
			this.authEventEmitter.signupProductOwner(newUser);
		}
	}

	async signin(payload: DTOAuthSignin) {
		const { email, password } = payload;
		const user = await this.usersRepository.findOne({ 'profile.email': email });
		if (user === null) throw new ServiceError('BAD_REQUEST', 'Error 400');

		const passwordMatch = verifyPassword(user.hashedPassword, password);
		if (!passwordMatch) throw new ServiceError('BAD_REQUEST', 'Error 400');

		const strategy = await this.getTokenStrategy(user._id, user.status);
		delete user.hashedPassword;
		delete user.status;
		delete user._id;

		return { user, strategy };
	}

	async getTokenStrategy(userId: ObjectId, userStatus: Roles) {
		if (userId === null || userId === undefined) return null;

		const token = await this.generateToken({ id: userId.toString(), status: userStatus });
		return JSON.stringify({ token: token });
	}

	async generateToken(payload: Record<string, any>) {
		return this.jwtTokenService.signAsync(payload);
	}
}
