
"use client";

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Resident } from "@/lib/types";
import { ResidentTable } from "@/components/portaria/resident-table";
import { ResidentDialog } from "@/components/portaria/resident-dialog";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const MOCK_RESIDENTS: Resident[] = [
  { id: '1', name: 'João da Silva', apartment: '101', block: '1', document: '123.456.789-00', phone: '11987654321' },
  { id: '2', name: 'Maria Oliveira', apartment: '202', block: '2', document: '234.567.890-11', phone: '21912345678' },
  { id: '3', name: 'Pedro Santos', apartment: '303', block: '3', document: '345.678.901-22', phone: '31955554444' },
];

export default function MoradoresPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedResidents = localStorage.getItem('residents');
      if (storedResidents) {
        setResidents(JSON.parse(storedResidents));
      } else {
        setResidents(MOCK_RESIDENTS);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      setResidents(MOCK_RESIDENTS);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('residents', JSON.stringify(residents));
    }
  }, [residents, isClient]);

  const handleAddClick = () => {
    setEditingResident(null);
    setDialogOpen(true);
  };

  const handleEditClick = (resident: Resident) => {
    setEditingResident(resident);
    setDialogOpen(true);
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
      toast({ title: "Morador adicionado!", description: `${data.name} foi adicionado(a) à lista de moradores.` });
    }
  };

  const handleDelete = (id: string) => {
    setResidents(residents.filter(r => r.id !== id));
    toast({ title: "Morador excluído.", variant: "destructive" });
  };
  
  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Cadastro de Moradores</h1>
        <Button onClick={handleAddClick}>
          <PlusCircle />
          Adicionar Morador
        </Button>
      </div>

      <ResidentTable
        residents={residents}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />
      
      <ResidentDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={editingResident}
      />
    </div>
  );
}
