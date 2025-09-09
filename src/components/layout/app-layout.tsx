

"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Package, Users, Home } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function AppSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <Link href="/" className="block">
                    <div className="flex items-center gap-2 p-2">
                        <Package className="w-8 h-8 text-primary" />
                        {state === 'expanded' && <h1 className="text-xl font-bold text-primary">Portaria Digital</h1>}
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Entregas">
                            <Link href="/">
                                <Home />
                                <span>Entregas</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                         <SidebarMenuButton asChild isActive={pathname === '/moradores'} tooltip="Moradores">
                            <Link href="/moradores">
                                <Users />
                                <span>Moradores</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
