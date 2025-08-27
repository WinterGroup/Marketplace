'use client';

import Link from "next/link"
import { ModeToggle } from "../mode-toggle"
import Image from "next/image"
import { Input } from "../ui/input"
import { Search, ShoppingBag, User, LogOut, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function Header() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const getAccountStatusText = (status: string) => {
        switch (status) {
            case 'buyer':
                return 'Покупатель';
            case 'seller':
                return 'Продавец';
            case 'both':
                return 'Покупатель и продавец';
            default:
                return status;
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">

                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <div className="relative">
                                <Image src="/next.svg" alt="Logo" width={32} height={32} className="dark:invert" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                                Marketplace
                            </span>
                        </Link>
                        
                        <nav className="ml-8 flex items-center space-x-6">
                            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Продукты
                            </Link>
                            
                            {/* Ссылка на тестовую страницу API (только для разработки) */}
                            {process.env.NODE_ENV === 'development' && (
                                <Link href="/test-api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Test API
                                </Link>
                            )}
                        </nav>
                    </div>

                    <div className="flex-1 max-w-xl mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Игровые аккаунты, ПО, Веб сайты и многое другое"
                                className="w-full pl-10 pr-4 h-10 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-5">
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Загрузка...</span>
                            </div>
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-foreground">
                                        {user.username}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {getAccountStatusText(user.account_status)}
                                    </span>
                                </div>
                                <Link href="/order">
                                    <Button variant="ghost" size="icon" className="relative hover:bg-accent">
                                        <ShoppingBag className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-accent">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link href="/auth/login">
                                    <Button variant="ghost">Войти</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button>Регистрация</Button>
                                </Link>
                            </div>
                        )}

                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}