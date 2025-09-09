
"use client";

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Delivery, Resident } from "@/lib/types";
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
    apartment: '202',
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
    apartment: '303',
    block: '3',
    residentName: 'Pedro Santos',
    description: 'Magazine Luiza - Fone de ouvido',
    createdAt: new Date().toISOString(),
    status: 'PENDENTE',
    photoUrl: 'https://picsum.photos/400/300?random=3',
  }
];

const MOCK_RESIDENTS: Resident[] = [
  { id: '1', name: 'João da Silva', apartment: '101', block: '1', document: '123.456.789-00', phone: '11987654321' },
  { id: '2', name: 'Maria Oliveira', apartment: '202', block: '2', document: '234.567.890-11', phone: '21912345678' },
  { id: '3', name: 'Pedro Santos', apartment: '303', block: '3', document: '345.678.901-22', phone: '31955554444' },
];


export default function Home() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedDeliveries = localStorage.getItem('deliveries');
      if (storedDeliveries) {
        setDeliveries(JSON.parse(storedDeliveries));
      } else {
        setDeliveries(MOCK_DELIVERIES);
      }

      const storedResidents = localStorage.getItem('residents');
      if (storedResidents) {
        setResidents(JSON.parse(storedResidents));
      } else {
        setResidents(MOCK_RESIDENTS);
      }
    } catch (error) {
        console.error("Failed to parse from localStorage", error);
        setDeliveries(MOCK_DELIVERIES);
        setResidents(MOCK_RESIDENTS);
    }
  }, []);

  useEffect(() => {
    if(isClient) {
        localStorage.setItem('deliveries', JSON.stringify(deliveries));
    }
  }, [deliveries, isClient]);

  useEffect(() => {
    if(isClient) {
        localStorage.setItem('residents', JSON.stringify(residents));
    }
  }, [residents, isClient]);


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

  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Controle de Entregas</h1>
        <div className="flex items-center gap-2">
           <Button onClick={handleAddClick}>
            <PlusCircle />
            Adicionar
          </Button>
          <Button onClick={handleExportClick} variant="secondary">
            <Download />
            Exportar
          </Button>
        </div>
      </div>

      <DeliveryTable
        deliveries={deliveries}
        residents={residents}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onUpdateStatus={handleUpdateStatus}
      />
      
      <DeliveryDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={editingDelivery}
        residents={residents}
      />
    </div>
  );
}
