import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FormEvent, useEffect, useState } from "react";
import { patchAccount } from "@/app/dashboard/admin/actions";
import { LoaderCircle } from 'lucide-react';
import { patchUser } from "@/app/dashboard/account/actions";

export default function PatchUserDialog({ id, nimDefault, nameDefault, open, setDialogOpen }: { id: string, nimDefault: string, nameDefault: string, open: boolean, setDialogOpen: (open: boolean) => void }) {
    const [nim, setNim] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setNim(nimDefault);
        setName(nameDefault);
    }, [nimDefault, nameDefault])

    async function editUser(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!nim || !name) {
            return setError("NIM dan nama tidak boleh kosong");
        }

        setError("");

        setLoading(true);

        const valid = await patchUser(id, nim, name)

        setLoading(false);

        if (!valid) {
            return setError("Ada masalah saat mengedit user");
        }

        setDialogOpen(false);
        setNim("");
        setName("");
        window.location.reload();
    }

    return (
        <Dialog open={open}>
            <DialogContent className='bg-background'>
                <DialogHeader>
                    <DialogTitle className="mb-6">Edit User</DialogTitle>
                    <DialogDescription>
                        <form onSubmit={(e) => editUser(e)} className="flex flex-col gap-y-6">
                            <input
                                type="number"
                                placeholder="Nim"
                                value={nim}
                                onChange={(e) => setNim(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                    disabled={loading}
                                    type="submit"
                                    className="bg-primary flex items-center justify-center w-full text-center text-sm md:text-base lg:text-xl text-background rounded-2xl font-semibold hover:opacity-80 px-6 py-2"
                                >
                                    {
                                        loading ? <LoaderCircle className="animate-spin" /> : "Edit"
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