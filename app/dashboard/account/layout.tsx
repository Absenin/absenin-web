"use client"

import { useEffect, useState } from "react";
import { IUser, getUsers } from "./actions";
import { UserContext } from "@/stores/UserContext";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { FullUserContext } from "@/stores/UserFullContext";

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const [userData, setUserData] = useState<IUser | null>(null);
    const [fullUserData, setFullUserData] = useState<IUser | null>(null);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (!fetched) {
            getUsers().then((data) => {
                if (!data) {
                    return router.push("/login/account");
                }

                if (data) {
                    setUserData(data);
                    setFullUserData(data);
                    setFetched(true);
                }
            });
        }
    }, [fetched, router])

    if (!userData) {
        return (
            <Loading />
        )
    }

    return (
        <FullUserContext.Provider value={[fullUserData, setFullUserData]}>
            <UserContext.Provider value={[userData, setUserData]}>
                {children}
            </UserContext.Provider>
        </FullUserContext.Provider>
    )
}