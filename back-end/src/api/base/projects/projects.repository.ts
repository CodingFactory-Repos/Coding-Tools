import { mongodb } from '@/config/config';
import { ObjectId, Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { Project } from './interfaces/projects.interface';

export class ProjectsRepository {
	static projectsCollection = mongodb.collection<Project>('projects');

	get projects() {
		return ProjectsRepository.projectsCollection;
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

	async projectExist(query: Filter<Project>) {
		const options = { projection: { _id: 1 } };
		return this.projects.findOne(query, options);
	}
	// Mongo repo for the projects collection
}
