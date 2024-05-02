"use client"

import Link from "next/link";
import { useState } from "react";

export default function Page() {
    const [password, setPassword] = useState("");

    return (
        <main className="flex md:items-center md:justify-center min-h-screen text-text bg-background pt-10 lg:pt-0">
            <div className="flex flex-col items-center w-full gap-y-10 container max-w-96">
                <h1 className="text-5xl font-semibold w-full">Login Account</h1>
                <div className="grid gap-y-6 w-full">
                    <input
                        type="email"
                        placeholder="Email"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
                <div className="grid gap-y-6 w-full">
                    <button
                        type="submit"
                        className="bg-primary w-full text-center text-sm md:text-base lg:text-xl text-background rounded-2xl font-semibold hover:opacity-80 px-6 py-2"
                    >
                        Login
                    </button>
                    <Link href={"/login/admin"} className="w-full text-center text-sm md:text-base lg:text-xl text-text rounded-2xl font-semibold hover:opacity-80 px-6 py-2">
                        Login Admin
                    </Link>
                </div>
            </div>
        </main>
    )
}