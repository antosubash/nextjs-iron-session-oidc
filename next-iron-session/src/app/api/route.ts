import { SessionData, sessionOptions } from "@/lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function GET() { 
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    return Response.json({ access_token: session.access_token})
}