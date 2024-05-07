import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib";

export async function middleware(request: NextRequest) {

    try {
        const session = await getSession();
        console.log("middleware_session", session);
        console.log("middleware_session", session);
        if (!session.isLoggedIn) {
            return NextResponse.redirect("/login");
        }
    } catch (error) {
        console.log("middleware_error", error);
    }
    
}

export const config = {
    matcher: [
        "/admin"
    ],
};