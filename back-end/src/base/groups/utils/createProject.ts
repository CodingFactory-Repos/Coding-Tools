import { Course } from '@/base/courses/interfaces/courses.interface';
import { Retrospective } from '@/base/retrospectives/interfaces/retrospectives.interface';
import { User } from '@/base/users/interfaces/users.interface';
import { generateCodeToken } from '@/common/helpers/string.helper';
import { ObjectId } from 'mongodb';

export const createRetroGroup = (course: Course, user: User) => {
	const date = new Date();
	const slug = generateCodeToken();

	const retro = {
		title: `retro ${course.tag}`,
		optionTemplate: 1,
		participants: [],
		postits: {
			1: [],
			2: [],
			3: [],
		},
		endedAt: null,
		isRetroEnded: false,
		isLocked: false,
		isTimerRunning: false,
		timerInterval: null,
		timePassed: 0,
		associatedCourse: course,
		createdAt: date,
		creator: user.profile.email,
		slug: slug,
		allowedPeers: [],
	} as unknown as Retrospective;

	retro.participants.push(user.profile.email);
	retro.allowedPeers.push(new ObjectId(user._id));
	course.groups.forEach((groups) =>
		groups.group.forEach((users) => retro.allowedPeers.push(users)),
	);

	return retro;
};
