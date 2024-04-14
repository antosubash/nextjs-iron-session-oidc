export const config = {
    url: 'https://abp.antosubash.com',
    client_id: 'AbpReact_Next_App',
    scope: 'openid profile email AbpTemplate',
    redirect_uri: 'http://localhost:3000/api/auth/callback/openiddict',
    post_logout_redirect_uri: 'http://localhost:3000/',
    silent_redirect_uri: 'http://localhost:3000/api/auth/callback/silent',
    automaticSilentRenew: true,
    loadUserInfo: true,
    response_type: 'code',
    grant_type: 'authorization_code',
    post_login_route: 'http://localhost:3000',
};