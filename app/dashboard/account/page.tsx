"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IUser, deleteUser, getUsers } from "./actions";
import Loading from "@/components/loading";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Trash2, Pencil, LoaderCircle } from 'lucide-react';
import AddUserDialog from "@/components/addUserDialog";
import PatchUserDialog from "@/components/patchUserDialog";

export default function Page() {
    const [userData, setUserData] = useState<IUser>();
    const [fetched, setFetched] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const [nimToPatch, setNimToPatch] = useState("");
    const [nameToPatch, setNameToPatch] = useState("");
    const [idToPatch, setIdToPatch] = useState("");
    const [patchDialogOpen, setPatchDialogOpen] = useState(false);

    useEffect(() => {
        if (!fetched) {
            getUsers().then((data) => {
                if (!data) {
                    return router.push("/login/account");
                }

                if (data) {
                    setUserData(data);
                    setFetched(true);
                }
            });
        }
    }, [])

    function addUser() {
        setAddDialogOpen(true);
    }

    async function deleteCurrentUser(id: string) {
        setLoading(true);

        const valid = await deleteUser(id);

        setLoading(false);

        if (!valid) return

        setUserData({
            data: userData?.data.filter((user) => user.id !== id)!
        });
    }

    function editUser(id: string) {
        setIdToPatch(id);
        setNimToPatch(userData?.data.find((user) => user.id === id)!.nim!);
        setNameToPatch(userData?.data.find((user) => user.id === id)!.name!);

        setPatchDialogOpen(true);
    }

    if (!userData) {
        return (
            <Loading />
        )
    }

    return (
        <main className="min-h-screen bg-background text-text">
            <AddUserDialog open={addDialogOpen} setDialogOpen={setAddDialogOpen} />
            <PatchUserDialog open={patchDialogOpen} setDialogOpen={setPatchDialogOpen} id={idToPatch} nimDefault={nimToPatch} nameDefault={nameToPatch} />

            <div className='container pt-10 md:pt-20 flex flex-col gap-y-6 md:gap-y-10'>
                <h1 className='text-primary font-semibold text-5xl'>Panel Akun</h1>

                <button onClick={() => addUser()} className='bg-primary px-4 py-2 rounded-xl text-background w-fit font-semibold'>
                    Tambah Pengguna
                </button>

                <Table className='border-2'>
                    <TableHeader>
                        <TableRow className='*:font-semibold *:text-xl'>
                            <TableHead>NIM</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Foto</TableHead>
                            <TableHead className='text-right'>Dibuat Pada</TableHead>
                            <TableHead className='text-right'>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userData?.data.map((user) => (
                            <TableRow>
                                <TableCell className="font-medium">{user.nim}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell className=''>{user.photo ? user.photo : "None"}</TableCell>
                                <TableCell className='text-right'>{new Date(user.created_at).toLocaleString()}</TableCell>
                                <TableCell className='text-right flex items-center gap-x-3 justify-end'>
                                    <button onClick={() => editUser(user.id)}>
                                        <Pencil className='stroke-blue-500' />
                                    </button>
                                    <button onClick={() => deleteCurrentUser(user.id)}>
                                        {loading ?
                                            <LoaderCircle className='animate-spin stroke-red-500' /> :
                                            <Trash2 className='stroke-red-500' />
                                        }
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </main>
    )
}