export const USER_GITHUB_PROJECTION = {
	projection: {
		profile: {
			githubProfile: 1,
		}
	}
}

export const USER_GROUPNAME_PROJECTION = {
	projection: {
		schoolProfile: {
			groupName: 1
		}
	}
}

export const USER_PROFILE_LIST_PROJECTION = {
	projection: {
		_id: 0,
		profile: {
			firstName: 1,
			lastName: 1,
			picture: 1,
		}
	}
}