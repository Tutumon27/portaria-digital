"use client";

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Delivery } from "@/lib/types";
import { PortariaHeader } from "@/components/portaria/header";
import { DeliveryTable } from "@/components/portaria/delivery-table";
import { DeliveryDialog } from "@/components/portaria/delivery-dialog";
import { exportToCsv } from '@/lib/utils';

// Mock data to demonstrate functionality
const MOCK_DELIVERIES: Delivery[] = [
  {
    id: '1',
    apartment: '101',
    block: '1',
    description: 'Pacote Amazon - Livros',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDENTE',
    photoUrl: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: '2',
    apartment: '504',
    block: '2',
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
    description: 'Magazine Luiza - Fone de ouvido',
    createdAt: new Date().toISOString(),
    status: 'PENDENTE',
    photoUrl: 'https://picsum.photos/400/300?random=3',
  }
];


export default function Home() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you would fetch this from a database.
    // Here we use mock data and localStorage for persistence.
    const storedDeliveries = localStorage.getItem('deliveries');
    if (storedDeliveries) {
      setDeliveries(JSON.parse(storedDeliveries));
    } else {
      setDeliveries(MOCK_DELIVERIES);
    }
  }, []);

  useEffect(() => {
    // Persist deliveries to localStorage whenever they change
    if (deliveries.length > 0 || localStorage.getItem('deliveries')) {
        localStorage.setItem('deliveries', JSON.stringify(deliveries));
    }
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
    exportToCsv(deliveries);
  };

  const handleSubmit = (data: Omit<Delivery, 'id' | 'createdAt' | 'status'>, photo?: File) => {
    const photoUrl = photo ? URL.createObjectURL(photo) : (editingDelivery?.photoUrl || undefined);
    
    if (editingDelivery) {
      // Update existing delivery
      const updatedDeliveries = deliveries.map(d =>
        d.id === editingDelivery.id ? { ...editingDelivery, ...data, photoUrl } : d
      );
      setDeliveries(updatedDeliveries);
      toast({ title: "Encomenda atualizada!", description: `A encomenda para o apto ${data.apartment} foi atualizada.` });
    } else {
      // Add new delivery
      const newDelivery: Delivery = {
        id: new Date().getTime().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        status: 'PENDENTE',
        photoUrl,
      };
      setDeliveries([newDelivery, ...deliveries]);
      toast({ title: "Encomenda registrada!", description: `Nova encomenda para o apto ${data.apartment} registrada.` });
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
    <main className="min-h-screen bg-background">
      <PortariaHeader onAdd={handleAddClick} onExport={handleExportClick} />
      <DeliveryTable
        deliveries={deliveries}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onUpdateStatus={handleUpdateStatus}
      />
      <DeliveryDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={editingDelivery}
      />
    </main>
  );
}
