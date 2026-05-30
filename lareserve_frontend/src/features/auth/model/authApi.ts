import { apiClient } from '@/shared/lib/apiClient';

export async function signInWithGoogle(accessToken: string): Promise<string> {
  const response = await apiClient.post<{ key: string }>('/auth/google/', {
    access_token: accessToken,
  });
  return response.data.key;
}
