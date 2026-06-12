import { apiClient } from '@/shared/lib/apiClient';

type LoginResponse = {
  key?: string;
  token?: string;
  access?: string;
  access_token?: string;
};

function normalizeToken(data: LoginResponse): string {
  const token = data.key ?? data.token ?? data.access ?? data.access_token;
  if (!token) {
    throw new Error('Auth token missing in login response');
  }
  return token;
}

export async function signInWithCredentials(identifier: string, password: string): Promise<string> {
  const isEmail = identifier.includes('@');
  const payload = isEmail ? { email: identifier, password } : { username: identifier, password };

  const response = await apiClient.post<LoginResponse>('/auth/login/', payload);

  return normalizeToken(response.data);
}

export async function signOut(): Promise<void> {
  await apiClient.post('/auth/logout/');
}
