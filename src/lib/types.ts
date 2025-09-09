export type Delivery = {
  id: string;
  apartment: string;
  block: '1' | '2' | '3';
  residentName: string;
  description: string;
  photoUrl?: string;
  status: 'PENDENTE' | 'ENTREGUE';
  createdAt: string;
  deliveredAt?: string;
  retiradoPor?: string;
};

export type Resident = {
  id: string;
  name: string;
  apartment: string;
  block: '1' | '2' | '3';
  document: string;
  phone: string;
}

export type DeliveryStatusFilter = 'all' | 'PENDENTE' | 'ENTREGUE';

export const BLOCKS = ['1', '2', '3'] as const;
