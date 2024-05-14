import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="text-text bg-background pt-10 lg:pt-0 pb-20">
      <div className="fixed right-3 bottom-2 border-2 border-primary px-4 py-2 text-xs md:text-base rounded-xl bg-background font-semibold">
        <Link href="https://github.com/Absenin" target="_blank">Source Code Available On Github</Link>
      </div>

      <section className="flex md:items-center md:justify-center">
        <div className="grid lg:grid-cols-2 items-center w-full lg:gap-x-14 container min-h-screen">
          <div>
            <h1 className="font-semibold text-3xl md:text-6xl"><span className="font-bold">Absensi</span> Berbasis QR dengan autentikasi <span className="text-primary">multilevel</span> dan keamanan <span className="text-primary">multilevel</span> 🔥</h1>
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
      </section>

      <section className="container py-10 md:py-32">
        <h2 className="text-xl md:text-5xl font-semibold text-center lg:max-w-screen-md lg:mx-auto">Dibuat Dengan</h2>
        <div className="flex justify-between mt-10 md:mt-20">
          <Image src={"/nextjs.png"} alt="" width={1000} height={1000} className="h-6 md:h-20 w-auto" />
          <Image src={"/flask.png"} alt="" width={1000} height={1000} className="h-6 md:h-20 w-auto" />
          <Image src={"/prisma.png"} alt="" width={1000} height={1000} className="h-6 md:h-20 w-auto" />
          <Image src={"/postgress.png"} alt="" width={1000} height={1000} className="h-6 md:h-20 w-auto" />
        </div>
      </section>

      <section className="container mt-20">
        <p className="text-center text-xl mb-2">Fitur Absenin</p>
        <h2 className="text-xl md:text-5xl font-semibold text-center lg:max-w-screen-md lg:mx-auto">Apa Yang Membuat Absenin Berbeda?</h2>

        <div className="grid md:grid-cols-2 mt-20 items-center gap-14">
          <div className="flex flex-col gap-y-10">
            <div>
              <h3 className="font-semibold text-lg md:text-3xl text-primary">1 Device 1 Kali Scan</h3>
              <p className="mt-3">Satu device hanya bisa 1x scan setiap QR, sehingga tidak bisa mengabsenkan orang lain.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg md:text-3xl text-primary">Logging IP dan DeviceID Untuk Setiap Absen</h3>
              <p className="mt-3">Ketika orang lain absen, kita memastikan bahwa setiap absen itu <strong>UNIK</strong>, sehingga lebih aman.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg md:text-3xl text-primary">Autentikasi Multilevel</h3>
              <p className="mt-3">Autentikasi Multilevel memastikan bahwa setiap user dapat memiliki anggota nya masing masing, sehingga lebih aman.</p>
            </div>
          </div>
          <Image src={"/one-scan.svg"} alt="" width={1000} height={1000} className="w-full" />
        </div>
      </section>

      <section className="container mt-20">
        <p className="text-center text-xl mb-2">Cara Kerja</p>
        <h2 className="text-xl md:text-5xl font-semibold text-center lg:max-w-screen-md lg:mx-auto">Bagaimana cara kerja pada Absenin?</h2>

        <Image src={"/cara-kerja.png"} alt="" width={1000} height={1000} className="w-full md:w-3/4 lg:w-1/2 mt-10 mx-auto rounded-lg" />
      </section>
    </main>
  );
}
