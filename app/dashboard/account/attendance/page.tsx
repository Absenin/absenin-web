"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Trash2, Pencil, LoaderCircle, Calendar as CalendarIcon } from 'lucide-react';
import AddUserDialog from "@/components/addUserDialog";
import PatchUserDialog from "@/components/patchUserDialog";
import Exceljs from "exceljs";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { IAttendance, getAttendance } from "./actions";

export default function Page() {
    const [date, setDate] = useState<Date>(new Date());
    const [attendanceData, setAttendanceData] = useState<IAttendance | null>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!date || loading) return
        setLoading(true);
        getAttendance(date.getTime()).then((data) => {
            if (!data) {
                setAttendanceData(null);
            } else {
                setAttendanceData(data);
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
            { header: "Foto", key: "photo" },
            { header: "Absen Pada", key: "created_at" },
        ];

        attendanceData?.data.forEach((attendance) => {
            worksheet.addRow({
                nim: attendance.user.nim,
                name: attendance.user.name,
                photo: attendance.user.photo,
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

    return (
        <main className="min-h-screen bg-background text-text">
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
                    <button onClick={convertToExcel} className="hover:opacity-80 transition-opacity bg-[#1D6F42] px-4 py-2 rounded-xl text-background w-fit font-semibold">
                        Ubah ke Excel
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <LoaderCircle className='w-14 h-14 stroke-primary animate-spin mt-20 lg:mt-32' />
                    </div>
                ) : attendanceData ? (
                    <Table className='border-2'>
                        <TableHeader>
                            <TableRow className='*:font-semibold *:text-xl'>
                                <TableHead>NIM</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Foto</TableHead>
                                <TableHead className='text-right'>Absen Pada</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendanceData?.data.map((attendance) => (
                                <TableRow key={attendance.id}>
                                    <TableCell className="font-medium">{attendance.user.nim}</TableCell>
                                    <TableCell>{attendance.user.name}</TableCell>
                                    <TableCell className=''>{attendance.user.photo ? attendance.user.photo : "-"}</TableCell>
                                    <TableCell className='text-right'>{new Date(attendance.created_at).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center">Tidak ada data absensi</p>
                )}
            </div>
        </main>
    )
}