"use server"

export interface IAttendance {
    data: {
        created_at: string,
        user: {
            name: string,
            nim: string,
            photo: string | null,
        }
        id: string
    }[]
}

import { cookies } from "next/headers";

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