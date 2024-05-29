import { NextRequest } from "next/server";
import { SessionData } from "./lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "./sessionOptions";
import { jwtDecode } from 'jwt-decode';

export async function middleware(request: NextRequest) {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    var token = session.access_token;
    if (token) {
        var decoded = jwtDecode(token!);
        var expirationTime = decoded?.exp! * 1000;
        var currentTime = new Date().getTime();
        var expired = false;
        console.log('Token expiration time: ' + expirationTime);
        if (expirationTime < currentTime) {
            expired = true;
            console.log('Token expired');
        }
        if (expired) {
            const redirect_uri = request.url;
            return Response.redirect(`/auth/token-refresh?returnURL=${redirect_uri}`);
        }
    }
}

export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - favicon.ico (favicon file)
        */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};