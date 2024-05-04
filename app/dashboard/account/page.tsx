"use client"

import { useContext, useEffect, useState } from "react";
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
import Exceljs from "exceljs";
import Link from "next/link";
import { FullUserContext } from "@/stores/UserFullContext";
import { UserContext } from "@/stores/UserContext";

export default function Page() {
    const [userData, setUserData] = useContext(UserContext)
    const [fullUserData, setFullUserData] = useContext(FullUserContext)
    const [loading, setLoading] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const [nimToPatch, setNimToPatch] = useState("");
    const [nameToPatch, setNameToPatch] = useState("");
    const [idToPatch, setIdToPatch] = useState("");
    const [patchDialogOpen, setPatchDialogOpen] = useState(false);

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
        setFullUserData({
            data: fullUserData?.data.filter((user) => user.id !== id)!
        });
    }

    function editUser(id: string) {
        setIdToPatch(id);
        setNimToPatch(userData?.data.find((user) => user.id === id)!.nim!);
        setNameToPatch(userData?.data.find((user) => user.id === id)!.name!);

        setPatchDialogOpen(true);
    }

    function convertToExcel() {
        const workbook = new Exceljs.Workbook();

        const worksheet = workbook.addWorksheet("Users");

        worksheet.columns = [
            { header: "NIM", key: "nim" },
            { header: "Nama", key: "name" },
            { header: "Dibuat Pada", key: "created_at" },
        ];

        const users = userData;

        if (!users) return;

        users.data.forEach((user) => {
            worksheet.addRow({
                nim: user.nim,
                name: user.name,
                created_at: new Date(user.created_at).toLocaleString(),
            });
        });

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "users.xlsx";
            a.click();
        });
    }

    function search(value: string) {
        if (!fullUserData) return;

        if (!value || value === "") return setUserData(fullUserData);

        if (parseInt(value)) {
            setUserData({
                data: fullUserData?.data.filter((user) => user.nim.includes(value))!
            });
            return;
        }

        setUserData({
            data: fullUserData?.data.filter((user) => user.name.toLowerCase().includes(value.toLowerCase()))!
        });
    }

    return (
        <main className="min-h-screen bg-background text-text">
            <AddUserDialog open={addDialogOpen} setDialogOpen={setAddDialogOpen} />
            <PatchUserDialog open={patchDialogOpen} setDialogOpen={setPatchDialogOpen} id={idToPatch} nimDefault={nimToPatch} nameDefault={nameToPatch} />

            <div className='container pt-10 md:pt-20 flex flex-col gap-y-6 md:gap-y-10'>
                <h1 className='text-primary font-semibold text-5xl'>Panel Akun</h1>

                <div className="flex gap-5 flex-wrap">
                    <button onClick={() => addUser()} className='hover:opacity-80 transition-opacity bg-primary px-4 py-2 rounded-xl text-background w-fit font-semibold'>
                        Tambah Pengguna
                    </button>
                    <Link href={"/dashboard/account/attendance"} className="hover:opacity-80 transition-opacity bg-secondary px-4 py-2 rounded-xl text-text w-fit font-semibold">
                        Absensi
                    </Link>
                    <button onClick={convertToExcel} className="hover:opacity-80 transition-opacity bg-[#1D6F42] px-4 py-2 rounded-xl text-background w-fit font-semibold">
                        Ubah ke Excel
                    </button>
                </div>

                <input onChange={(e) => search(e.target.value)} className="bg-background px-4 py-2 rounded-lg border-2 border-primary focus:outline-none" placeholder="Cari"></input>

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
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.nim}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell className=''>{user.photo ? user.photo : "-"}</TableCell>
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