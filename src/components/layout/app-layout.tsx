

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
                <div className="flex items-center gap-2 p-2">
                    <Package className="w-8 h-8 text-primary" />
                    {state === 'expanded' && <h1 className="text-xl font-bold text-primary">Portaria Digital</h1>}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Entregas">
                                <a>
                                    <Home />
                                    <span>Entregas</span>
                                </a>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Link href="/moradores" legacyBehavior passHref>
                            <SidebarMenuButton asChild isActive={pathname === '/moradores'} tooltip="Moradores">
                                <a>
                                    <Users />
                                    <span>Moradores</span>
                                </a>
                            </SidebarMenuButton>
                        </Link>
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
