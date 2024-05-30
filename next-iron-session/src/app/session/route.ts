import { getSession } from "@/lib";

export async function GET() {
    try {
        const session = await getSession();
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