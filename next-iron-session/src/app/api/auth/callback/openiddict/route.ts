import { config } from '@/config';
import { SessionData, getClient, sessionOptions } from '@/lib';
import { IncomingMessage } from 'http';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
export async function GET(request: IncomingMessage) { 
    const client = await getClient();
    const params = client.callbackParams(request);
    const tokenSet = await client.callback(config.redirect_uri, params, { response_type: 'code' });
    const { access_token, id_token } = tokenSet;
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.isLoggedIn = true;
    session.access_token = access_token;
    session.id_token = id_token;
    await session.save();
    return Response.redirect(config.post_login_route);
}