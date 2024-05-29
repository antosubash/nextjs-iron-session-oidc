import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { Issuer } from "openid-client";
import { clientConfig } from "./config";
import { sessionOptions } from "./sessionOptions";

export interface SessionData {
    isLoggedIn: boolean;
    access_token?: string;
    code_verifier?: string;
    userInfo?: {
        sub: string,
        name: string,
        email: string,
        email_verified: boolean,
        tenantId?: string
    };
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
    access_token: undefined,
    code_verifier: undefined,
    userInfo: undefined
};

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSession() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (!session.isLoggedIn) {
        session.isLoggedIn = defaultSession.isLoggedIn;
        session.access_token = defaultSession.access_token;
    }
    return session;
}



export async function getClient() {
    const abpIssuer = await Issuer.discover(clientConfig.url!);
    const client = new abpIssuer.Client({
        client_id: clientConfig.client_id!,
        response_types: ['code'],
        redirect_uris: [clientConfig.redirect_uri],
        token_endpoint_auth_method: "none"
    });
    return client;
}