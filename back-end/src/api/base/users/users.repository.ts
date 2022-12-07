import { mongodb } from '@/config/config';
import { ObjectId } from 'mongodb';
import { PedagoProfile, ProductOwnerProfile, Student, User, UserProfile } from './interfaces/users.interface';

export class UsersRepository {
static users = mongodb.collection<User>('users');

constructor(
	public profile: UserProfile,
	public status: number,
	public _id?: ObjectId,
	public pedago?: PedagoProfile,
	public productOwner?: ProductOwnerProfile,
	public student?: Student,
) {}

	async userExist() {
		return UsersRepository.users.findOne({ _id: this._id}, {projection: {_id: 1}})
	}
	// Mongo repo for the users collection
}
