import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db, ObjectId } from 'mongodb';

import { Project } from 'src/base/projects/interfaces/projects.interface';

@Injectable()
export class ProjectsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get projects() {
		return this.db.collection<Project>('projects');
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

	// async createProject(query: Project) {
	// 	const { equipmentId, userId } = query;
	// 	await this.projects.insertOne({
	// 		...query,
	// 		projectId: new ObjectId(projectId),
	// 		userId: new ObjectId(userId),
	// 		date: new Date(),
	// 	});
	// 	return this.projects
	// 		.aggregate([
	// 			{ $match: { equipmentId: new ObjectId(equipmentId) } },
	// 			{
	// 				$lookup: {
	// 					from: 'users',
	// 					localField: 'userId',
	// 					foreignField: '_id',
	// 					as: 'user',
	// 				},
	// 			},
	// 		])
	// 		.toArray();
	// }
}
