import { Cookies } from 'react-cookie';

const cookies = new Cookies(null, { path: '/' });

class TokenService {
    private static ACCESS_TOKEN_KEY = 'access_token';
    private static REFRESH_TOKEN_KEY = 'refresh_token';

    static getAccessToken(): string | null {
        try {
            return cookies.get(this.ACCESS_TOKEN_KEY) || null;
        } catch (error) {
            return null;
        }
    }

    static getRefreshToken(): string | null {
        try {
            return cookies.get(this.REFRESH_TOKEN_KEY) || null;
        } catch (error) {
            return null;
        }
    }
}

export default TokenService;
