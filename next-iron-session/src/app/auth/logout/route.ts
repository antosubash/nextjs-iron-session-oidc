import { config  } from '@/config';
import { defaultSession, getClient, getSession } from '@/lib';
import { generators } from 'openid-client';

export async function GET() {
    const session = await getSession();
    const client = await getClient();
    var endSession = client.endSessionUrl({
        post_logout_redirect_uri: config.post_logout_redirect_uri,
        id_token_hint: session.refresh_token,
        state: generators.state()
    });
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.access_token = defaultSession.access_token;
    session.refresh_token = defaultSession.refresh_token;
    session.userInfo = defaultSession.userInfo;
    await session.save();
    return Response.redirect(endSession);
}