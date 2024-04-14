import { config } from '@/config';
import { getClient } from '@/lib';

export async function GET() {
    const client = await getClient();
    const url = client.authorizationUrl({
        scope: config.scope,
        redirect_uri: config.redirect_uri,
    });
    return Response.redirect(url);
}