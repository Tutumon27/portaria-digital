
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 md:px-6 md:py-4 border-b border-border sticky top-0 bg-background z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}
