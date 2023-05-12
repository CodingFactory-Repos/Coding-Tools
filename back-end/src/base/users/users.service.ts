import { ObjectId } from 'mongodb';
import { Inject, Injectable, forwardRef, Logger as NestLogger } from '@nestjs/common';
import { UsersRepository } from '@/base/users/users.repository';
import { ServiceError } from '@/common/decorators/catch.decorator';
import { USER_GITHUB_PROJECTION, USER_GROUPNAME_PROJECTION, USER_PROFILE_LIST_PROJECTION, USER_RELATED_PROFILE } from '@/base/users/utils/users.projection';
import axios, { AxiosResponse } from 'axios';
import { ProfileBodyDTO } from '@/base/users/dto/users.dto';
import { flatten } from 'mongo-dot-notation';
import { UserProfileList } from './interfaces/users.interface';

@Injectable()
export class UsersService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		private usersRepository: UsersRepository,
	) {}

	private readonly githubUserRegex = /^https:\/\/github\.com\/([^\/?&]+)/i;
	private readonly githubStatLinkTemplate = "https://github-readme-stats-sigma-five.vercel.app/api?username=$USERNAME$&theme=jolly&hide_border=false&include_all_commits=true&count_private=true";
	private readonly githubLanguagesLinkTemplate = "https://github-readme-stats-sigma-five.vercel.app/api/top-langs/?username=$USERNAME$&theme=jolly&hide_border=false&include_all_commits=true&count_private=true&layout=compact";

	async getGithubStat(id: string) {
		try {
			const userId = new ObjectId(id);
			const githubProfile = await this._getGithubProfile(userId);
			if(!githubProfile && githubProfile !== "") return null;

			const githubUsername = "Maghwyn" ?? githubProfile.match(this.githubUserRegex)[0];
			const document = await axios.get(this.githubStatLinkTemplate.replace("$USERNAME$", githubUsername))
				.then((response: AxiosResponse) => response.data as string);

			return document;
		} catch(err) {
			if(err instanceof Error) {
				NestLogger.error("users.service [getGithubStat] : " + err.message);
			}
			return null;
		}
	}

	async getGithubLanguages(userId: ObjectId) {
		const githubProfile = await this._getGithubProfile(userId);
		if(!githubProfile && githubProfile !== "") return null;

		try {
			const githubUsername = "Maghwyn" ?? githubProfile.match(this.githubUserRegex)[0];
			const document = await axios.get(this.githubLanguagesLinkTemplate.replace("$USERNAME$", githubUsername))
				.then((response: AxiosResponse) => response.data as string);

			return document;
		} catch(err) {
			if(err instanceof Error) {
				NestLogger.error("users.service [getGithubLanguages] : " + err.message);
			}
			return null;
		}
	}

	async _getGithubProfile(userId: ObjectId) {
		const user = await this.usersRepository.findOne({ _id: userId }, USER_GITHUB_PROJECTION);
		if(user === null)
			throw new ServiceError(
				"UNAUTHORIZED",
				"You do not have the required permissions to access this ressource"
			);

		return user?.profile?.githubProfile;
	}

	async updateUserProfile(userId: ObjectId, body: ProfileBodyDTO) {
		//! if the user is a PO, he can't submit the disciplines taught

		const update = flatten(body);
		const query = { _id: userId };
		await this.usersRepository.updateOneUser(query, update);
	}

	async getUserProfileList(userId: ObjectId) {
		const user = await this.usersRepository.findOne(
			{ _id: userId },
			USER_GROUPNAME_PROJECTION,
		);

		if(!user) {
			throw new ServiceError("UNAUTHORIZED", "You do not have the rights to access this ressources")
		}

		const usersList = await this.usersRepository.findMany(
			{
				"schoolProfile.groupName": user.schoolProfile.groupName,
				_id: { $ne: userId }
			},
			USER_PROFILE_LIST_PROJECTION,
		);

		const userListInfo: Array<UserProfileList> = [];
		for(let n = 0; n < usersList.length; n++) {
			userListInfo.push({
				picture: usersList[n].profile.picture,
				firstName: usersList[n].profile.firstName,
				lastName: usersList[n].profile.lastName,
				id: usersList[n]._id.toString(),
			})
		}

		return userListInfo;
	}

	async getRelatedUserProfile(id: string) {
		try {
			if(!id && id === "null") throw new Error();
			const userId = new ObjectId(id)
			const query = { _id: userId };
			const user = await this.usersRepository.findOne(query, USER_RELATED_PROFILE);
			if(!user)  throw new Error();
			
			const userListInfo = await this.getUserProfileList(userId);
			return { user, related: userListInfo };
		} catch(err) {
			throw new ServiceError("BAD_REQUEST", "Invalid payload")
		}
	}
}
