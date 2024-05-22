import { SessionData, getClient, sessionOptions } from "@/lib";
import { jwtDecode } from "jwt-decode";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function GET() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    var token = session.access_token;
    var expired = false;
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
                var tokenSet = await client.refresh(session.refresh_token!);
                session.access_token = tokenSet.access_token;
                session.refresh_token = tokenSet.refresh_token;
                await session.save();
            }
            catch (e) {
                session.isLoggedIn = false;
                session.userInfo = undefined;
                await session.save();
            }
        }
        return Response.json(
            {
                isLoggedIn: session.isLoggedIn,
                userInfo: session.userInfo,
            }
        );
    }
    else {
        return Response.json(
            {
                isLoggedIn: false,
                userInfo: undefined,
            }
        );
    }   
}