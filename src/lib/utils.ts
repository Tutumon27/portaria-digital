
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Delivery, Resident } from "@/lib/types";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


export function exportToPdfForDelivery(data: Delivery[], filename: string) {
  const pendingDeliveries = data.filter(d => d.status === 'PENDENTE');

  if (pendingDeliveries.length === 0) {
    alert("Não há encomendas pendentes para exportar.");
    return;
  }
  
  const doc = new jsPDF();

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
  
  const body = [];
  for (let i = 0; i < maxRows; i++) {
    body.push([
      deliveriesByBlock['1'][i] || '',
      deliveriesByBlock['2'][i] || '',
      deliveriesByBlock['3'][i] || '',
    ]);
  }

  autoTable(doc, {
    head: [['Bloco 1', 'Bloco 2', 'Bloco 3']],
    body: body,
    didDrawPage: function (data) {
      doc.setFontSize(18);
      doc.text('Relatório de Entregas Pendentes', data.settings.margin.left, 15);
    },
  });

  doc.save(filename);
}

export function exportToCsvFullData(data: Delivery[], filename: string) {
  if (data.length === 0) {
    alert("Não há dados para exportar.");
    return;
  }

  const headers = [
    'ID',
    'Morador',
    'Apartamento',
    'Bloco',
    'Descrição',
    'Status',
    'Data de Criação',
    'Data de Entrega',
    'Retirado Por',
    'URL da Foto'
  ];

  const rows = data.map(d => [
    `"${d.id}"`,
    `"${d.residentName}"`,
    `"${d.apartment}"`,
    `"${d.block}"`,
    `"${d.description.replace(/"/g, '""')}"`, // Escape double quotes
    `"${d.status}"`,
    `"${format(new Date(d.createdAt), 'yyyy-MM-dd HH:mm:ss')}"`,
    d.deliveredAt ? `"${format(new Date(d.deliveredAt), 'yyyy-MM-dd HH:mm:ss')}"` : '""',
    `"${d.retiradoPor || ''}"`,
    `"${d.photoUrl || ''}"`
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
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
