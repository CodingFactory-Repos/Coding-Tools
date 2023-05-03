import { http } from '@/api/network/axios';
import { Material, UserInfo } from '@/store/interfaces/material.interface';
import { Status } from '@/store/interfaces/axios.interface';

export const getMaterials = async () => {
	return http.get<{ materials: Material[] }>('/materials');
};

export const createMaterial = async (material: Material) => {
	return http.post<Material>('/materials/create', material);
};

export const updateMaterial = async (material: Material, id: string) => {
	return http.put<Material>(`materials/update/${id}`, material);
};

export const deleteMaterial = async (id: string) => {
	return http.delete<Material>(`materials/delete/${id}`);
};

export const getUserInfo = async (userId: string) => {
	return http.get<UserInfo>(`materials/user/${userId}`);
};
