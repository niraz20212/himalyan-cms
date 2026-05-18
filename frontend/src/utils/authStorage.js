const ACCESS_TOKEN_KEY = 'hc_access_token';
const REFRESH_TOKEN_KEY = 'hc_refresh_token';
const USER_KEY = 'hc_user';

const storage = {
  getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken() {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },
  getUser() {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setSession({ accessToken, refreshToken, user }) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setUser(user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
};

export default storage;
