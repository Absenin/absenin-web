import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FormEvent, useState } from "react";
import { postAccount } from "@/app/dashboard/admin/actions";
import { LoaderCircle } from 'lucide-react';
import { postUser } from "@/app/dashboard/account/actions";

export default function AddUserDialog({ open, setDialogOpen }: { open: boolean, setDialogOpen: (open: boolean) => void }) {
    const [nim, setNim] = useState("");
    const [nama, setNama] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function addUser(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!nim || !nama) {
            return setError("NIM dan nama tidak boleh kosong");
        }

        setError("");

        setLoading(true);

        const valid = await postUser(nim, nama)

        setLoading(false);

        if (!valid) {
            return setError("Ada masalah saat menambahkan user");
        }

        setDialogOpen(false);
        setNim("");
        setNama("");
        window.location.reload();
    }

    return (
        <Dialog open={open}>
            <DialogContent className='bg-background'>
                <DialogHeader>
                    <DialogTitle className="mb-6">Tambahkan User</DialogTitle>
                    <DialogDescription>
                        <form onSubmit={(e) => addUser(e)} className="flex flex-col gap-y-6">

                            <input
                                type="number"
                                placeholder="Nim"
                                value={nim}
                                onChange={(e) => setNim(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            {
                                error && <p className="text-red-500">{error}</p>
                            }
                            <div className="flex flex-row gap-x-4">
                                <button
                                    onClick={() => setDialogOpen(false)}
                                    className="w-full text-center text-sm md:text-base lg:text-xl text-text rounded-2xl font-semibold hover:opacity-80 px-6 py-2"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary flex justify-center items-center w-full text-center text-sm md:text-base lg:text-xl text-background rounded-2xl font-semibold hover:opacity-80 px-6 py-2"
                                >
                                    {
                                        loading ? <LoaderCircle className='animate-spin' /> : "Tambahkan User"
                                    }
                                </button>
                            </div>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}