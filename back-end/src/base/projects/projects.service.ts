import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { ProjectsRepository } from 'src/base/projects/projects.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class ProjectsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => ProjectsRepository))
		private usersRepository: UsersRepository,
		private projectsRepository: ProjectsRepository,
	) {}

	async getProject() {
		return await this.projectsRepository.getProject();
	}

	async getProjectByCourseOrCreator(id) {
		return await this.projectsRepository.getProjectByCourseOrCreator(id);
	}

	async getProjectByGroupMember(id) {
		return await this.projectsRepository.getProjectByGroupMember(id);
	}

	async getProjectByCourseAndMembers(courseId, userId) {
		return await this.projectsRepository.getProjectByCourseAndMembers(courseId, userId);
	}

	async createProject(query) {
		return await this.projectsRepository.createProject(query);
	}

	async updateProject(query, update) {
		return await this.projectsRepository.updateOneProject(query, update);
	}

	async getProjectById(id) {
		return await this.projectsRepository.getProjectById(id);
	}

	async getProjectByCourseId(id) {
		return await this.projectsRepository.getProjectByCourseId(id);
	}

	async deleteProjectById(id) {
		return await this.projectsRepository.deleteOneProject(id);
	}
}
