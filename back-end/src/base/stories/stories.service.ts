import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { StoriesRepository } from 'src/base/stories/stories.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class StoriesService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => StoriesRepository))
		private usersRepository: UsersRepository,
		private storiesRepository: StoriesRepository,
	) {}

	async getStory() {
		return await this.storiesRepository.getStory();
	}

	// Function to add an article
	async createStory(query) {
		return await this.storiesRepository.createStory(query);
	}

	async updateStory(id, queryStory) {
		return await this.storiesRepository.updateOneStory({ _id: new ObjectId(id) }, queryStory);
	}

	async getStoryById(id) {
		return await this.storiesRepository.getStoryById(id);
	}

	async getStoryByCourseId(id) {
		return await this.storiesRepository.getStoryByCourseId(id);
	}

	async getStoryByBoardId(id) {
		return await this.storiesRepository.getStoryByBoardId(id);
	}


	async deleteStoryById(id) {
		return await this.storiesRepository.deleteOneStory(id);
	}
}
