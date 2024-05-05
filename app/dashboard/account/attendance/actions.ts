"use server"

import { cookies } from "next/headers";

export interface IAttendance {
    data: {
        created_at: string,
        user: {
            name: string,
            nim: string,
            photo: string | null,
        }
        id: string
    }[],
    id: string
}

export async function getAttendance(timestamp: number): Promise<IAttendance | false> {
    const cookieStore = cookies()

    const res = await fetch(`${process.env.BASE_API_URL}/date/${Math.round(timestamp / 1000)}`, {
        method: "GET",
        headers: {
            "Cookie": `session=${cookieStore.get("session")?.value}`
        },
    });

    if (!res.ok) return false;

    const json = await res.json();

    return json;
}

export async function postDate(date: number) {
    const cookieStore = cookies()

    const res = await fetch(`${process.env.BASE_API_URL}/date`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${cookieStore.get("session")?.value}`
        },
        body: JSON.stringify({
            date: Math.round(date / 1000)
        }),
    });

    return res.ok;
}

export async function urlSafeBase64Encode(str: string) {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}