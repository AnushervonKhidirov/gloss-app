import type { Token } from '@type/auth.type';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';

class TokenService {
  static async getToken(): Promise<Token | null> {
    const accessToken = await getItemAsync('access_token');
    const refreshToken = await getItemAsync('refresh_token');

    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken };
  }

  static async setToken({ accessToken, refreshToken }: Token) {
    await setItemAsync('access_token', accessToken);
    await setItemAsync('refresh_token', refreshToken);
  }

  static async removeToken() {
    await deleteItemAsync('access_token');
    await deleteItemAsync('refresh_token');
  }
}

export default TokenService;
