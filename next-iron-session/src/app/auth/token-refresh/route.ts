import { getClient, getSession } from '@/lib';
import { RedisSession, createRedisInstance } from '@/utils/redis';
import { jwtDecode } from 'jwt-decode';
import { NextApiRequest } from 'next';

export async function GET(request: NextApiRequest) {
    const session = await getSession();
    let { returnURL } = request.query as { returnURL: string };
    if (!session.isLoggedIn) {
        return Response.redirect('/login');
    }
    if (!returnURL) {
        returnURL = '/';
    }
    var token = session.access_token;
    if (token) {
        var decoded = jwtDecode(token!);
        var expirationTime = decoded?.exp! * 1000;
        var currentTime = new Date().getTime();
        var expired = false;
        if (expirationTime < currentTime) {
            expired = true;
        }
        if (expired) {
            try {
                var client = await getClient();
                const redis = createRedisInstance();
                var redisSessionData = await redis.get(session?.userInfo?.sub!);
                var parsedSessionData = JSON.parse(redisSessionData!) as RedisSession;
                var tokenSet = await client.refresh(parsedSessionData.refresh_token!);
                session.access_token = tokenSet.access_token;
                await session.save();
                var newRedisSessionData = {
                    access_token: tokenSet.access_token,
                    refresh_token: tokenSet.refresh_token,
                } as RedisSession;
                await redis.set(session?.userInfo?.sub!, JSON.stringify(newRedisSessionData));
                await redis.quit();
            }
            catch (e) {
                session.isLoggedIn = false;
                session.userInfo = undefined;
                await session.save();
            }
        }
    }
    
    return Response.redirect(returnURL);
}