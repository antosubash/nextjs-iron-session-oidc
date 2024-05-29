import { getClient, getSession } from "@/lib";
import { isTokenExpired, refreshToken } from "@/utils/auth";
import { createRedisInstance } from "@/utils/redis";

export async function GET() {
    try {
        let session = await getSession();
        if (isTokenExpired(session.access_token!)) {
            const redis = await createRedisInstance();
            const client = await getClient();
            await refreshToken(session, client, redis);
        }
        session = await getSession();
        return Response.json(
            {
                isLoggedIn: session.isLoggedIn,
                userInfo: session.userInfo,
            }
        );
    } catch (e) {
        return Response.json({ error: e }, { status: 500 });
    }
    
}