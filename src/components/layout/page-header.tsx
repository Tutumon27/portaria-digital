
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, Users } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";

export function PageHeader() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between p-4 md:px-6 border-b border-border sticky top-0 bg-background z-10">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Package className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold hidden sm:block">Portaria Digital</h1>
        </Link>
        <nav className="flex items-center gap-2">
            <Link href="/" asChild>
                <Button variant={pathname === '/' ? 'secondary' : 'ghost'}>
                    <Package className="sm:mr-2"/>
                    Entregas
                </Button>
            </Link>
             <Link href="/moradores" asChild>
                <Button variant={pathname === '/moradores' ? 'secondary' : 'ghost'}>
                    <Users className="sm:mr-2"/>
                    Moradores
                </Button>
            </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
