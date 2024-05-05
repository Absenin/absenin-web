"use server"

export interface IUser {
    data: {
        created_at: string,
        name: string,
        nim: string,
        id: string
    }[]
}

import { cookies } from "next/headers";

export async function getUsers(): Promise<IUser | false> {
    const cookieStore = cookies()

    const res = await fetch(`${process.env.BASE_API_URL}/user`, {
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

export async function postUser(nim: string, name: string) {
    const cookieStore = cookies()

    const res = await fetch(`${process.env.BASE_API_URL}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${cookieStore.get("session")?.value}`
        },
        body: JSON.stringify({
            nim,
            name
        }),
    });

    if (!res.ok) return false;

    const json = await res.json();

    return json;
}

export async function deleteUser(id: string) {
    const cookieStore = cookies()

    const res = await fetch(`${process.env.BASE_API_URL}/user/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${cookieStore.get("session")?.value}`
        },
    });

    return res.ok;
}

export async function patchUser(id: string, nim: string, name: string) {
    const cookieStore = cookies()

    const res = await fetch(`${process.env.BASE_API_URL}/user/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${cookieStore.get("session")?.value}`
        },
        body: JSON.stringify({
            nim,
            name
        }),
    });

    return res.ok;
}