import { Inject, Injectable } from '@nestjs/common';
import { ObjectId, Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Story } from 'src/base/stories/interfaces/stories.interface';

@Injectable()
export class StoriesRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get stories() {
		return this.db.collection<Story>('stories');
	}

	async getStory() {
		return this.stories.find().toArray();
	}

	async createStory(query: Story) {
		return this.stories.insertOne(query);
	}

	async getStoryById(id: ObjectId) {
		id = new ObjectId(id);
		return this.stories.findOne({ _id: id });
	}

	async updateOneStory(
		query: Filter<Story>,
		update: Partial<Story> | UpdateFilter<Story>,
	) {
		return this.stories.updateOne(query, update);
	}

	async findOneAndUpdateStory(
		query: Filter<Story>,
		update: Partial<Story>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.stories.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Story>, options: FindOneAndUpdateOptions = undefined) {
		return this.stories.findOne(query, options);
	}

	async getStoryByCourseId(id: ObjectId) {
		id = new ObjectId(id);
		return this.stories.find({ course: id }).toArray();
	}

	async deleteOneStory(id: ObjectId) {
		id = new ObjectId(id);
		return this.stories.deleteOne({ _id: id });
	}
}
