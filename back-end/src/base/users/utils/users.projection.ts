export const USER_GITHUB_PROJECTION = {
	projection: {
		profile: {
			githubProfile: 1,
		},
	},
};

export const USER_GROUPNAME_PROJECTION = {
	projection: {
		schoolProfile: {
			groupName: 1,
		},
	},
};

export const USER_PROFILE_LIST_PROJECTION = {
	projection: {
		_id: 1,
		profile: {
			firstName: 1,
			lastName: 1,
			picture: 1,
		},
	},
};

export const USER_RELATED_PROFILE = {
	projection: {
		_id: 0,
		role: 1,
		profile: {
			firstName: 1,
			lastName: 1,
			resume: 1,
			phone: 1,
			birthDate: 1,
			linkedinProfile: 1,
			githubProfile: 1,
			discordTag: 1,
			picture: 1,
			background: 1,
			showGithubStat: 1,
			disciplinesLiked: 1,
			portfolio: 1,
		},
		schoolProfile: {
			groupName: 1,
			campus: 1,
		},
		businessProfile: {
			disciplinesTaught: 1,
			companyJob: 1,
			companyName: 1,
			companyLink: 1,
			companyLogo: 1,
			workingFrom: 1,
			workingTo: 1,
		},
	},
};
