import { SessionOptions } from "iron-session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { Issuer } from "openid-client";
import { config } from "./config";

export interface SessionData {
    isLoggedIn: boolean;
    access_token?: string;
    refresh_token?: string;
    code_verifier?: string;
    userInfo?: {
        sub: string,
        name: string,
        email: string,
        email_verified: boolean,
        tenantid?: string
    };
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
    access_token: undefined,
    refresh_token: undefined,
    code_verifier: undefined,
    userInfo: undefined
};

export const sessionOptions: SessionOptions = {
    password: "complex_password_at_least_32_characters_long",
    cookieName: "next_js_session",
    cookieOptions: {
        // secure only works in `https` environments
        // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
        secure: process.env.NODE_ENV === "production",
    },
};

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSession() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (!session.isLoggedIn) {
        session.isLoggedIn = defaultSession.isLoggedIn;
        session.access_token = defaultSession.access_token;
        session.refresh_token = defaultSession.refresh_token;
    }
    return session;
}



export async function getClient() {
    const abpIssuer = await Issuer.discover(config.url!);
    const client = new abpIssuer.Client({
        client_id: config.client_id!,
        response_types: ['code'],
        redirect_uris: [config.redirect_uri],
        token_endpoint_auth_method: "none"
    });
    return client;
}