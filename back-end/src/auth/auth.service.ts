import { ObjectId, UpdateFilter } from 'mongodb';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '@/base/users/users.repository';
import {
	DTOAuthEmail,
	DTOAuthSignin,
	DTOAuthSignup,
	DTOResetPassword,
	DTOResetToken,
	DTOActivationToken,
} from '@/auth/dto/auth.dto';
import { AuthSignup } from '@/auth/interfaces/auth.interface';
import { Roles, User } from '@/base/users/interfaces/users.interface';
import { AuthEventEmitter } from '@/auth/events/auth.events';
import { credentialsPassword } from '@/auth/utils/auth.security';
import {
	verifyPassword,
	generateRandomToken,
	generateCodeToken,
} from '@/common/helpers/string.helper';
import { ServiceError } from '@/common/decorators/catch.decorator';
import { PROJECTION_CURRENT_USER } from '@/auth/utils/auth.projection';

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

		const { email, password, role } = user;
		const hashedPassword = await credentialsPassword(password);
		const activationToken = generateCodeToken();
		const profile = { email };
		const createdAt = new Date();
		const isVerified = false;

		const newUser: User = {
			profile,
			isVerified,
			createdAt,
			role,
			hashedPassword,
			activationToken,
		};

		//! This will send a validation email to the admin.
		//! The PO will be able to use the website as a student in the meantime.
		if (user.role === Roles.productOwner) {
			newUser.requireAdminValidation = true;
			this.authEventEmitter.signupProductOwner(email);
		}

		this.usersRepository.createUser(newUser);
		this.authEventEmitter.askActivationToken(email, activationToken);
	}

	async signin(payload: DTOAuthSignin) {
		const { email, password } = payload;
		const user = await this.usersRepository.findOne({ 'profile.email': email });
		if (user === null) throw new ServiceError('BAD_REQUEST', 'Error 400');

		if (!user.isVerified) throw new ServiceError('BAD_REQUEST', 'Error 400');

		const passwordMatch = await verifyPassword(user.hashedPassword, password);
		if (!passwordMatch) throw new ServiceError('BAD_REQUEST', 'Error 400');

		const strategy = await this.getTokenStrategy(user._id, user.role);
		return { strategy };
	}

	async getTokenStrategy(userId: ObjectId, userRole: Roles) {
		if (userId === null || userId === undefined) return null;

		const token = await this.generateToken({ id: userId.toString(), role: userRole });
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
		const { _id, role, profile } = data.value;

		this.authEventEmitter.accountValidated(profile.email);

		const strategy = await this.getTokenStrategy(_id, role);
		return { strategy };
	}

	async askActivationToken(payload: DTOAuthEmail) {
		const { email } = payload;
		const query = { 'profile.email': email, isVerified: false };
		const user = await this.usersRepository.findOne(query);
		if (user === null) throw new ServiceError('BAD_REQUEST', 'Error 400');

		const activationToken = generateRandomToken();
		const update = { $set: { activationToken: activationToken } };
		this.usersRepository.updateOneUser({ 'profile.email': email }, update);
		this.authEventEmitter.askActivationToken(email, activationToken);
	}

	async askResetToken(payload: DTOAuthEmail) {
		const { email } = payload;
		const query = { 'profile.email': email };
		const user = await this.usersRepository.findOne(query);
		if (user === null) throw new ServiceError('BAD_REQUEST', 'Error 400');

		const resetToken = generateRandomToken();
		const update = { $set: { resetToken: resetToken } };
		this.usersRepository.updateOneUser({ 'profile.email': email }, update);
		this.authEventEmitter.askResetToken(email, resetToken);
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

	async retrieveCurrentUser(userId: ObjectId) {
		const user = await this.usersRepository.findOne({ _id: userId }, PROJECTION_CURRENT_USER);
		if (user == null)
			throw new ServiceError(
				'UNAUTHORIZED',
				'You do not have the rights to access this ressource.',
			);
		return user;
	}

	async checkAuth(userId: ObjectId) {
		const user = await this.usersRepository.userExist({ _id: userId });
		if (user === null)
			throw new ServiceError(
				'UNAUTHORIZED',
				'You do not have the rights to access this ressource.',
			);
		return user;
	}

	// add events into user
	async addEvent(userId: ObjectId, eventId: ObjectId) {
		const user = await this.usersRepository.findOneAndUpdateUser(
			{ _id: userId },
			{ $push: { events: eventId } },
		);
		if (user.value === null) throw new ServiceError('BAD_REQUEST', 'Error 400');
	}

	// remove events from user
	async removeEvent(userId: ObjectId, eventId: ObjectId) {
		const user = await this.usersRepository.findOneAndUpdateUser(
			{ _id: userId },
			{ $pull: { events: eventId } },
		);
		if (user.value === null) throw new ServiceError('BAD_REQUEST', 'Error 400');
	}

	async addArticles(userId: ObjectId, articleId: ObjectId) {
		console.log('service userId', userId);
		console.log('service articleId', articleId);

		const user = await this.usersRepository.findOneAndUpdateUser(
			{ _id: userId },
			{ $push: { myArticles: articleId } },
		);
		if (user.value === null) throw new ServiceError('BAD_REQUEST', 'Error 400');
	}
}
