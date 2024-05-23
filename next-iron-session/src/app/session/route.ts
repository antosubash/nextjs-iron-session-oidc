import { getSession } from "@/lib";

export async function GET() {
    const session = await getSession();
    return Response.json(
        {
            isLoggedIn: session.isLoggedIn,
            userInfo: session.userInfo,
        }
    );
}