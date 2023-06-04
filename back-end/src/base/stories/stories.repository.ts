import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Story } from 'src/base/stories/interfaces/stories.interface';

@Injectable()
export class StoriesRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get Backlogs() {
		return this.db.collection<Story>('Backlogs');
	}

	async createBacklog(query: Story) {
		return this.Backlogs.insertOne(query);
	}

	async updateOneBacklog(
		query: Filter<Story>,
		update: Partial<Story> | UpdateFilter<Story>,
	) {
		return this.Backlogs.updateOne(query, update);
	}

	async findOneAndUpdateBacklog(
		query: Filter<Story>,
		update: Partial<Story>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.Backlogs.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Story>, options: FindOneAndUpdateOptions = undefined) {
		return this.Backlogs.findOne(query, options);
	}

	async BacklogExist(query: Filter<Story>) {
		const options = { projection: { _id: 1 } };
		return this.Backlogs.findOne(query, options);
	}
}
