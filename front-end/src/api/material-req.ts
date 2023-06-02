import { http } from '@/api/network/axios';
import { User } from '@/store/interfaces/auth.interfaces';
import { Material, BorrowingMaterial } from '@/store/interfaces/material.interface';

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

export const borrowMaterial = async (id: string, payload: any) => {
	return http.put<BorrowingMaterial>(`materials/reservation/${id}`, payload);
};

export const getPendingMaterials = async () => {
	return http.get<Array<Material>>('materials/pendingReservation');
}

export const acceptBorrowing = async (id: string, payload: any) => {
	return http.put<BorrowingMaterial>(`materials/reservation/accept/${id}`, payload);
}

export const getUserById = async (id: string) => {
	return http.get<User>(`materials/users/${id}`);
}
