import { getAccessToken } from './tokenStorage';

const RAW_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').trim();

if (!RAW_BASE_URL || RAW_BASE_URL.includes('localhost') || RAW_BASE_URL.includes('127.0.0.1')) {
  console.warn(
    '⚠️ CẢNH BÁO: EXPO_PUBLIC_API_URL chưa được cấu hình Tunnel (ngrok / devtunnels). Vui lòng cấu hình URL Tunnel trong file .env!'
  );
}

export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

export interface ApiResponse<T = any> {
  success: boolean;
  code?: string;
  message?: string;
  data: T;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  fieldErrors?: Record<string, string>;

  constructor({ status, code, message, fieldErrors }: { status: number; code?: string; message: string; fieldErrors?: Record<string, string> }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export async function apiRequest<T = any>(
  path: string,
  {
    method = 'GET',
    body,
    auth = true,
  }: { method?: string; body?: any; auth?: boolean } = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };

  if (auth) {
    const token = await getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (netErr: any) {
    throw new ApiError({
      status: 0,
      code: 'NETWORK_ERROR',
      message: `Không thể kết nối đến máy chủ (${url}). Vui lòng kiểm tra Dev Tunnel hoặc mạng của bạn.`,
    });
  }

  let payload: any = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message = payload?.message || `Yêu cầu thất bại (HTTP ${response.status})`;
    throw new ApiError({
      status: response.status,
      code: payload?.code,
      message,
      fieldErrors: payload?.data?.fieldErrors,
    });
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
}
