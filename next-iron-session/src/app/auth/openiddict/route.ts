import { config } from '@/config';
import { getClient, getSession } from '@/lib';
import { IncomingMessage } from 'http';

export async function GET(request: IncomingMessage) { 
    const session = await getSession();
    const client = await getClient();
    const params = client.callbackParams(request);
    const tokenSet = await client.callback(config.redirect_uri, params, { code_verifier: session.code_verifier });
    const { access_token } = tokenSet;
    session.isLoggedIn = true;
    session.access_token = access_token;
    // session.refresh_token = refresh_token;
    // call userinfo endpoint to get user info
    const userinfo = await client.userinfo(tokenSet);
    // console.log(userinfo);
    // store userinfo in session
    session.userInfo = {
        sub: userinfo.sub,
        name: userinfo.given_name!,
        email: userinfo.email!,
        email_verified: userinfo.email_verified!,
    };

    await session.save();
    return Response.redirect(config.post_login_route);
}