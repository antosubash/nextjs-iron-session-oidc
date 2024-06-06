import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { Issuer } from "openid-client";
import { clientConfig } from "./config";
import { sessionOptions } from "./sessionOptions";
import { isTokenExpired, refreshToken } from "./utils/auth";
import { createRedisInstance } from "./utils/redis";
import { tenantGetTenantGuid, tenantGetTenantHost } from "./client";

export interface SessionData {
    isLoggedIn: boolean;
    access_token?: string;
    code_verifier?: string;
    userInfo?: {
        sub: string,
        name: string,
        email: string,
        email_verified: boolean,
    };
    tenantId?: string;
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
    access_token: undefined,
    code_verifier: undefined,
    userInfo: undefined,
    tenantId: undefined
};

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSession() {
    let session = await getIronSession<SessionData>(cookies(), sessionOptions);
    console.log("session", session);
    if (session.access_token && isTokenExpired(session.access_token!)) {
        const redis = await createRedisInstance();
        const client = await getClient();
        await refreshToken(session, client, redis);
        session = await getSession();
    } 
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

export async function setTenantWithHost(host: string) {
    const session = await getSession();
    if (session.tenantId) {
        return;
    }
    var tenantGuid = await tenantGetTenantGuid({ host: host });
    session.tenantId = tenantGuid;
    await session.save();
}