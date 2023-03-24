import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CallsRepository } from 'src/base/calls/calls.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { ObjectId } from 'mongodb';
import { JwtService } from '@nestjs/jwt';
import { CourseIdObject } from '@/base/calls/interfaces/calls.interface';

@Injectable()
export class CallsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => CallsRepository))
		private usersRepository: UsersRepository,
		private callsRepository: CallsRepository,
		private jwtTokenService: JwtService,
	) {}

	async generateTempToken(payload: Record<string, unknown>) {
		const jwt = await this.jwtTokenService.signAsync(payload, { expiresIn: '3min' });
		return jwt;
	}

	async updateUserPresence(jwt: string, presence: boolean) {
		const jwt_decode = this.jwtTokenService.decode(jwt);
		const userId = await jwt_decode['id'];
		const courseId = await jwt_decode['courseId'];
		return this.callsRepository.updateUserPresence(userId, courseId, presence);
	}

	async generator(userId: ObjectId, courseId: CourseIdObject) {
		const jwt = await this.generateTempToken({ id: userId, courseId: courseId.courseId });
		const url = await this.generateUrl(jwt);
		return url;
	}

	async generateUrl(jwt: string) {
		return `https://1f25-2a01-cb00-e91-b600-30f3-a390-1412-28a2.eu.ngrok.io/calls/presence/` + jwt;
	}

	async getActualCourse(userId: ObjectId) {
		const actualCourse = await this.callsRepository.getActualCourse(userId);
		return actualCourse;
	}

	getStudentIdList(courseId: CourseIdObject) {
		return this.callsRepository.getStudentIdList(courseId.courseId);
	}
	getStudentList(studentIdList: Array<ObjectId>) {
		return this.callsRepository.getStudentList(studentIdList);
	}

	async arrayGenerator(studentAmount: number) {
		const hashs = this.calculateGroups(studentAmount);

		const finalHashs = [];

		for (let i = 1; i <= hashs['groupsOf4']; i++) {
			const hash = {};
			for (let j = 0; j <= 3; j++) {
				hash[j] = '';
			}
			finalHashs.push({ [finalHashs.length + 1]: hash });
		}

		for (let i = 1; i <= hashs['groupsOf3']; i++) {
			const hash = {};
			for (let j = 0; j <= 2; j++) {
				hash[j] = '';
			}
			finalHashs.push({ [finalHashs.length + 1]: hash });
		}

		return finalHashs;
	}

	calculateGroups(studentAmount: number) {
		let groupsOf3 = 0;
		let groupsOf4 = 0;

		while (studentAmount > 0) {
			if (studentAmount % 4 === 0) {
				groupsOf4 += 1;
				studentAmount -= 4;
			} else if (studentAmount % 3 === 0) {
				groupsOf3 += 1;
				studentAmount -= 3;
			} else {
				groupsOf4 += 1;
				studentAmount -= 4;
			}
		}
		return { groupsOf3: groupsOf3, groupsOf4: groupsOf4 };
	}
}
