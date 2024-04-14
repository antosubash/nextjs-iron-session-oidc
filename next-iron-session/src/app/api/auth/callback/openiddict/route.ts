import { config } from '@/config';
import { IncomingMessage } from 'http';
import { Issuer } from 'openid-client';
export async function GET(request: IncomingMessage) { 
    const abpIssuer = await Issuer.discover(config.url);
    const client = new abpIssuer.Client({
        client_id: config.client_id,
        response_types: ['code'],
        redirect_uris: [config.redirect_uri],
        token_endpoint_auth_method: "none"
    });
    const params = client.callbackParams(request);
    const tokenSet = await client.callback(config.redirect_uri, params, { response_type: 'code' });
    return Response.json({ tokenSet })
}