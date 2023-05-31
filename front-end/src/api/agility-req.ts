import { SerializedContainer } from '@/lib/pixi-tools-v2/types/pixi-serialize';
import { ProjectMeta, ProjectMetaDetails } from '../store/interfaces/agility.interface';

import { http } from '@/api/network/axios';
import { AgilityTemplateMeta } from '@/store/interfaces/agility.interface';
import { Status } from '@/store/interfaces/axios.interface';
import { AxiosResponse } from 'axios';
import { UserCanvasList } from '@/store/interfaces/user.interface';

export const apiTryGetTemplatesMeta = () => {
	// Call

	return Promise.resolve<Partial<AxiosResponse<Status<AgilityTemplateMeta>, unknown>>>({
		data: {
			status: 'ok',
			metaTemplates: [
				{
					key: 'something',
					url: 'https://bluemelondesign.com/wp-content/uploads/2020/11/Body-Image-1-1024x597.png',
					name: 'empathy map',
					isNew: false,
					type: 'empathymap'
				},
				{
					key: 'something',
					url: 'https://slidemodel.com/wp-content/uploads/01-preparing-an-elevator-pitch-cover.png',
					name: 'elevator pitch',
					isNew: true,
					type: 'elevatorpitch'
				},
				{
					key: 'something',
					url: 'https://draft.io/assets/site/examples/light/en/1200/example-impact-mapping-3e12e17fb4ab1cdd63cd08c3561c3cda.webp',
					name: 'impact mapping',
					isNew: true,
					type: 'impactmapping'
				},
				{
					key: 'something',
					url: 'https://www.imagescreations.fr/wp-content/uploads/persona_emma-1200x800.jpg',
					name: 'personas',
					isNew: true,
					type: 'impactmapping'
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
