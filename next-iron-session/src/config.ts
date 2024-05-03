export const config = {
    url: process.env.NEXT_PUBLIC_API_URL,
    audience: process.env.NEXT_PUBLIC_API_URL,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    scope: 'openid profile email AbpTemplate',
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/openiddict`,
    post_logout_redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}`,
    silent_redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/silent`,
    automaticSilentRenew: true,
    loadUserInfo: true,
    response_type: 'code',
    grant_type: 'authorization_code',
    post_login_route: `${process.env.NEXT_PUBLIC_APP_URL}`,
};