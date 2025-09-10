
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BLOCKS, type Delivery, type Resident } from "@/lib/types";
import { useRef, useState, useEffect } from "react";
import { Camera, Upload, X, Check, ChevronsUpDown, UserPlus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const deliverySchema = z.object({
  residentName: z.string().min(1, "Nome do morador é obrigatório."),
  apartment: z.string().min(1, "Apartamento é obrigatório."),
  block: z.enum(BLOCKS, { required_error: "Bloco é obrigatório." }),
  description: z.string().min(1, "Descrição é obrigatória."),
});

type DeliveryFormData = z.infer<typeof deliverySchema>;

type DeliveryDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: DeliveryFormData, photo?: File) => void;
  initialData?: Delivery | null;
  residents: Resident[];
  onAddResident: (name: string) => Resident;
};

export function DeliveryDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  residents,
  onAddResident,
}: DeliveryDialogProps) {
  const form = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
  });
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (initialData) {
      form.reset({
        residentName: initialData.residentName,
        apartment: initialData.apartment,
        block: initialData.block,
        description: initialData.description,
      });
      setPhotoPreview(initialData.photoUrl || null);
      setPhotoFile(null);
    } else {
      form.reset({ residentName: "", apartment: "", block: undefined, description: "" });
      setPhotoPreview(null);
      setPhotoFile(null);
    }
    setSearchQuery("");
  }, [initialData, isOpen, form]);

  const handleFormSubmit = (data: DeliveryFormData) => {
    onSubmit(data, photoFile || undefined);
    onOpenChange(false);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };
  
  const triggerPhotoInput = (capture: boolean) => {
    if (photoInputRef.current) {
        if(capture) {
            photoInputRef.current.setAttribute('capture', 'user');
        } else {
            photoInputRef.current.removeAttribute('capture');
        }
        photoInputRef.current.click();
    }
  };

  const handleAddNewResident = (name: string) => {
    const newResident = onAddResident(name);
    if(newResident) {
      form.setValue("residentName", newResident.name);
      form.setValue("apartment", newResident.apartment);
      form.setValue("block", newResident.block);
    }
    setPopoverOpen(false);
    setSearchQuery("");
  }

  const filteredResidents = searchQuery
    ? residents.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : residents;

  return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Editar Encomenda" : "Adicionar Encomenda"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="residentName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Nome do Morador</FormLabel>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? residents.find(
                                  (r) => r.name === field.value
                                )?.name
                              : "Selecione o morador"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[440px] p-0">
                        <Command>
                           <CommandInput 
                              placeholder="Procurar morador..." 
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                           />
                          <CommandList>
                            <CommandEmpty>
                              {searchQuery ? (
                                <div
                                  onClick={() => handleAddNewResident(searchQuery)}
                                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50"
                                >
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Cadastrar "{searchQuery}"
                                </div>
                              ) : "Nenhum morador encontrado."}
                            </CommandEmpty>
                            <CommandGroup>
                              {filteredResidents.map((resident) => (
                                <CommandItem
                                  value={resident.name}
                                  key={resident.id}
                                  onSelect={() => {
                                    form.setValue("residentName", resident.name);
                                    form.setValue("apartment", resident.apartment);
                                    form.setValue("block", resident.block);
                                    setPopoverOpen(false);
                                    setSearchQuery("");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      resident.name === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {resident.name} ({resident.apartment}/{resident.block})
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apartamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="block"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bloco</FormLabel>
                       <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BLOCKS.map((block) => (
                            <SelectItem key={block} value={block}>
                              Bloco {block}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Caixa da Amazon, tamanho médio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Foto</FormLabel>
                <div className="flex items-center gap-2">
                   <Button type="button" variant="outline" onClick={() => triggerPhotoInput(false)}>
                      <Upload className="mr-2 h-4 w-4" /> Fazer Upload
                  </Button>
                  <Button type="button" variant="outline" onClick={() => triggerPhotoInput(true)}>
                      <Camera className="mr-2 h-4 w-4" /> Tirar Foto
                  </Button>
                  <Input type="file" accept="image/*" ref={photoInputRef} onChange={handlePhotoChange} className="hidden" />
                </div>
                {photoPreview && (
                  <div className="mt-4 relative w-32 h-24">
                    <Image src={photoPreview} alt="Pré-visualização" layout="fill" objectFit="cover" className="rounded-md" />
                    <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => { setPhotoFile(null); setPhotoPreview(null)}}>
                      <X className="h-4 w-4"/>
                    </Button>
                  </div>
                )}
              </FormItem>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
}
