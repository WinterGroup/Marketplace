'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="px-4 py-10">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Добро пожаловать в Marketplace
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          Откройте для себя мир цифровых товаров: игровые аккаунты, программное обеспечение, веб-сайты и многое другое
        </p>
        
        {user && user.account_status === 'seller' && (
          <Link href="/create-product">
            <Button variant="outline" className="flex items-center gap-2 mx-auto">
              Добавить товар
            </Button>
          </Link>
        )}

        <div className="mt-12">
          <Link href="/products">
            <Button className="mx-auto">Смотреть все товары</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
