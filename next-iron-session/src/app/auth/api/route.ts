import { config  } from '@/config';
import { getClient, getSession } from '@/lib';
import { generators } from 'openid-client';

export async function GET() {
    const session = await getSession();
    session.code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(session.code_verifier);
    const client = await getClient();
    const url = client.authorizationUrl({
        scope: config.scope,
        audience: config.audience,
        redirect_uri: config.redirect_uri,
        code_challenge,
        code_challenge_method: 'S256',
    });
    await session.save();
    return Response.redirect(url);
}