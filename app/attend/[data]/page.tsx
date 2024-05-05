"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession, putAttendance, urlSafeBase64Decode } from "./actions";
import Loading from "@/components/loading";
import FingerPrint from "@fingerprintjs/fingerprintjs"
import RequestIp from "request-ip";
import { LoaderCircle } from "lucide-react";

export default function Page() {
    const router = useRouter();
    const params = useParams() as { data: string };
    const [nim, setNim] = useState("");
    const [error, setError] = useState("");
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [attended, setAttended] = useState(false);

    useEffect(() => {
        validate(params.data);
    }, [])

    async function validate(data: string) {
        const decodedData = await urlSafeBase64Decode(data).catch(() => null);

        if (!decodedData) {
            return router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        }

        const dataJson = JSON.parse(decodedData) as { dateId: string, expiredAt: number };

        if (dataJson.expiredAt < Date.now()) {
            return router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        }

        const fp = await FingerPrint.load()

        const ready = await getSession(dataJson.dateId, (await fp.get()).visitorId)

        if (!ready) {
            return router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        }

        setValid(true)
    }

    async function handleSubmit() {
        setError("")
        setLoading(true)
        putAttendance(nim).then((res) => {
            console.log(res)
            if (res === true) {
                router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            } else {
                setError(res)
            }

            setLoading(false)
        })
    }

    if (!valid) return <Loading />

    if (attended) return (
        <main className="bg-background flex justify-center items-center min-h-screen">
            <h1 className="text-center text-5xl text-primary font-semibold">Anda sudah hadir</h1>
        </main>
    )

    return (
        <main className="flex md:items-center md:justify-center min-h-screen text-text bg-background pt-10 lg:pt-0">
            <div className="flex flex-col items-center w-full gap-y-10 container max-w-96">
                <h1 className="text-5xl font-semibold w-full">Absensi</h1>
                <div className="grid gap-y-6 w-full">
                    <input
                        type="number"
                        placeholder="Masukkan NIM"
                        value={nim}
                        onChange={(e) => setNim(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {
                        error && <p className="text-red-500">{error}</p>
                    }
                </div>
                <div className="grid gap-y-6 w-full">
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        disabled={loading}
                        className="bg-primary flex items-center justify-center w-full text-center text-sm md:text-base lg:text-xl text-background rounded-2xl font-semibold hover:opacity-80 px-6 py-2"
                    >
                        {
                            loading ? <LoaderCircle className="animate-spin stroke-background" /> : "Masuk"
                        }
                    </button>
                </div>
            </div>
        </main>
    )
}