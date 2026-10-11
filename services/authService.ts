import { apiRequest } from './apiClient';
import { setAccessToken, removeAccessToken } from './tokenStorage';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'STUDENT' | 'LECTURER' | 'ADMIN';
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export async function login({ email, password }: { email: string; password: string }): Promise<LoginResponse> {
  const result = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  if (result?.accessToken) {
    await setAccessToken(result.accessToken);
  }
  return result;
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/auth/me');
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch {
    // Bỏ qua lỗi server khi logout
  } finally {
    await removeAccessToken();
  }
}
