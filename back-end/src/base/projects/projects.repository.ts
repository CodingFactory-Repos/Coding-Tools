import { Inject, Injectable } from '@nestjs/common';
import { ObjectId, Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Project } from 'src/base/projects/interfaces/projects.interface';

@Injectable()
export class ProjectsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get stories() {
		return this.db.collection<Project>('projects');
	}

	async getProject() {
		return this.stories.find().toArray();
	}

	async createProject(query: Project) {
		return this.stories.insertOne(query);
	}

	async getProjectById(id: ObjectId) {
		id = new ObjectId(id);
		return this.stories.findOne({ _id: id });
	}

	async getProjectByCourseOrCreator(id) {
		id = new ObjectId(id);
		return this.stories.find({ $or: [{ course: id }, { creator: id }] }).toArray();
	}

	//New method to query by user in group member array
	async getProjectByGroupMember(id) {
		id = new ObjectId(id);
		return this.stories.find({ group: { $elemMatch: { $eq: id } } }).toArray();
	}

	async getProjectByCourseAndMembers(courseId, userId) {
		courseId = new ObjectId(courseId);
		return this.stories.findOne({ $and: [{course: courseId}, {group: { $elemMatch: { $eq: userId }} }] });
	}

	async updateOneProject(
		query: Filter<Project>,
		update: Partial<Project> | UpdateFilter<Project>,
	) {
		return this.stories.updateOne(query, update);
	}

	async findOneAndUpdateProject(
		query: Filter<Project>,
		update: Partial<Project>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.stories.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Project>, options: FindOneAndUpdateOptions = undefined) {
		return this.stories.findOne(query, options);
	}

	async getProjectByCourseId(id: ObjectId) {
		id = new ObjectId(id);
		return this.stories.find({ course: id }).toArray();
	}

	async deleteOneProject(id: ObjectId) {
		id = new ObjectId(id);
		return this.stories.deleteOne({ _id: id });
	}
}
