"use server"

import { cookies } from "next/headers"

export interface IData {
    data: {
        id: string
        email: string
        createdAt: string
    }[]
}

export async function getAccounts(): Promise<IData | false> {
    const cookieStore = cookies()

    const res = await fetch(`${process.env.BASE_API_URL}/account`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${cookieStore.get("session")?.value}`
        },
    });

    if (!res.ok) return false;

    const json = await res.json();

    return json;
}

export async function postAccount(email: string, password: string) {
    const cookieStore = cookies()

    const res = await fetch(`${process.env.BASE_API_URL}/account`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${cookieStore.get("session")?.value}`
        },
        body: JSON.stringify({
            email,
            password
        }),
    });

    return res.ok;
}

export async function deleteAccount(id: string) {
    const cookieStore = cookies()

    const res = await fetch(`${process.env.BASE_API_URL}/account/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${cookieStore.get("session")?.value}`
        },
    });

    return res.ok;
}

export async function patchAccount(id: string, email: string, password: string | null) {
    const cookieStore = cookies()

    const body = {} as { email?: string, password?: string }

    if (email) {
        body.email = email
    }

    if (password) {
        body.password = password
    }

    const res = await fetch(`${process.env.BASE_API_URL}/account/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${cookieStore.get("session")?.value}`
        },
        body: JSON.stringify(body),
    });

    return res.ok;
}