import { http } from '@/api/network/axios';
import { Material, UserInfo } from '@/store/interfaces/material.interface';
import { Status } from '@/store/interfaces/axios.interface';

export const getMaterials = async () => {
	return http.get<Status<{ materials: Material[] }>>('/materials');
};

export const createMaterial = async (material: Material) => {
	return http.post<Status<Material>>('/materials/create', material);
};

export const updateMaterial = async (material: Material, id: string) => {
	return http.put<Status<Material>>(`materials/update/${id}`, material);
};

export const deleteMaterial = async (id: string) => {
	return http.delete<Status<Material>>(`materials/delete/${id}`);
};

export const getUserInfo = async (userId: string) => {
	return http.get<Status<UserInfo>>(`materials/user/${userId}`);
};
