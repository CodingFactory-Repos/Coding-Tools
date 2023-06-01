import { Inject, Injectable } from '@nestjs/common';
import { Db, Filter, FindOneAndUpdateOptions, InferIdType, ObjectId } from 'mongodb';
import { AbsencesParams, Call } from 'src/base/calls/interfaces/calls.interface';
import { Course } from '@/base/courses/interfaces/courses.interface';
import { ServiceError } from '@/common/decorators/catch.decorator';
import crypto from 'crypto';
import { Roles } from '@/base/users/interfaces/users.interface';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { MailjetService } from 'src/external-modules/mailjet/mailjet.service';
import fs from 'fs';
import * as path from 'path';

@Injectable()
export class CallsRepository {
	constructor(
		@Inject('DATABASE_CONNECTION') private db: Db,
		@Inject(MailjetService)
		private readonly mailjetService: MailjetService,
	) {}

	get calls() {
		return this.db.collection<Call>('calls');
	}
	get courses() {
		return this.db.collection<Course>('courses');
	}

	async isWeekEnd(date: Date) {
		const day = date.getDay();
		return day === 0 || day === 6;
	}
	async checkWeekEnd() {
		const date = new Date();
		const isWeekEnd = await this.isWeekEnd(date);
		if (isWeekEnd) {
			throw new ServiceError('FORBIDDEN', 'Vous ne pouvez pas performer ces actions le week-end');
		}
	}

	async getActualCourses() {
		const actualDate = new Date();

		return await this.courses
			.find({
				$and: [{ periodStart: { $lte: actualDate } }, { periodEnd: { $gte: actualDate } }],
			})
			.toArray();
	}

	async getClassSupervisor(courseId: InferIdType<Course>) {
		const course = await this.courses.findOne({ _id: courseId });
		const classObjectId = course.classId;
		const classroom = await this.db.collection('classes').findOne({ _id: classObjectId });
		return await this.db.collection('users').findOne({ _id: new ObjectId(classroom.pedago) });
	}

	async getClass(courseId: InferIdType<Course>) {
		const course = await this.courses.findOne({ _id: courseId });
		const classObjectId = course.classId;
		return await this.db.collection('classes').findOne({ _id: classObjectId });
	}
	async addStudentsNotScanned(pdf: pdfMake.documentDefinition, students: Record<string, string>[]) {
		await this.checkWeekEnd();
		const studentsIdentities = [];
		for (const student of students) {
			const studentIdentity = await this.db.collection('users').findOne({ _id: student });
			studentsIdentities.push(
				studentIdentity.profile.firstName + ' ' + studentIdentity.profile.lastName,
			);
		}
		pdf.content.push({
			text: "Étudiants n'ayant pas scanné",
			style: 'header',
		});
		pdf.content.push({
			text: 'Étudiants',
			style: 'subheader',
		});
		pdf.content.push({
			ul: studentsIdentities,
		});
	}

	async addStudentsLateOrLeftEarly(
		pdf: pdfMake.documentDefinition,
		students: Record<string, string>[],
		period: string,
	) {
		await this.checkWeekEnd();
		const studentsIdentities = [];
		for (const student of students) {
			const studentObjectId = new ObjectId(student.student);
			const studentIdentity = await this.db.collection('users').findOne({ _id: studentObjectId });
			const lateOrLeftEarly = period === 'arrival' ? student.late : student.leftEarly;
			const lateOrLeftEarlyText = period === 'arrival' ? 'en retard de ' : 'parti en avance de ';
			studentsIdentities.push(
				studentIdentity.profile.firstName +
					' ' +
					studentIdentity.profile.lastName +
					' ' +
					lateOrLeftEarlyText +
					lateOrLeftEarly[1],
			);
		}

		const text = period === 'arrival' ? 'Étudiants en retard' : 'Étudiants étant partis plus tôt';

		pdf.content.push({
			text: text,
			style: 'header',
		});
		pdf.content.push({
			text: 'Étudiants',
			style: 'subheader',
		});
		pdf.content.push({
			ul: studentsIdentities,
		});
	}
	async savePdf(pdf: pdfMake.documentDefinition) {
		await this.checkWeekEnd();
		try {
			const directoryPath = path.join(__dirname, '..', 'pdf'); // Go up one directory and then specify the directory path where you want to save the PDF
			const fileName = `absences_daily_${new Date().getTime()}.pdf`;
			const filePath = path.join(directoryPath, fileName);

			// Create the directory if it doesn't exist
			if (!fs.existsSync(directoryPath)) {
				fs.mkdirSync(directoryPath, { recursive: true });
			}

			const finalPdf = pdfMake.createPdf(pdf);
			// Get the PDF buffer
			let pdfBuffer = null;
			pdfBuffer = await new Promise((resolve) => {
				finalPdf.getBuffer((buffer: Buffer) => {
					resolve(buffer);
				});
			});

			fs.writeFileSync(filePath, pdfBuffer);
			return filePath;
		} catch (error) {
			console.error('Error saving PDF:', error);
		}
	}

	async deletePdf(attachments: string[]) {
		await this.checkWeekEnd();
		for (const attachment of attachments) {
			fs.unlinkSync(attachment);
		}
	}

	async sendEmail(dailyAbsencesParams: AbsencesParams) {
		await this.checkWeekEnd();
		const courseDate = new Date().toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
		const className = dailyAbsencesParams.classObject.groupTag;

		const attachments = [];
		for (const attachment of dailyAbsencesParams.attachments) {
			const attachmentName = attachment.split('/').pop();
			attachments.push({
				ContentType: 'application/pdf',
				Filename: attachmentName,
				Base64Content: fs.readFileSync(attachment).toString('base64'),
			});
		}

		await this.mailjetService.sendUniversalEmailWithAttachments(
			{
				templateId: dailyAbsencesParams.template,
				recipients: [
					{
						Email: dailyAbsencesParams.supervisor.profile.email,
						Name: dailyAbsencesParams.supervisor.profile.firstName,
					},
				],
				args: { courseDate, className },
			},
			attachments,
		);
	}

	async findOne(query: Filter<Call>, options: FindOneAndUpdateOptions = undefined) {
		return this.calls.findOne(query, options);
	}
	async updateUserPresence(userId: ObjectId, courseId: string, presence: boolean) {
		await this.checkWeekEnd();
		const courseObjectId = new ObjectId(courseId);
		const userObjectId = new ObjectId(userId);
		const course = await this.db.collection('courses').findOne({ _id: courseObjectId });
		const user = await this.db.collection('users').findOne({ _id: userObjectId });
		const date = new Date();
		const period = ['arrival', 'departure'];

		const periodIndex = date.getHours() < 16 ? 0 : 1;
		const call = await this.db
			.collection('calls')
			.findOne({ course: courseObjectId, period: period[periodIndex], date: this.getDate(date) });

		if (!user) {
			throw new ServiceError('NOT_FOUND', 'User not found');
		}

		if (!course) {
			throw new ServiceError('NOT_FOUND', 'Course not found');
		}
		if (!call) {
			// Create a new call if one does not already exist
			await this.db.collection('calls').insertOne({
				course: courseObjectId,
				period: period[periodIndex],
				date: this.getDate(date),
				students: [],
			});
		} else if (call.students.find((student) => student.student == userId)) {
			return {
				message: 'User already registered',
			};
		}

		if (
			(date.getHours() < 8 && date.getMinutes() < 30) ||
			(date.getHours() > 17 && date.getMinutes() > 30)
		) {
			return { message: 'You cannot scan outside of school hours', error: 'Scan out of time' };
		}

		// Update the call with the student's presence
		await this.db.collection('calls').updateOne(
			{ course: courseObjectId, period: period[periodIndex] },
			{
				$push: {
					students: {
						student: userObjectId,
						presence: presence,
						late: this.isStudentLate(period[periodIndex], date),
						leftEarly: this.didStudentLeftEarly(period[periodIndex], date),
					},
				},
			},
		);

		return {
			message: 'User presence updated successfully',
		};
	}

	getDate(date) {
		return new Date(date.getFullYear(), date.getMonth() + 1, date.getDay() + 1);
	}
	isStudentLate(period, timeOfScan) {
		const fakeDate = new Date(
			timeOfScan.getFullYear(),
			timeOfScan.getMonth(),
			timeOfScan.getDate(),
			9,
			0,
			0,
			0,
		);
		if (period === 'arrival') {
			if (timeOfScan >= 9 * 60 * 60 * 1000) {
				const minutesOfLate = Math.floor(
					Math.floor(timeOfScan.getTime() - fakeDate.getTime()) / 1000 / 60,
				);
				const hoursOfLate = Math.floor(minutesOfLate / 60);
				const minutesOfLateConverted = minutesOfLate % 60;
				return [true, `${hoursOfLate}h${minutesOfLateConverted}`];
			}
		}
		return false;
	}

	didStudentLeftEarly(period, timeOfScan) {
		if (period === 'departure') {
			const fakeDate = new Date(
				timeOfScan.getFullYear(),
				timeOfScan.getMonth(),
				timeOfScan.getDate(),
				17,
				0,
				0,
				0,
			);
			if (timeOfScan.getHours() == 14 && timeOfScan.getMinutes() < 50) {
				const minutesOfLate = Math.floor(
					Math.floor(fakeDate.getTime() - timeOfScan.getTime()) / 1000 / 60,
				);
				const hoursOfEarly = Math.floor(minutesOfLate / 60);
				const minutesOfEarlyConverted = minutesOfLate % 60;
				return [true, `${hoursOfEarly}h${minutesOfEarlyConverted}`];
			}
		}
		return false;
	}

	async getActualCourse(userId: ObjectId): Promise<ObjectId | null> {
		const actualDate = new Date();

		const user = await this.db.collection('users').findOne({ _id: userId });
		if (!user) {
			throw new ServiceError('NOT_FOUND', 'User not found');
		}

		const query = {
			periodStart: { $lte: actualDate },
			periodEnd: { $gte: actualDate },
		};

		switch (user.role) {
			case Roles.STUDENT:
				query['classId'] = await this.getStudentClassId(userId);
				break;
			case Roles.PRODUCT_OWNER:
				query['teacherId'] = userId;
				break;
			default:
				throw new Error(`Unknown user role: ${user.role}`);
		}

		const actualCourse = await this.db.collection('courses').findOne(query);
		return actualCourse?._id ?? null;
	}
	async getStudentClassId(userId: ObjectId) {
		const studentClass = await this.db.collection('classes').findOne({
			students: userId,
		});
		return studentClass ? studentClass._id : null;
	}

	async getStudentIdList(courseId: string) {
		const courseObjectId = new ObjectId(courseId);
		const course = await this.db.collection('courses').findOne({ _id: courseObjectId });
		const classId = course.classId;
		const classroom = await this.db.collection('classes').findOne({ _id: classId });

		return classroom.students;
	}

	async getStudentList(courseId: string, studentIdList: Array<ObjectId>) {
		const studentList = await this.db
			.collection('users')
			.find({ _id: { $in: studentIdList } })
			.toArray();

		// Add the student's presence to the student object
		for (let i = 0; i < studentList.length; i++) {
			const student = studentList[i];
			const studentId = student._id.toString();
			const presence = await this.getStudentPresence(courseId, studentId);
			studentList[i] = { ...student, presence: presence };
		}

		return studentList;
	}
	async getStudentIdentity(userId: ObjectId) {
		const userObjectId = new ObjectId(userId);
		return await this.db.collection('users').findOne({ _id: userObjectId });
	}

	async getStudentPresence(courseId: string, studentId: string) {
		const courseObjectId = new ObjectId(courseId);
		const period = ['arrival', 'departure'];
		const date = new Date();
		const periodIndex = date.getHours() < 16 ? 0 : 1;
		let call = null;
		try {
			call = await this.db
				.collection('calls')
				.findOne({ course: courseObjectId, period: period[periodIndex], date: this.getDate(date) });
		} catch (e) {
			console.log(e);
		}

		if (!call) {
			return false;
		}

		const present = call.students.find((student) => student.student == studentId);

		return { present: !!present, late: present?.late[0], leftEarly: present?.leftEarly[0] };
	}

	async createGroups(groups: Array<Array<ObjectId>>, courseId: string) {
		const courseObjectId = new ObjectId(courseId);
		const actualDate = new Date();
		const course = await this.db.collection('courses').findOne({
			_id: courseObjectId,
			periodStart: { $lte: actualDate },
			periodEnd: { $gte: actualDate },
		});
		if (!course) {
			throw new ServiceError('NOT_FOUND', 'Course not found');
		}
		if (!course.groups) {
			await this.db.collection('courses').updateOne(
				{ _id: courseObjectId, periodStart: { $lte: actualDate }, periodEnd: { $gte: actualDate } },
				{
					$set: {
						groups: groups,
					},
				},
			);
		}
		return {
			message: 'Groups updated successfully',
		};
	}

	async createRandomGroups(courseId: string) {
		await this.checkWeekEnd();
		const courseObjectId = new ObjectId(courseId);
		const actualDate = new Date();
		const course = await this.db.collection('courses').findOne({
			_id: courseObjectId,
			periodStart: { $lte: actualDate },
			periodEnd: { $gte: actualDate },
		});
		if (!course) {
			throw new ServiceError('NOT_FOUND', 'Course not found');
		}
		const actualGroups = course.groups;

		// Respect size of groups and number of groups do not change
		if (actualGroups.length == 0) {
			throw new ServiceError('NOT_FOUND', 'Groups not found');
		}
		const students = await this.getStudentIdList(courseId);
		const groups = this.shuffle(students, actualGroups);
		await this.db.collection('courses').updateOne(
			{ _id: courseObjectId, periodStart: { $lte: actualDate }, periodEnd: { $gte: actualDate } },
			{
				$set: {
					groups: groups,
				},
			},
		);
		return {
			message: 'Groups updated successfully',
		};
	}

	shuffle(array: Array<ObjectId>, actualGroups: Array<ObjectId>) {
		const getRandomNumber = () => {
			const randomInt = crypto.randomInt(0, 0xffffffff);
			return randomInt / 0xffffffff;
		};

		const shuffledArray = array.sort(() => getRandomNumber() - 0.5);

		const groups = Array.from({ length: actualGroups.length }, () => []);

		shuffledArray.forEach((item, index) => {
			const groupIndex = index % actualGroups.length;
			groups[groupIndex].push(item);
		});

		return groups;
	}

	async emptyGroups(courseId: string) {
		await this.checkWeekEnd();
		const courseObjectId = new ObjectId(courseId);
		const actualDate = new Date();
		const course = await this.db.collection('courses').findOne({
			_id: courseObjectId,
			periodStart: { $lte: actualDate },
			periodEnd: { $gte: actualDate },
		});
		if (!course) {
			throw new ServiceError('NOT_FOUND', 'Course not found');
		}
		const actualGroups = course.groups;
		const groups = actualGroups.map((group) => Array(group.length).fill(''));

		await this.db.collection('courses').updateOne(
			{ _id: courseObjectId, periodStart: { $lte: actualDate }, periodEnd: { $gte: actualDate } },
			{
				$set: {
					groups: groups,
				},
			},
		);
	}

	async getGroups(courseId: string) {
		const courseObjectId = new ObjectId(courseId);
		const actualDate = new Date();
		const course = await this.db.collection('courses').findOne({
			_id: courseObjectId,
			periodStart: { $lte: actualDate },
			periodEnd: { $gte: actualDate },
		});
		if (!course) {
			throw new ServiceError('NOT_FOUND', 'Course not found');
		}
		// Transform the elements objectId in the group to the user object (to get name firstname etc...)
		for (let i = 0; i < course.groups.length; i++) {
			for (let j = 0; j < course.groups[i].length; j++) {
				if (course.groups[i][j] != '') {
					const userObjectId = new ObjectId(course.groups[i][j]);
					course.groups[i][j] = await this.db.collection('users').findOne({ _id: userObjectId });
				}
			}
		}
		return course.groups;
	}

	async joinGroup(courseId: string, groupId: string, userId: ObjectId) {
		await this.checkWeekEnd();
		const courseObjectId = new ObjectId(courseId);
		const userObjectId = new ObjectId(userId);
		const actualDate = new Date();
		const course = await this.db.collection('courses').findOne({
			_id: courseObjectId,
			periodStart: { $lte: actualDate },
			periodEnd: { $gte: actualDate },
		});
		if (!course) {
			throw new ServiceError('NOT_FOUND', 'Course not found');
		}
		const user = await this.db.collection('users').findOne({
			_id: userObjectId,
		});
		if (!user) {
			throw new ServiceError('NOT_FOUND', 'User not found');
		}
		const group = course.groups[parseInt(groupId['groupId'])];
		if (!group) {
			throw new ServiceError('NOT_FOUND', 'Group not found');
		}
		// Search if he is already in the group
		const userAlreadyInGroup = group.some((memberId) => {
			if (memberId instanceof ObjectId) {
				return memberId.equals(userObjectId);
			}
		});

		if (userAlreadyInGroup) {
			throw new ServiceError('BAD_REQUEST', 'User already in this group');
		}

		let isReplaced = false;
		const newGroup = group.map((user) => {
			if (!isReplaced && user === '') {
				isReplaced = true;
				return userId;
			}
			return user || '';
		});

		if (!isReplaced) {
			throw new ServiceError('BAD_REQUEST', 'This group is already full');
		}

		let isPresent = false;
		let ancientGroup = null;
		let ancientGroupId = null;
		course.groups.find((group) => {
			group.some((memberId) => {
				if (memberId instanceof ObjectId) {
					if (memberId.equals(userObjectId)) {
						isPresent = true;
						ancientGroup = group;
						ancientGroupId = course.groups.indexOf(group);
						return true;
					}
					return memberId.equals(userObjectId);
				}
			});
		});

		if (isPresent) {
			// Remove him from the other group and add him to the new one
			const updatedGroup = ancientGroup.map((member) => {
				if (member instanceof ObjectId) {
					if (member.equals(userObjectId)) {
						return '';
					}
				}
				return member || '';
			});

			await this.leavingGroup(courseObjectId, actualDate, course, ancientGroupId, updatedGroup);

			course.groups[ancientGroupId] = updatedGroup;
		}

		await this.joiningGroup(courseObjectId, actualDate, course, groupId, newGroup);

		return {
			message: 'User joined group successfully',
		};
	}
	async joiningGroup(courseObjectId, actualDate, course, groupId, newGroup) {
		await this.checkWeekEnd();
		await this.db.collection('courses').updateOne(
			{ _id: courseObjectId, periodStart: { $lte: actualDate }, periodEnd: { $gte: actualDate } },
			{
				$set: {
					groups: course.groups.map((group, index) => {
						if (index == parseInt(groupId['groupId'])) {
							return newGroup;
						}
						return group;
					}),
				},
			},
		);
	}
	async leavingGroup(courseObjectId, actualDate, course, ancientGroupId, updatedGroup) {
		await this.checkWeekEnd();
		await this.db.collection('courses').updateOne(
			{ _id: courseObjectId, periodStart: { $lte: actualDate }, periodEnd: { $gte: actualDate } },
			{
				$set: {
					groups: course.groups.map((group, index) => {
						if (index === ancientGroupId) {
							return updatedGroup;
						}
						return group;
					}),
				},
			},
		);
	}

	async getStudentsScanned(_id: InferIdType<Course>, period: string) {
		const course = await this.db.collection('courses').findOne({ _id });

		if (!course) {
			throw new ServiceError('NOT_FOUND', 'Course not found');
		}
		const actualDate = new Date();
		if (actualDate < course.periodStart || actualDate > course.periodEnd) {
			throw new ServiceError('BAD_REQUEST', 'Course is not active');
		}

		// Search in calls if the user is present
		const call = await this.db
			.collection('calls')
			.findOne({ course: _id, period: period, date: this.getDate(actualDate) });

		if (!call) {
			return [];
		}

		return call.students.map((student) => {
			return student;
		});
	}

	async getStudentsLateOrLeftEarly(_id: InferIdType<Course>, period: string) {
		const course = await this.db.collection('courses').findOne({ _id });

		if (!course) {
			throw new ServiceError('NOT_FOUND', 'Course not found');
		}
		const actualDate = new Date();
		if (actualDate < course.periodStart || actualDate > course.periodEnd) {
			throw new ServiceError('BAD_REQUEST', 'Course is not active');
		}

		// Search in calls if the user is present
		const call = await this.db
			.collection('calls')
			.findOne({ course: _id, period: period, date: this.getDate(actualDate) });

		if (!call) {
			return [];
		}

		const students = call.students.map((student) => {
			return student;
		});

		return students.filter((student) => {
			if (student.late?.[0] || student.leftEarly?.[0]) {
				return [student + (student.late[1] || student.leftEarly[1])];
			}
		});
	}

	async generatePdf(courseId: InferIdType<Course>, period: string) {
		// Generate a pdf empty that is named with the date and the class
		const course = await this.db.collection('courses').findOne({ _id: courseId });
		if (!course) {
			throw new ServiceError('NOT_FOUND', 'Course not found');
		}
		const actualDate = new Date();
		if (actualDate < course.periodStart || actualDate > course.periodEnd) {
			throw new ServiceError('BAD_REQUEST', 'Course is not active');
		}

		// Use pdfmake to create the pdf
		pdfMake.vfs = pdfFonts.pdfMake.vfs;
		pdfMake.vfs = pdfFonts.pdfMake.vfs;
		const periodName = period == 'arrival' ? 'matin' : 'après-midi';

		function createPDF() {
			// Create an empty pdf
			return {
				info: {
					title: 'Absences',
				},
				content: [
					{
						text:
							course.tag +
							' ' +
							'Absences et Retards' +
							' du ' +
							actualDate.toISOString().split('T')[0] +
							' ' +
							periodName,
						fontSize: 20,
						alignment: 'center',
						margin: [0, 0, 0, 20],
					},
				],
			};
		}
		return createPDF();
	}
}
