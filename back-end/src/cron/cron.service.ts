import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CallsRepository } from '@/base/calls/calls.repository';
import { AbsencesParams } from '@/base/calls/interfaces/calls.interface';
import { MaijetTemplate } from 'src/common/providers/interfaces/events.interface';

@Injectable()
export class CronService {
	constructor(private readonly callsRepository: CallsRepository) {}

	@Cron('0 18 * * *')
	async handleCron() {
		console.log('Called Every Minute');
		const courses = await this.callsRepository.getActualCourses();
		const periods = ['arrival', 'departure'];
		for (const course of courses) {
			const attachments = [];
			const classObject = await this.callsRepository.getClass(course._id);
			const supervisor = await this.callsRepository.getClassSupervisor(course._id);
			console.log(supervisor.profile.firstName);
			for (const period of periods) {
				const pdf = await this.callsRepository.generatePdf(course._id, period);
				const studentsScanned = await this.callsRepository.getStudentsScanned(course._id, period);
				const studentsNotScanned = classObject.students.filter(
					(student) => !studentsScanned.includes(student),
				);
				if (studentsNotScanned.length > 0) {
					await this.callsRepository.addStudentsNotScanned(pdf, studentsNotScanned, period);
					// Console.log the content of the pdf
					console.log(pdf);
				}

				// Get the list of students that were late or that left early
				const studentsLateOrLeftEarly = await this.callsRepository.getStudentsLateOrLeftEarly(
					course._id,
					period,
				);

				console.log('Students late or left early ' + studentsLateOrLeftEarly.length);
				if (studentsLateOrLeftEarly.length > 0) {
					await this.callsRepository.addStudentsLateOrLeftEarly(
						pdf,
						studentsLateOrLeftEarly,
						period,
					);
					console.log(pdf.content);
				}
				console.log('Students well added late or early');
				if (studentsNotScanned.length > 0 || studentsLateOrLeftEarly.length > 0) {
					// Save the pdf into a file and add it to the attachments
					const pdf_path = await this.callsRepository.savePdf(pdf);
					// Add the path of the pdf to the attachments
					attachments.push(pdf_path);
				}
				console.log('PDF well added to attachments');
			}
			// If attachments is not empty
			if (attachments.length > 0) {
				const template = MaijetTemplate.dailyAbsence;

				const dailyAbsencesParams: AbsencesParams = {
					supervisor,
					attachments,
					classObject,
					course,
					template,
				};
				console.log('Params well retrieved');

				await this.callsRepository.sendEmail(dailyAbsencesParams);
				console.log('Email well sent');
				await this.callsRepository.deletePdf(attachments);
			}
		}
	}
}
