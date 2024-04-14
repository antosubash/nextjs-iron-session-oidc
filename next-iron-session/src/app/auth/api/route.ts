import { config } from '@/config';
import { redirect } from 'next/navigation';
import { Issuer } from 'openid-client';

export async function GET(request: Request) {
    const abpIssuer = await Issuer.discover(config.url);
    const client = new abpIssuer.Client({
        client_id: config.client_id,
        response_types: ['code'],
    });
    const url = client.authorizationUrl({
        scope: config.scope,
        redirect_uri: 'http://localhost:3000/api/auth/callback/openiddict',
    });
    redirect(url);
    return Response.json({ message: 'Hello, world!'})
}