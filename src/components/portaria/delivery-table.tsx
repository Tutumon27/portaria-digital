"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Delivery, DeliveryStatusFilter } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DeliveryTableProps = {
  deliveries: Delivery[];
  onEdit: (delivery: Delivery) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, pickupBy: string) => void;
};

export function DeliveryTable({
  deliveries,
  onEdit,
  onDelete,
  onUpdateStatus,
}: DeliveryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeliveryStatusFilter>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingDelivery, setUpdatingDelivery] = useState<Delivery | null>(null);
  const [pickupByName, setPickupByName] = useState("");
  const [previewingImage, setPreviewingImage] = useState<string | null>(null);

  const filteredDeliveries = useMemo(() => {
    return deliveries
      .filter((d) => statusFilter === "all" || d.status === statusFilter)
      .filter(
        (d) =>
          searchQuery === "" ||
          d.apartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [deliveries, statusFilter, searchQuery]);

  const handleUpdateStatus = () => {
    if (updatingDelivery && pickupByName) {
      onUpdateStatus(updatingDelivery.id, pickupByName);
      setUpdatingDelivery(null);
      setPickupByName("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por apartamento ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as DeliveryStatusFilter)}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="PENDENTE">Pendentes</TabsTrigger>
            <TabsTrigger value="ENTREGUE">Entregues</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Apartamento</TableHead>
              <TableHead>Bloco</TableHead>
              <TableHead className="hidden md:table-cell">Descrição</TableHead>
              <TableHead className="hidden sm:table-cell">Foto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.apartment}</TableCell>
                  <TableCell>{delivery.block}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">{delivery.description}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {delivery.photoUrl ? (
                       <button onClick={() => setPreviewingImage(delivery.photoUrl!)} className="focus:outline-none">
                         <Image
                           data-ai-hint="package delivery"
                           src={delivery.photoUrl}
                           alt="Foto da encomenda"
                           width={64}
                           height={48}
                           className="rounded-md object-cover hover:opacity-80 transition-opacity"
                         />
                       </button>
                    ) : (
                      <div className="w-16 h-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                        Sem foto
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={delivery.status === "ENTREGUE" ? "secondary" : "default"}>
                        {delivery.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {format(new Date(delivery.createdAt), "dd/MM/yy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(delivery)}>
                          Editar
                        </DropdownMenuItem>
                        {delivery.status === 'PENDENTE' && (
                          <DropdownMenuItem onClick={() => setUpdatingDelivery(delivery)}>
                            Marcar como Entregue
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-500 hover:!text-red-500"
                          onClick={() => setDeletingId(delivery.id)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhuma encomenda encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá excluir permanentemente a encomenda do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deletingId) onDelete(deletingId);
                setDeletingId(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!updatingDelivery} onOpenChange={(open) => !open && setUpdatingDelivery(null)}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Confirmar Entrega</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                  <label htmlFor="pickup-name" className="text-sm font-medium">Nome de quem está retirando</label>
                  <Input 
                      id="pickup-name"
                      value={pickupByName}
                      onChange={(e) => setPickupByName(e.target.value)}
                      placeholder="Digite o nome completo"
                  />
              </div>
              <DialogFooter>
                  <Button variant="secondary" onClick={() => setUpdatingDelivery(null)}>Cancelar</Button>
                  <Button onClick={handleUpdateStatus} disabled={!pickupByName}>Confirmar</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      
      <Dialog open={!!previewingImage} onOpenChange={(open) => !open && setPreviewingImage(null)}>
        <DialogContent className="max-w-3xl">
          <Image src={previewingImage || ''} alt="Foto da encomenda" width={800} height={600} className="rounded-md object-contain" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
