'use client';

import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { Input } from "../ui/input";
import { Search, ShoppingBag, User, LogOut, Loader2, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

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
            default:
                return status;
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">

                    {/* Логотип */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                                Marketplace
                            </span>
                        </Link>

                        {/* Навигация для ПК */}
                        <nav className="hidden md:flex ml-8 items-center space-x-6">
                            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Продукты
                            </Link>
                        </nav>
                    </div>

                    {/* Поиск */}
                    <div className="flex-1 max-w-xl mx-4 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Игровые аккаунты, ПО, Веб сайты и многое другое"
                                className="w-full pl-10 pr-4 h-10 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Аватар и кнопки */}
                    <div className="flex items-center space-x-2 md:space-x-5">
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Загрузка...</span>
                            </div>
                        ) : user ? (
                            <div className="hidden md:flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-foreground">{user.username}</span>
                                    <span className="text-xs text-muted-foreground">{getAccountStatusText(user.account_status)}</span>
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
                            <div className="hidden md:flex gap-3">
                                <Link href="/auth/login">
                                    <Button variant="ghost">Войти</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button>Регистрация</Button>
                                </Link>
                            </div>
                        )}

                        {/* Темная/светлая тема */}
                        <ModeToggle />

                        {/* Бургер меню для мобильных */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Мобильное меню */}
                {menuOpen && (
                    <div className="md:hidden mt-2 pb-2 border-t border-muted">
                        <nav className="flex flex-col gap-2">
                            <Link href="/products" onClick={() => setMenuOpen(false)}>
                                Продукты
                            </Link>
                            {user ? (
                                <>
                                    <Link href="/order" onClick={() => setMenuOpen(false)}>
                                        Заказы
                                    </Link>
                                    <Button variant="ghost" onClick={handleLogout}>Выйти</Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" onClick={() => setMenuOpen(false)}>Войти</Link>
                                    <Link href="/auth/register" onClick={() => setMenuOpen(false)}>Регистрация</Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
