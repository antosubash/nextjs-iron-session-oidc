import { SessionOptions } from "iron-session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { Issuer } from "openid-client";
import { config } from "./config";
export interface SessionData {
    isLoggedIn: boolean;
    access_token?: string;
    id_token?: string;
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
    access_token: undefined,
    id_token: undefined,
};

export const sessionOptions: SessionOptions = {
    password: "complex_password_at_least_32_characters_long",
    cookieName: "geo_wiki_session",
    cookieOptions: {
        // secure only works in `https` environments
        // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
        secure: true,
    },
};

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSession() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (session.isLoggedIn) {
        session.isLoggedIn = defaultSession.isLoggedIn;
        session.access_token = defaultSession.access_token;
        session.id_token = defaultSession.id_token;
    }

    return session;
}

export async function getClient() {
    const abpIssuer = await Issuer.discover(config.url);
    const client = new abpIssuer.Client({
        client_id: config.client_id,
        response_types: ['code'],
        redirect_uris: [config.redirect_uri],
        token_endpoint_auth_method: "none"
    });
    return client;
}