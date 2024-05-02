import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex md:items-center md:justify-center min-h-screen text-text bg-background pt-10 lg:pt-0">
      <div className="grid lg:grid-cols-2 items-center w-full lg:gap-x-14 container">
        <div>
          <h1 className="font-semibold text-3xl md:text-6xl"><span className="font-bold">Absensi</span> Berbasis QR dengan authentication <span className="text-primary">multilevel</span> 🔥</h1>
          <div className="flex flex-row gap-x-3 mt-10 *:px-6 *:py-3 *:lg:px-8 *:lg:py-4 *:transition-opacity">
            <Link href={"/login/admin"} className="bg-secondary text-center text-sm md:text-base lg:text-xl rounded-2xl font-semibold hover:opacity-80">
              Login Admin
            </Link>
            <Link href={"/login/account"} className="bg-primary text-center text-sm md:text-base lg:text-xl text-background rounded-2xl font-semibold hover:opacity-80">
              Login Akun
            </Link>
          </div>
        </div>

        <Image className="w-full h-auto" src={"/hero-svg.svg"} alt="" width={1000} height={1000} />
      </div>
    </main>
  );
}
