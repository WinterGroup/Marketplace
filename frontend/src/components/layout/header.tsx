import Link from "next/link"
import { ModeToggle } from "../mode-toggle"
import Image from "next/image"

export default function Header() {
    return (
        <header className="border-b py-5 px-2">
            <div className="container mx-auto flex items-center justify-between">
                <Link href={"/"} className="flex items-center gap-3">
                    <Image
                        src="/vercel.svg"
                        alt="Logo"
                        width={30}
                        height={30}
                    />
                    <span className="text-xl font-bold ml-2">Markplace</span>
                </Link>
                <ModeToggle />
            </div>
        </header >
    )
}