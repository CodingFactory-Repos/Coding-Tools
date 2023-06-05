import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { Story } from 'src/base/stories/interfaces/stories.interface';

@Injectable()
export class StoriesRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get Stories() {
		return this.db.collection<Story>('Stories');
	}

	async createStory(query: Story) {
		return this.Stories.insertOne(query);
	}

	async updateOneStory(
		query: Filter<Story>,
		update: Partial<Story> | UpdateFilter<Story>,
	) {
		return this.Stories.updateOne(query, update);
	}

	async findOneAndUpdateStory(
		query: Filter<Story>,
		update: Partial<Story>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.Stories.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Story>, options: FindOneAndUpdateOptions = undefined) {
		return this.Stories.findOne(query, options);
	}
}
