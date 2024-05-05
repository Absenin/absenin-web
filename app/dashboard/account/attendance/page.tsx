"use client"

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { LoaderCircle, Calendar as CalendarIcon } from 'lucide-react';
import Exceljs from "exceljs";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { IAttendance, getAttendance, postDate, urlSafeBase64Encode } from "./actions";
import QRCode from "qrcode";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image";

function QRDialog({ open, qrImage, setDialogOpen }: { open: boolean, qrImage: string, setDialogOpen: (open: boolean) => void }) {
    return (
        <Dialog open={open}>
            <DialogContent className='bg-background'>
                <DialogHeader>
                    <DialogTitle className="mb-6">Link Absensi</DialogTitle>
                    <DialogDescription className="flex flex-col gap-y-6">
                        <Image src={qrImage} alt="QR Code" width={1000} height={1000} className="w-full" />
                    </DialogDescription>
                </DialogHeader>
                <button className="font-semibold" onClick={() => setDialogOpen(false)}>
                    Tutup
                </button>
            </DialogContent>
        </Dialog>
    )
}

export default function Page() {
    const [date, setDate] = useState<Date>(new Date());
    const [attendanceData, setAttendanceData] = useState<IAttendance | null>();
    const [attendanceFullData, setAttendanceFullData] = useState<IAttendance | null>();
    const [loading, setLoading] = useState(false);
    const [dialogShowed, setDialogShowed] = useState(false);
    const [qrImage, setQrImage] = useState("");

    useEffect(() => {
        if (!date || loading) return
        setLoading(true);
        getAttendance(date.getTime()).then((data) => {
            if (!data) {
                setAttendanceData(null);
            } else {
                setAttendanceData(data);
                setAttendanceFullData(data);
            }

            setLoading(false);
        });
    }, [date])

    function selectDate(date: Date) {
        if (!date || loading) return;

        setDate(date);
    }

    function convertToExcel() {
        const workbook = new Exceljs.Workbook();

        const worksheet = workbook.addWorksheet("Absensi");

        worksheet.columns = [
            { header: "NIM", key: "nim" },
            { header: "Nama", key: "name" },
            { header: "Absen Pada", key: "created_at" },
        ];

        attendanceData?.data.forEach((attendance) => {
            worksheet.addRow({
                nim: attendance.user.nim,
                name: attendance.user.name,
                created_at: new Date(attendance.created_at).toLocaleString(),
            });
        });

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "absensi.xlsx";
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    function search(value: string) {
        if (!attendanceFullData) return;

        if (!value || value === "") return setAttendanceData(attendanceFullData);

        if (parseInt(value)) {
            setAttendanceData({
                data: attendanceFullData?.data.filter((user) => user.user.nim.includes(value))!,
                id: attendanceFullData.id
            });
            return;
        }

        setAttendanceData({
            data: attendanceFullData?.data.filter((user) => user.user.name.toLowerCase().includes(value.toLowerCase()))!,
            id: attendanceFullData.id
        });
    }

    async function showQR() {
        if (!attendanceData) return;
        QRCode.toDataURL(`${window.location.origin}/attend/${await urlSafeBase64Encode(JSON.stringify({
            dateId: attendanceData.id,
            expiredAt: new Date().getTime() + 1000 * 60 * 10
        }))}`, function (err, url) {
            if (err) return console.error(err);
            setDialogShowed(true);
            setQrImage(url);
        });
    }

    function createDate() {
        setLoading(true);
        postDate(date.getTime()).then((res) => {
            if (!res) return;
            getAttendance(date.getTime()).then((data) => {
                if (!data) {
                    setAttendanceData(null);
                } else {
                    setAttendanceData(data);
                    setAttendanceFullData(data);
                }

                setLoading(false);
            });
        })
    }

    return (
        <main className="min-h-screen bg-background text-text">
            <QRDialog open={dialogShowed} qrImage={qrImage} setDialogOpen={setDialogShowed} />

            <div className="container pt-10 md:pt-20 flex flex-col gap-y-6 md:gap-y-10">
                <h1 className='text-primary font-semibold text-5xl'>Panel Absensi</h1>

                <div className="flex gap-5 flex-wrap">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex gap-x-4 items-center w-fit rounded-xl border-2 px-4 py-2 border-primary">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(e) => selectDate(e!)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Link href={"/dashboard/account"} className="hover:opacity-80 transition-opacity bg-secondary px-4 py-2 rounded-xl text-text w-fit font-semibold">
                        Panel Akun
                    </Link>
                    {(attendanceData?.data.length! > 0 && !loading) && (
                        <button onClick={convertToExcel} className="hover:opacity-80 transition-opacity bg-[#1D6F42] px-4 py-2 rounded-xl text-background w-fit font-semibold">
                            Ubah ke Excel
                        </button>
                    )}
                    {(attendanceData?.data && !loading) && (
                        <button onClick={showQR} className="hover:opacity-80 transition-opacity bg-primary px-4 py-2 rounded-xl text-background w-fit font-semibold">
                            Tampilkan Link Absensi
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <LoaderCircle className='w-14 h-14 stroke-primary animate-spin mt-20 lg:mt-32' />
                    </div>
                ) : attendanceData ? (
                    <>
                        <input onChange={(e) => search(e.target.value)} className="bg-background px-4 py-2 rounded-lg border-2 border-primary focus:outline-none" placeholder="Cari"></input>

                        <Table className='border-2'>
                            <TableHeader>
                                <TableRow className='*:font-semibold *:text-xl'>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead className='text-right'>Absen Pada</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendanceData.data.length ? attendanceData?.data.map((attendance) => (
                                    <TableRow key={attendance.id}>
                                        <TableCell className="font-medium">{attendance.user.nim}</TableCell>
                                        <TableCell>{attendance.user.name}</TableCell>
                                        <TableCell className='text-right'>{new Date(attendance.created_at).toLocaleString()}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">Tidak ada data</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </>
                ) : (
                    <div className="flex justify-center">
                        <button onClick={createDate} className=" mt-20 lg:mt-32 bg-primary px-4 py-2 hover:opacity-70 transition-opacity rounded-lg text-white font-bold w-fit">
                            Buat Link Absensi
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}