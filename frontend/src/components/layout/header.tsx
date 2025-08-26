import Link from "next/link"
import { ModeToggle } from "../mode-toggle"
import Image from "next/image"
import { Input } from "../ui/input"
import { Search, ShoppingBag, User } from "lucide-react"
import { Button } from "../ui/button"

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">

                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <div className="relative">
                                <Image src="/versel.svg" alt="Logo" width={32} height={32} className="dark:invert" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                                Marketplace
                            </span>
                        </Link>
                    </div>


                    <div className="flex-1 max-w-xl mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Игровые аккаунты , ПО , Веб сайты и многое другое"
                                className="w-full pl-10 pr-4 h-10 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-all duration-200"
                            />
                        </div>
                    </div>


                    <div className="flex items-center space-x-5">
                        <div className="flex gap-3">
                            <Link href={"/auth/login"} className="">Sing In</Link>
                            <Link href={"/auth/register"}>Sing Up</Link>
                        </div>

                        {/* Это используем после аутентификации */}

                        {/* <Button variant="ghost" size="icon" className="relative hover:bg-accent">
              <ShoppingBag className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <User className="h-5 w-5" />
            </Button> */}

                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}