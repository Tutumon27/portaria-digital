
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
  const pendingDeliveries = data.filter(d => d.status === 'PENDENTE');

  if (pendingDeliveries.length === 0) {
    alert("Não há encomendas pendentes para exportar.");
    return;
  }

  const deliveriesByBlock: { [key: string]: string[] } = {
    '1': [],
    '2': [],
    '3': [],
  };

  pendingDeliveries.forEach(d => {
    if (deliveriesByBlock[d.block]) {
      deliveriesByBlock[d.block].push(d.apartment);
    }
  });

  // Sort apartments numerically
  Object.keys(deliveriesByBlock).forEach(block => {
    deliveriesByBlock[block].sort((a, b) => Number(a) - Number(b));
  });

  const maxRows = Math.max(
    deliveriesByBlock['1'].length,
    deliveriesByBlock['2'].length,
    deliveriesByBlock['3'].length
  );

  const headers = ['Bloco 1', 'Bloco 2', 'Bloco 3'];
  const rows: string[][] = [];

  for (let i = 0; i < maxRows; i++) {
    rows.push([
      deliveriesByBlock['1'][i] || '',
      deliveriesByBlock['2'][i] || '',
      deliveriesByBlock['3'][i] || '',
    ]);
  }

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
