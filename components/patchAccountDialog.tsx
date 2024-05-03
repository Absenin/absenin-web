import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import { patchAccount } from "@/app/dashboard/admin/actions";
import { LoaderCircle } from 'lucide-react';

export default function PatchAccountDialog({ id, emailDefault, open, setDialogOpen }: { id: string, emailDefault: string, open: boolean, setDialogOpen: (open: boolean) => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setEmail(emailDefault);
    }, [emailDefault])

    async function editAccount() {
        if (!email) {
            return setError("Email tidak boleh kosong");
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
            return setError("Email tidak valid");
        }

        setError("");

        setLoading(true);

        const valid = await patchAccount(id, email, password)

        setLoading(false);

        if (!valid) {
            return setError("Ada masalah saat mengedit akun");
        }

        setDialogOpen(false);
        setEmail("");
        setPassword("");
        window.location.reload();
    }

    return (
        <Dialog open={open}>
            <DialogContent className='bg-background'>
                <DialogHeader>
                    <DialogTitle className="mb-6">Edit Akun</DialogTitle>
                    <DialogDescription className="flex flex-col gap-y-6">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password ?? ""}
                            onChange={(e) => setPassword(e.target.value)}
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
                                onClick={editAccount}
                                className="bg-primary flex items-center justify-center w-full text-center text-sm md:text-base lg:text-xl text-background rounded-2xl font-semibold hover:opacity-80 px-6 py-2"
                            >
                                {
                                    loading ? <LoaderCircle className="animate-spin" /> : "Edit"
                                }
                            </button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}