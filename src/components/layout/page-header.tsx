
"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function PageHeader() {
  return (
    <header className="flex items-center justify-between p-4 md:px-6 border-b border-border sticky top-0 bg-background z-10">
      <Link href="/" className="flex items-center gap-2">
        <Package className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-bold">Portaria Digital</h1>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
