import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CallsRepository } from 'src/base/calls/calls.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { ObjectId } from 'mongodb';
import { JwtService } from '@nestjs/jwt';
import {
	CourseIdObject,
	MessageObject,
	StudentIdObject,
} from '@/base/calls/interfaces/calls.interface';
// import { Course } from '@base/courses/interfaces/courses.interface';

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
		return `https://1b68-2a01-cb00-e91-b600-2d60-c9db-21f5-24f.eu.ngrok.io/calls/presence/` + jwt;
	}

	async getActualCourse(userId: ObjectId) {
		const actualCourse = await this.callsRepository.getActualCourse(userId);
		return actualCourse;
	}
	async getStudentList(courseId: CourseIdObject) {
		const studentIdList = await this.callsRepository.getStudentIdList(courseId.courseId);
		return this.callsRepository.getStudentList(courseId.courseId, studentIdList);
	}

	async getStudentIdentity(userId: ObjectId) {
		return await this.callsRepository.getStudentIdentity(userId);
	}

	getStudentPresence(courseId: CourseIdObject, studentId: StudentIdObject) {
		return this.callsRepository.getStudentPresence(courseId.courseId, studentId.studentId);
	}

	async arrayGenerator(studentAmount: number, courseId: CourseIdObject) {
		const amountOfHash = this.calculateGroups(studentAmount);

		const finalHash = [];

		for (let i = 1; i <= amountOfHash['groupsOf4']; i++) {
			const hash = [];
			for (let j = 0; j <= 3; j++) {
				hash.push('');
			}
			finalHash.push(hash);
		}

		for (let i = 1; i <= amountOfHash['groupsOf3']; i++) {
			const hash = [];
			for (let j = 0; j <= 2; j++) {
				hash.push('');
			}
			finalHash.push(hash);
		}

		await this.callsRepository.createGroups(finalHash, courseId.courseId);

		return finalHash;
	}

	calculateGroups(studentAmount: number) {
		let groupsOf3 = 0;
		let groupsOf4 = 0;

		while (studentAmount > 0) {
			if (studentAmount % 3 === 0) {
				groupsOf3 += 1;
				studentAmount -= 3;
			} else {
				groupsOf4 += 1;
				studentAmount -= 4;
			}
		}
		return { groupsOf3: groupsOf3, groupsOf4: groupsOf4 };
	}

	createRandomGroups(courseId: CourseIdObject) {
		return this.callsRepository.createRandomGroups(courseId.courseId);
	}

	emptyGroups(courseId: CourseIdObject) {
		return this.callsRepository.emptyGroups(courseId.courseId);
	}

	getGroups(courseId: CourseIdObject) {
		return this.callsRepository.getGroups(courseId.courseId);
	}

	getMessages(courseId: CourseIdObject) {
		return this.callsRepository.getMessages(courseId.courseId);
	}

	async joinGroup(courseId: CourseIdObject, groupId: string, studentId: ObjectId) {
		return this.callsRepository.joinGroup(courseId.courseId, groupId, studentId);
	}

	async saveMessage(userId: ObjectId, courseId: CourseIdObject, message: MessageObject) {
		return this.callsRepository.saveMessage(userId, courseId.courseId, message);
	}
}
