import axiosClient from '../../api/axiosClient';

// Định nghĩa kiểu dữ liệu (Nên tách ra file types riêng nếu dự án lớn)
export interface User {
  id: number;
  name: string;
  email: string;
}

const userApi = {
  getAll: () => {
    return axiosClient.get<User[]>('/users');
  },
  
  getById: (id: number) => {
    return axiosClient.get<User>(`/users/${id}`);
  },

  create: (data: Omit<User, 'id'>) => {
    return axiosClient.post<User>('/users', data);
  },

  update: (id: number, data: Partial<User>) => {
    return axiosClient.put<User>(`/users/${id}`, data);
  },
  
  delete: (id: number) => {
    return axiosClient.delete(`/users/${id}`);
  }
};

export default userApi;