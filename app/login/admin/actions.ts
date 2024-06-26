"use server"

import { cookies } from "next/headers"

export async function loginAdmin(password: string): Promise<{ valid: boolean, session: string }> {
    const cookieStore = cookies()

    const res = await fetch(`${process.env.BASE_API_URL}/login/admin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            password: password
        }),
    });

    if (!res.ok) {
        return {
            valid: false,
            session: ""
        }
    }

    const json = await res.json();

    cookieStore.set("session", json.session)

    return {
        valid: res.ok,
        session: json.session
    }
}