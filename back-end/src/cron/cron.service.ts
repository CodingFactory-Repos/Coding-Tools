import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CallsRepository } from '@/base/calls/calls.repository';
import { AbsencesParams } from '@/base/calls/interfaces/calls.interface';
import { MailjetTemplate } from 'src/common/providers/interfaces/events.interface';
import { ArticlesService } from '@/base/articles/articles.service';

@Injectable()
export class CronService {
	constructor(
		private readonly callsRepository: CallsRepository,
		private readonly articlesService: ArticlesService,
	) {}

	@Cron('0 18 * * 1-5')
	async handleCron() {
		const courses = await this.callsRepository.getActualCourses();
		const periods = ['arrival', 'departure'];

		for (const course of courses) {
			const attachments = [];
			const classObject = await this.callsRepository.getClass(course._id);
			const supervisor = await this.callsRepository.getClassSupervisor(course._id);

			for (const period of periods) {
				const pdf = await this.callsRepository.generatePdf(course._id, period);
				const studentsScanned = await this.callsRepository.getStudentsScanned(course._id, period);
				const studentsNotScanned = this.getStudentsNotScanned(
					classObject.students,
					studentsScanned,
				);

				if (studentsNotScanned.length > 0) {
					await this.callsRepository.addStudentsNotScanned(pdf, studentsNotScanned);
				}

				const studentsLateOrLeftEarly = await this.callsRepository.getStudentsLateOrLeftEarly(
					course._id,
					period,
				);

				if (studentsLateOrLeftEarly.length > 0) {
					await this.callsRepository.addStudentsLateOrLeftEarly(
						pdf,
						studentsLateOrLeftEarly,
						period,
					);
				}

				if (studentsNotScanned.length > 0 || studentsLateOrLeftEarly.length > 0) {
					const pdfPath = await this.callsRepository.savePdf(pdf);
					attachments.push(pdfPath);
				}
			}

			if (attachments.length > 0) {
				await this.sendDailyAbsencesEmail(supervisor, attachments, classObject, course);
				await this.callsRepository.deletePdf(attachments);
			}
		}
	}

	getStudentsNotScanned(allStudents, scannedStudents) {
		return allStudents.filter((student) => !scannedStudents.includes(student));
	}

	async sendDailyAbsencesEmail(supervisor, attachments, classObject, course) {
		const template = MailjetTemplate.dailyAbsence;

		const dailyAbsencesParams: AbsencesParams = {
			supervisor,
			attachments,
			classObject,
			course,
			template,
		};

		await this.callsRepository.sendEmail(dailyAbsencesParams);
	}

	@Cron('0 6 * * *')
	async handleAutoTutoValidation(){

		// date two weeks ago
		const dateMinusTwoWeeks = new Date(Date.now() - 12096e5);

		// select params
		const query = {
			type: 'Tuto',
			status: "Pending",
			date: { $lt : dateMinusTwoWeeks.toISOString() },
		}

		// fields updated
		const updateParams = {
			status: 'Accepted'
		}

		await this.articlesService.updateManyArticles(query, updateParams)
	}

}
