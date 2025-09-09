export type Delivery = {
  id: string;
  apartment: string;
  block: '1' | '2' | '3';
  description: string;
  photoUrl?: string;
  status: 'PENDENTE' | 'ENTREGUE';
  createdAt: string;
  deliveredAt?: string;
  retiradoPor?: string;
};

export type DeliveryStatusFilter = 'all' | 'PENDENTE' | 'ENTREGUE';

export const BLOCKS = ['1', '2', '3'] as const;
