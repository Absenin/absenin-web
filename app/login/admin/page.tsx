"use client"

import Link from "next/link";
import { FormEvent, useState } from "react";
import { loginAdmin } from "./actions";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function Page() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter()
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!password) {
            return setError("Password tidak boleh kosong");
        }

        setError("");

        setLoading(true);
        const response = await loginAdmin(password)
        setLoading(false);

        if (!response.valid) {
            return setError("Password salah");
        }

        router.push("/dashboard/admin")
    }

    if (loading) return <Loading />

    return (
        <main className="flex md:items-center md:justify-center min-h-screen text-text bg-background pt-10 lg:pt-0">
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col items-center w-full gap-y-10 container max-w-96">
                <h1 className="text-5xl font-semibold w-full">Login Admin</h1>
                <div className="grid gap-y-6 w-full">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {
                        error && <p className="text-red-500">{error}</p>
                    }
                </div>
                <div className="grid gap-y-6 w-full">
                    <button
                        type="submit"
                        className="bg-primary w-full text-center text-sm md:text-base lg:text-xl text-background rounded-2xl font-semibold hover:opacity-80 px-6 py-2"
                    >
                        Login
                    </button>
                    <Link href={"/login/account"} className="w-full text-center text-sm md:text-base lg:text-xl text-text rounded-2xl font-semibold hover:opacity-80 px-6 py-2">
                        Login Akun
                    </Link>
                </div>
            </form>
        </main>
    )
}