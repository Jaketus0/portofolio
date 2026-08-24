// We use localStorage for tokens on the client-side for ease of use in React,
// but our backend also sets an HttpOnly cookie as a fallback/more secure method.

export const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
};

export const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('refreshToken');
    }
    return null;
};

export const setTokens = (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }
};

export const removeTokens = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};
