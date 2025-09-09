
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Delivery, Resident } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function downloadCsv(csvContent: string, filename: string) {
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToCsv(data: Delivery[], filename: string) {
  if (data.length === 0) {
    alert("Não há dados para exportar.");
    return;
  }

  const headers = [
    'ID', 'Morador', 'Apartamento', 'Bloco', 'Descrição', 'Status', 
    'Data de Criação', 'Data de Entrega', 'Retirado Por'
  ];
  const rows = data.map(d => [
    d.id,
    `"${d.residentName.replace(/"/g, '""')}"`,
    d.apartment,
    d.block,
    `"${d.description.replace(/"/g, '""')}"`,
    d.status,
    d.createdAt ? new Date(d.createdAt).toISOString() : '',
    d.deliveredAt ? new Date(d.deliveredAt).toISOString() : '',
    d.retiradoPor ? `"${d.retiradoPor.replace(/"/g, '""')}"` : ''
  ]);

  const csvRows = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const csvContent = "data:text/csv;charset=utf-8," + csvRows;
  
  downloadCsv(csvContent, filename);
}

// Type guard to check if an object is a valid Delivery
export function isDelivery(obj: any): obj is Delivery {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.residentName === 'string' &&
    typeof obj.apartment === 'string' &&
    typeof obj.block === 'string' &&
    typeof obj.description === 'string' &&
    (obj.status === 'PENDENTE' || obj.status === 'ENTREGUE') &&
    typeof obj.createdAt === 'string' &&
    !isNaN(new Date(obj.createdAt).getTime())
  );
}
