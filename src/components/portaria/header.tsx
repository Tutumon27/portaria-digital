"use client";

import { Button } from "@/components/ui/button";
import { Download, PlusCircle, Package } from "lucide-react";
import { SidebarTrigger } from '@/components/ui/sidebar';

type HeaderProps = {
  onAdd: () => void;
  onExport: () => void;
};

export function PortariaHeader({ onAdd, onExport }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 md:p-6 border-b border-border sticky top-0 bg-background z-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Package className="w-8 h-8 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold">Portaria Digital</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
        <Button onClick={onExport} variant="secondary">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>
    </header>
  );
}
