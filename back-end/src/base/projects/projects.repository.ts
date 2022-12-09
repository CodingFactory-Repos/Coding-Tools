import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Project } from 'src/base/projects/interfaces/projects.interface';

@Injectable()
export class ProjectsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get projects() {
		return this.db.collection<Project>('projects');
	}

	async createProject(query: Project) {
		return this.projects.insertOne(query);
	}

	async updateOneproject(query: Filter<Project>, update: Partial<Project> | UpdateFilter<Project>) {
		return this.projects.updateOne(query, update);
	}

	async findOneAndUpdateProject(
		query: Filter<Project>,
		update: Partial<Project>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.projects.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Project>, options: FindOneAndUpdateOptions = undefined) {
		return this.projects.findOne(query, options);
	}

	async projectExist(query: Filter<Project>) {
		const options = { projection: { _id: 1 } };
		return this.projects.findOne(query, options);
	}
}
