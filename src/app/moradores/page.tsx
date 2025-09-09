
"use client";

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Resident } from "@/lib/types";
import { PageHeader } from "@/components/layout/page-header";
import { ResidentTable } from "@/components/moradores/resident-table";
import { ResidentDialog } from "@/components/moradores/resident-dialog";
import { exportToCsv } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle } from 'lucide-react';

const MOCK_RESIDENTS: Resident[] = [
  { id: '1', name: 'João da Silva', apartment: '101', block: '1', document: '123.456.789-00', phone: '(11) 98765-4321' },
  { id: '2', name: 'Maria Oliveira', apartment: '202', block: '2', document: '234.567.890-11', phone: '(21) 91234-5678' },
  { id: '3', name: 'Pedro Santos', apartment: '303', block: '3', document: '345.678.901-22', phone: '(31) 95555-4444' },
];

export default function MoradoresPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedResidents = localStorage.getItem('residents');
      if (storedResidents) {
        setResidents(JSON.parse(storedResidents));
      } else {
        setResidents(MOCK_RESIDENTS);
      }
    } catch (error) {
      console.error("Failed to parse residents from localStorage", error);
      setResidents(MOCK_RESIDENTS);
    }
  }, []);

  useEffect(() => {
    if (residents.length > 0) {
      localStorage.setItem('residents', JSON.stringify(residents));
    }
  }, [residents]);

  const handleAddClick = () => {
    setEditingResident(null);
    setDialogOpen(true);
  };

  const handleEditClick = (resident: Resident) => {
    setEditingResident(resident);
    setDialogOpen(true);
  };

  const handleExportClick = () => {
    exportToCsv(residents, 'moradores.csv');
  };

  const handleSubmit = (data: Omit<Resident, 'id'>) => {
    if (editingResident) {
      const updatedResidents = residents.map(r =>
        r.id === editingResident.id ? { ...editingResident, ...data } : r
      );
      setResidents(updatedResidents);
      toast({ title: "Morador atualizado!", description: `Os dados de ${data.name} foram atualizados.` });
    } else {
      const newResident: Resident = {
        id: new Date().getTime().toString(),
        ...data,
      };
      setResidents([newResident, ...residents]);
      toast({ title: "Morador registrado!", description: `${data.name} foi adicionado(a) à lista.` });
    }
  };

  const handleDelete = (id: string) => {
    setResidents(residents.filter(r => r.id !== id));
    toast({ title: "Morador excluído.", variant: "destructive" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageHeader title="Cadastro de Moradores">
        <Button onClick={handleAddClick}>
          <PlusCircle />
          Adicionar
        </Button>
        <Button onClick={handleExportClick} variant="secondary">
          <Download />
          Exportar
        </Button>
      </PageHeader>
      <div className="p-4 md:p-6">
        <ResidentTable
          residents={residents}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      </div>
      <ResidentDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={editingResident}
      />
    </main>
  );
}
