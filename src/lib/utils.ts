
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
    d.id, `"${d.residentName.replace(/"/g, '""')}"`, d.apartment, d.block, `"${d.description.replace(/"/g, '""')}"`,
    d.status, new Date(d.createdAt).toLocaleString('pt-BR'),
    d.deliveredAt ? new Date(d.deliveredAt).toLocaleString('pt-BR') : '',
    d.retiradoPor || ''
  ]);

  const csvRows = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const csvContent = "data:text/csv;charset=utf-8," + csvRows;
  
  downloadCsv(csvContent, filename);
}
