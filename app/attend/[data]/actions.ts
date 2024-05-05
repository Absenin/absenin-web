"use server"

import { cookies } from "next/headers"
import { headers } from 'next/headers'

export async function getSession(dateId: string, fingerPrint: string) {
    const cookieStore = cookies()
    const header = headers()
    const ip = (header.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]

    const res = await fetch(`${process.env.BASE_API_URL}/attendance`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ip: ip,
            fingerprint: fingerPrint,
            date_id: dateId
        }),
    });

    if (!res.ok) return false;

    const json = await res.json();

    cookieStore.set("user_attendance", json.user_attendance)
    cookieStore.set("hash_attendance", json.hash_attendance)

    return res.ok;
}

export async function urlSafeBase64Decode(str: string) {
    let paddedStr = str + '='.repeat((4 - str.length % 4) % 4);
    return atob(paddedStr
        .replace(/\-/g, '+')
        .replace(/_/g, '/'));
}

export async function putAttendance(nim: string): Promise<string | true> {
    const cookieStore = cookies()

    const res = await fetch(`${process.env.BASE_API_URL}/attendance`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `hash_attendance=${cookieStore.get("hash_attendance")?.value};user_attendance=${cookieStore.get("user_attendance")?.value}`
        },
        body: JSON.stringify({
            nim
        }),
    });

    const json = await res.json();

    if (!res.ok) {
        return json.error
    }

    return true
}