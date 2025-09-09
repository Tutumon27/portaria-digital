
"use client";

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Delivery } from "@/lib/types";
import { PageHeader } from "@/components/layout/page-header";
import { DeliveryTable } from "@/components/portaria/delivery-table";
import { DeliveryDialog } from "@/components/portaria/delivery-dialog";
import { exportToCsv } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle } from 'lucide-react';

const MOCK_DELIVERIES: Delivery[] = [
  {
    id: '1',
    apartment: '101',
    block: '1',
    residentName: 'João da Silva',
    description: 'Pacote Amazon - Livros',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDENTE',
    photoUrl: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: '2',
    apartment: '504',
    block: '2',
    residentName: 'Maria Oliveira',
    description: 'Mercado Livre - Eletrônicos',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ENTREGUE',
    deliveredAt: new Date().toISOString(),
    retiradoPor: 'Maria Silva',
    photoUrl: 'https://picsum.photos/400/300?random=2',
  },
  {
    id: '3',
    apartment: '1202',
    block: '3',
    residentName: 'Pedro Santos',
    description: 'Magazine Luiza - Fone de ouvido',
    createdAt: new Date().toISOString(),
    status: 'PENDENTE',
    photoUrl: 'https://picsum.photos/400/300?random=3',
  }
];


export default function Home() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    if (typeof window === 'undefined') return [];
    const storedDeliveries = localStorage.getItem('deliveries');
    return storedDeliveries ? JSON.parse(storedDeliveries) : MOCK_DELIVERIES;
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  const handleAddClick = () => {
    setEditingDelivery(null);
    setDialogOpen(true);
  };

  const handleEditClick = (delivery: Delivery) => {
    setEditingDelivery(delivery);
    setDialogOpen(true);
  };

  const handleExportClick = () => {
    exportToCsv(deliveries, 'entregas.csv');
  };

  const handleSubmit = (data: Omit<Delivery, 'id' | 'createdAt' | 'status'>, photo?: File) => {
    const photoUrl = photo ? URL.createObjectURL(photo) : (editingDelivery?.photoUrl || undefined);
    
    if (editingDelivery) {
      const updatedDeliveries = deliveries.map(d =>
        d.id === editingDelivery.id ? { ...editingDelivery, ...data, photoUrl } : d
      );
      setDeliveries(updatedDeliveries);
      toast({ title: "Encomenda atualizada!", description: `A encomenda para ${data.residentName} foi atualizada.` });
    } else {
      const newDelivery: Delivery = {
        id: new Date().getTime().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        status: 'PENDENTE',
        photoUrl,
      };
      setDeliveries([newDelivery, ...deliveries]);
      toast({ title: "Encomenda registrada!", description: `Nova encomenda para ${data.residentName} registrada.` });
    }
  };

  const handleDelete = (id: string) => {
    setDeliveries(deliveries.filter(d => d.id !== id));
    toast({ title: "Encomenda excluída.", variant: "destructive" });
  };

  const handleUpdateStatus = (id: string, pickupBy: string) => {
    setDeliveries(deliveries.map(d => 
      d.id === id 
        ? { ...d, status: 'ENTREGUE', retiradoPor: pickupBy, deliveredAt: new Date().toISOString() } 
        : d
    ));
    toast({ title: "Entrega confirmada!", description: `A encomenda foi marcada como entregue.` });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
       <PageHeader title="Controle de Entregas">
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
        <DeliveryTable
          deliveries={deliveries}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
      <DeliveryDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={editingDelivery}
      />
    </main>
  );
}
