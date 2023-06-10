import { SerializedContainer } from '@/lib/pixi-tools-v2/types/pixi-serialize';
import { ProjectMeta, ProjectMetaDetails } from '../store/interfaces/agility.interface';

import { http } from '@/api/network/axios';
import { AgilityTemplateMeta } from '@/store/interfaces/agility.interface';
import { Status } from '@/store/interfaces/axios.interface';
import { AxiosResponse } from 'axios';
import { UserCanvasList } from '@/store/interfaces/user.interface';
import { BlueprintKey } from '@/lib/pixi-tools-v2/types/pixi-enums';

export const apiTryGetTemplatesMeta = () => {
	// Call

	return Promise.resolve<Partial<AxiosResponse<Status<AgilityTemplateMeta>, unknown>>>({
		data: {
			status: 'ok',
			metaTemplates: [
				{
					key: BlueprintKey.IMPACT_MAPPING,
					url: '/impact_mapping.webp',
					name: 'impact mapping',
					isNew: true,
					type: 'impactmapping',
				},
				{
					key: BlueprintKey.EMPATHY_MAP,
					url: '/empathy_map.webp',
					name: 'empathy map',
					isNew: true,
					type: 'empathymap',
				},
				{
					key: BlueprintKey.PERSONA,
					url: '/persona.webp',
					name: 'personas',
					isNew: true,
					type: 'personas',
				},
				{
					key: BlueprintKey.PRUNE_THE_PROJECT_TREE,
					url: '/prune_the_project_tree.webp',
					name: 'prune the project tree',
					isNew: true,
					type: 'prunetheprojecttree',
				},
				{
					key: BlueprintKey.ELEVATOR_PITCH,
					url: '/elevator_pitch.webp',
					name: 'elevator pitch',
					isNew: true,
					type: 'elevatorpitch',
				},
			],
		},
	});
};

export const apiTryGetProjectsMeta = () => {
	return http.get<Status<{ projects: Array<ProjectMeta> }>>('/canvas-room/list');
};

export const apiTryCreateNewProject = () => {
	return http.post<Status<{ roomId: string }>>('/canvas-room/new');
};

export const apiTryGetRoomProject = (roomId: string) => {
	return http.get<Status<{ project: Array<SerializedContainer>; isOwner: boolean }>>(
		`/canvas-room/${roomId}`,
	);
};

export const apiTrySaveProjectMeta = (meta: ProjectMetaDetails, roomId: string) => {
	return http.post<Status<{ updatedAt: string }>>(`/canvas-room/save-meta/${roomId}`, meta);
};

export const apiTryGetRoomAccess = (roomId: string) => {
	return http.get<Status>(`/canvas-room/${roomId}/verify`);
};

export const apiTryDeleteProject = (roomId: string) => {
	return http.delete<Status>(`/canvas-room/${roomId}`);
};

export const apiTrySendProjectInvitation = (userId: string, roomId: string) => {
	return http.post<Status>(`/canvas-room/invitation/${roomId}`, { userId });
};

export const apiTryVerifyInvitationToken = (token: string) => {
	return http.post<Status<{ roomId: string }>>('/canvas-room/verify-invitation', { token });
};

export const apiTryGetAccessUsers = (roomId: string) => {
	return http.get<Status<{ users: Array<UserCanvasList> }>>(`/canvas-room/${roomId}/users-access`);
};

export const apiTryRemoveUserAccess = (userId: string, roomId: string) => {
	return http.post<Status>(`/canvas-room/${roomId}/remove-access`, { userId });
};
