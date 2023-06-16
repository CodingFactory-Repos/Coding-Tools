import { Inject, Injectable } from '@nestjs/common';
import { ObjectId, Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Project } from 'src/base/projects/interfaces/projects.interface';

@Injectable()
export class ProjectsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get projects() {
		return this.db.collection<Project>('projects');
	}

	async getProject() {
		return this.projects.find().toArray();
	}

	async addMember(id, query) {
		
		id = new ObjectId(id);
		this.projects.updateOne({ _id: id }, { $push: { group: query.userId } }).then((result) => {
			return result;
		});
	}

	async createProject(query: Project) {
		return this.projects.insertOne(query);
	}

	async getProjectById(id: ObjectId) {
		id = new ObjectId(id);
		return this.projects.findOne({ _id: id });
	}

	async getProjectByCourseOrCreator(id) {
		id = new ObjectId(id);
		return this.projects.find({ $or: [{ course: id }, { creator: id }] }).toArray();
	}

	//New method to query by user in group member array
	async getProjectByGroupMember(id) {
		let query = { group: { $elemMatch: { $eq: id } } };
		return this.projects.find(query).toArray();
	}

	async getProjectByCourseAndMembers(courseId, userId) {
		courseId = new ObjectId(courseId);
		return this.projects.findOne({ $and: [{course: courseId}, {group: { $elemMatch: { $eq: userId }} }] });
	}

	async updateOneProject(id, update: Partial<Project>) {
		let query = { _id: new ObjectId(id) };
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

	async getProjectByCourseId(id: ObjectId) {
		id = new ObjectId(id);
		return this.projects.find({ course: id }).toArray();
	}

	async deleteOneProject(id: ObjectId) {
		id = new ObjectId(id);
		return this.projects.deleteOne({ _id: id });
	}
}
