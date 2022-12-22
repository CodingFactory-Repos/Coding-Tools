import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

import { CallsRepository } from 'src/base/calls/calls.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class CallsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => CallsRepository))
		private usersRepository: UsersRepository,
		private callsRepository: CallsRepository,
	) {}
	public generateQrCode() {
		const qr = randomBytes(16)
			.toString('base64')
			.replace(/[^a-zA-Z0-9]/g, '');
		return qr;
	}
	public generateQrLink() {
		const qr = this.generateQrCode();
		const link = `http://localhost:3000/calls/presence?qr=${qr}`;
		return link;
	}
}
