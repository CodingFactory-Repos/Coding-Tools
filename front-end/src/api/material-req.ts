import { http } from '@/api/network/axios';
import { Material } from '@/store/interfaces/material.interface';

export const getMaterials = async () => {
	return http.get<Array<Material>>('/materials');
};

export const createMaterial = async (material: Partial<Material>) => {
	return http.post<Material>('/materials/create', material);
};

export const updateMaterial = async (material: Material, id: string) => {
	return http.put<Material>(`materials/update/${id}`, material);
};

export const deleteMaterial = async (id: string) => {
	return http.delete<Material>(`materials/delete/${id}`);
};
