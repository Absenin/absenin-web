"use client"

import { useEffect, useState } from 'react';
import { IData, deleteAccount, getAccounts } from './actions';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Trash2, Pencil } from 'lucide-react';
import AddAccountDialog from '@/components/addAccountDialog';
import PatchAccountDialog from '@/components/patchAccountDialog';
import Loading from '@/components/loading';
import { LoaderCircle } from 'lucide-react';

export default function Page() {
    const [accountsData, setAccountsData] = useState<IData>();
    const [accountsFullData, setAccountsFullData] = useState<IData>();
    const [fetched, setFetched] = useState(false);
    const router = useRouter();
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [emailToPatch, setEmailToPatch] = useState("");
    const [idToPatch, setIdToPatch] = useState("");
    const [patchDialogOpen, setPatchDialogOpen] = useState(false);

    useEffect(() => {
        if (!fetched) {
            getAccounts().then((data) => {
                if (!data) {
                    return router.push("/login/admin");
                }

                if (data) {
                    setAccountsData(data);
                    setAccountsFullData(data);
                    setFetched(true);
                }
            });
        }
    }, [])

    function addAccount() {
        setAddDialogOpen(true);
    }

    function editAccount(id: string) {
        setIdToPatch(id);
        setEmailToPatch(accountsData?.data.find((account) => account.id === id)!.email!);

        setPatchDialogOpen(true);
    }

    async function deleteCurrentAccount(id: string) {
        setLoading(true);

        const valid = await deleteAccount(id);

        setLoading(false);

        if (!valid) return

        setAccountsData({
            data: accountsData?.data.filter((account) => account.id !== id)!
        });
    }

    if (!fetched) {
        return (
            <Loading />
        )
    }

    function search(value: string) {
        if (!accountsFullData) return;

        if (!value || value === "") return setAccountsData(accountsFullData);

        if (parseInt(value)) {
            setAccountsData({
                data: accountsFullData?.data.filter((user) => user.id.includes(value))!
            });
            return;
        }

        setAccountsData({
            data: accountsFullData?.data.filter((user) => user.email.toLowerCase().includes(value.toLowerCase()))!
        });
    }

    return (
        <main className='bg-background min-h-screen text-text'>
            <AddAccountDialog open={addDialogOpen} setDialogOpen={setAddDialogOpen} />
            <PatchAccountDialog id={idToPatch} open={patchDialogOpen} setDialogOpen={setPatchDialogOpen} emailDefault={emailToPatch} />

            <div className='container pt-10 md:pt-20 flex flex-col gap-y-6 md:gap-y-10'>
                <h1 className='text-primary font-semibold text-5xl'>Panel Admin</h1>

                <button onClick={addAccount} className='bg-primary px-4 py-2 rounded-xl text-background w-fit font-semibold'>
                    Tambah Akun
                </button>

                <input onChange={(e) => search(e.target.value)} className="bg-background px-4 py-2 rounded-lg border-2 border-primary focus:outline-none" placeholder="Cari"></input>

                <Table className='border-2'>
                    <TableHeader>
                        <TableRow className='*:font-semibold *:text-xl'>
                            <TableHead>ID</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className='text-right'>Dibuat Pada</TableHead>
                            <TableHead className='text-right'>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accountsData?.data.map((account) => (
                            <TableRow>
                                <TableCell className="font-medium">{account.id}</TableCell>
                                <TableCell>{account.email}</TableCell>
                                <TableCell className='text-right'>{new Date(account.createdAt).toLocaleString()}</TableCell>
                                <TableCell className='text-right flex items-center gap-x-3 justify-end'>
                                    <button onClick={() => editAccount(account.id)}>
                                        <Pencil className='stroke-blue-500' />
                                    </button>
                                    <button onClick={() => deleteCurrentAccount(account.id)}>
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