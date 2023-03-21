import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Req } from '@nestjs/common';

import { CallsRepository } from 'src/base/calls/calls.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import {ObjectId} from "mongodb";
import {JwtService} from "@nestjs/jwt";
import {JwtQRCode} from "@/base/calls/interfaces/calls.interface";

@Injectable()
export class CallsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => CallsRepository))
		private usersRepository: UsersRepository,
		private callsRepository: CallsRepository,
		private jwtTokenService: JwtService,
	) {}

	async generateTempToken(payload: Record<string, any>) {
		const jwt = await this.jwtTokenService.signAsync(payload, { expiresIn: '3min' });
		console.log(this.jwtTokenService.decode(jwt));
		return jwt;
	}

	async updateUserPresence(jwt: string, presence: boolean) {
		console.log(jwt);
		const jwt_decode = this.jwtTokenService.decode(jwt);
		const userId = await jwt_decode['id'];
		const courseId = await jwt_decode['courseId'];
		await this.callsRepository.updateUserPresence(userId, courseId, presence);
	}

	async generator(userId: ObjectId, courseId: ObjectId) {
		const jwt = await this.generateTempToken({ id: userId, courseId: new ObjectId() });
		const url = await this.generateUrl(jwt);
		return url;
	}

	async generateUrl(jwt: string) {
		return `https://72ef-92-174-83-81.eu.ngrok.io/calls/presence/` + jwt;
	}
}
