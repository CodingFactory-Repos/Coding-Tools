import { ObjectId, UpdateFilter } from 'mongodb';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/base/users/users.repository';
import {
	DTOAuthEmail,
	DTOAuthSignin,
	DTOAuthSignup,
	DTOResetPassword,
	DTOResetToken,
	DTOActivationToken,
} from 'src/auth/dto/auth.dto';
import { AuthSignup } from 'src/auth/interfaces/auth.interface';
import { Roles, User } from 'src/base/users/interfaces/users.interface';
import { AuthEventEmitter } from 'src/auth/events/auth.events';
import { credentialsPassword } from 'src/auth/utils/auth.security';
import { verifyPassword, generateRandomToken } from 'src/common/helpers/string.helper';
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
		const userExist = await this.usersRepository.userExist({ 'profile.email': user.email });
		if (userExist) throw new ServiceError('BAD_REQUEST', 'Error 400');

		const { email, password, status, firstName, lastName } = user;
		const hashedPassword = await credentialsPassword(password);
		const activationToken = generateRandomToken();
		const profile = { email, firstName, lastName };
		const createdAt = new Date();
		const isVerified = false;

		const newUser: User = {
			profile,
			isVerified,
			createdAt,
			status,
			hashedPassword,
			activationToken,
		};
		this.usersRepository.createUser(newUser);

		if (user.status === Roles.productOwner) {
			this.authEventEmitter.signupProductOwner(email, firstName);
		} else {
			this.authEventEmitter.askActivationToken(email, firstName, activationToken);
		}
	}

	async signin(payload: DTOAuthSignin) {
		const { email, password } = payload;
		const user = await this.usersRepository.findOne({ 'profile.email': email });
		if (user === null) throw new ServiceError('BAD_REQUEST', 'Error 400');

		if (!user.isVerified) throw new ServiceError('BAD_REQUEST', 'Error 400');

		const passwordMatch = await verifyPassword(user.hashedPassword, password);
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

	async activateAccount(payload: DTOActivationToken) {
		const { activationToken } = payload;
		const query = { activationToken: activationToken };
		const update: UpdateFilter<User> = {
			$unset: { activationToken: 1 },
			$set: { isVerified: true },
		};
		const data = await this.usersRepository.findOneAndUpdateUser(query, update);

		if (data.value === null) throw new ServiceError('BAD_REQUEST', 'Error 400');
		const { email, firstName } = data.value.profile;

		this.authEventEmitter.accountValidated(email, firstName);
	}

	async askActivationToken(payload: DTOAuthEmail) {
		const { email } = payload;
		const query = { 'profile.email': email, isVerified: false };
		const user = await this.usersRepository.findOne(query);
		if (user === null) throw new ServiceError('BAD_REQUEST', 'Error 400');
		const { firstName } = user.profile;

		const activationToken = generateRandomToken();
		const update = { $set: { activationToken: activationToken } };
		this.usersRepository.updateOneUser({ 'profile.email': email }, update);
		this.authEventEmitter.askActivationToken(email, firstName, activationToken);
	}

	async askResetToken(payload: DTOAuthEmail) {
		const { email } = payload;
		const query = { 'profile.email': email };
		const user = await this.usersRepository.findOne(query);
		if (user === null) throw new ServiceError('BAD_REQUEST', 'Error 400');
		const { firstName } = user.profile;

		const resetToken = generateRandomToken();
		const update = { $set: { resetToken: resetToken } };
		this.usersRepository.updateOneUser({ 'profile.email': email }, update);
		this.authEventEmitter.askResetToken(email, firstName, resetToken);
	}

	async resetPassword(payload: DTOResetPassword) {
		const { password, resetToken } = payload;
		await this.verifyResetToken({ resetToken });

		const hashedPassword = await credentialsPassword(password);
		const update = { $set: { hashedPassword: hashedPassword } };
		await this.usersRepository.updateOneUser({ resetToken }, update);
	}

	async verifyResetToken(payload: DTOResetToken) {
		const { resetToken } = payload;
		const userExists = await this.usersRepository.userExist({ resetToken });
		if (userExists === null) throw new ServiceError('BAD_REQUEST', 'Error 400');
	}
}
