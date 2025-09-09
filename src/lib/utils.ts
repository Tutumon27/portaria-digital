import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Delivery } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToCsv(deliveries: Delivery[], filename = 'entregas.csv') {
  if (deliveries.length === 0) {
    alert("Não há dados para exportar.");
    return;
  }
  
  const headers = [
    'ID',
    'Apartamento',
    'Bloco',
    'Descrição',
    'Status',
    'Data de Criação',
    'Data de Entrega',
    'Retirado Por'
  ];

  const rows = deliveries.map(d => [
    d.id,
    d.apartment,
    d.block,
    `"${d.description.replace(/"/g, '""')}"`,
    d.status,
    new Date(d.createdAt).toLocaleString('pt-BR'),
    d.deliveredAt ? new Date(d.deliveredAt).toLocaleString('pt-BR') : '',
    d.retiradoPor || ''
  ].join(','));

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows].join('\n');
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
