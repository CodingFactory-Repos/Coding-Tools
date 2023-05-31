import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CallsRepository } from '@/base/calls/calls.repository';
import { AbsencesParams } from '@/base/calls/interfaces/calls.interface';
import { MaijetTemplate } from 'src/common/providers/interfaces/events.interface';

@Injectable()
export class CronService {
	constructor(private readonly callsRepository: CallsRepository) {}

	@Cron('* * * * * *')
	async handleCron() {
		console.log('Called Every Minute');
		// Do a request to the db to get all the courses that are currently running
		const courses = await this.callsRepository.getActualCourses();
		// console.log('Courses well retrieved');
		//console.log(courses.length);
		// For each course, get the list of students that has scanned on this day
		const periods = ['arrival', 'departure'];
		for (const course of courses) {
			const attachments = [];
			// Get the class of the course (search into "classes" the classId of the course
			const classObject = await this.callsRepository.getClass(course._id);
			// console.log('Class well retrieved');
			// console.log(classObject._id);
			const supervisor = await this.callsRepository.getClassSupervisor(course._id);
			// console.log('Supervisor well retrieved');
			console.log(supervisor.profile.firstName);
			for (const period of periods) {
				const pdf = await this.callsRepository.generatePdf(course._id, period);
				// console.log('PDF well generated');
				const studentsScanned = await this.callsRepository.getStudentsScanned(course._id, period);
				// console.log('Students well retrieved');
				//console.log(studentsScanned.length);
				const studentsNotScanned = classObject.students.filter(
					(student) => !studentsScanned.includes(student),
				);
				// console.log('Students well filtered');
				//console.log(studentsNotScanned.length);
				if (studentsNotScanned.length > 0) {
					await this.callsRepository.addStudentsNotScanned(pdf, studentsNotScanned, period);
					// Console.log the content of the pdf
					console.log(pdf);
				}
				// console.log('Students well added');

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
				//console.log(attachments.length);
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
				console.log(attachments)

				await this.callsRepository.sendEmail(dailyAbsencesParams);
				console.log('Email well sent');
				await this.callsRepository.deletePdf(attachments);
			}
		}
	}
}
