import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-primary">
            <div className="container py-5 lg:py-10 text-background font-semibold">
                <p className="text-xl lg:text-3xl">Copyright <Link className="hover:underline" href={"https://www.vann.my.id"}>Vann-Dev</Link> © {new Date().getFullYear()}</p>
                <p className="mt-10">
                    Repository Licensed Under BSD-3-Clause license, Modification is possible while copyright and license notices must be preserved.
                </p>
            </div>

        </footer>
    )
}