/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/service/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { Medico } from "./interface";
import { MedicoDetailsModal } from "@/components/doctors-list/modals/details-medico";
import { EditMedicoModal } from "@/components/doctors-list/modals/edit-medico";
import { DeleteMedicoModal } from "@/components/doctors-list/modals/delete-medico";
import { EditUserModal } from "@/components/user-list/modals/edit";
import { Usuario } from "@/components/user-list";

export default function MedicosList() {
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<Medico | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);

  const { data: users } = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const res = await api.get("/usuarios/");
      return res.data;
    },
  });

  const { data: medicos = [], isLoading } = useQuery<Medico[]>({
    queryKey: ["medicos"],
    queryFn: async () => {
      const res = await api.get("/medicos/");
      return res.data;
    },
  });

  const updateFieldMutation = useMutation({
    mutationFn: async ({
      id,
      field,
      value,
    }: {
      id: number;
      field: string;
      value: string;
    }) => api.patch(`/medicos/${id}/`, { [field]: value }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["medicos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/medicos/${id}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["medicos"] }),
  });

  const especialidadeOptions = [
    "Cardiologia",
    "Dermatologia",
    "Pediatria",
    "Ginecologia",
    "Ortopedia",
    "Neurologia",
    "Oftalmologia",
    "Psiquiatria",
  ];

  if (isLoading) return <p>Carregando médicos...</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Médicos</h2>
        <Link
          href="/dashboard/medicos/criar"
          className="flex items-center gap-2 text-white bg-gray-950 rounded-[12px] py-2 px-4 w-fit"
        >
          <UserPlus size={18} />
          Cadastrar Médico
        </Link>
      </div>

      <ScrollArea className="h-[520px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Médico</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Nº Ordem Médicos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {medicos.map((med) => (
              <TableRow key={med?.usuario?.id}>
                <TableCell className="flex items-center gap-3">
                  {med?.usuario?.img ? (
                    <img
                      src={med?.usuario?.img}
                      className="h-10 w-10 rounded-full"
                      alt={med.usuario.nome}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-100" />
                  )}
                  <div>
                    <div className="font-medium">
                      {med?.usuario?.nome} {med?.usuario?.sobrenome}
                    </div>
                  </div>
                </TableCell>

                <TableCell>{med?.usuario?.email}</TableCell>

                <TableCell>
                  <select
                    value={med?.especialidade}
                    onChange={(e) =>
                      updateFieldMutation.mutate({
                        id: med?.usuario?.id,
                        field: "especialidade",
                        value: e.target.value,
                      })
                    }
                    className="border rounded-md px-2 py-1"
                  >
                    {especialidadeOptions.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </TableCell>

                <TableCell>
                  <input
                    type="text"
                    value={med.num_ordem_medicos}
                    onChange={(e) =>
                      updateFieldMutation.mutate({
                        id: med?.usuario?.id,
                        field: "num_ordem_medicos",
                        value: e.target.value,
                      })
                    }
                    className="border rounded-md px-2 py-1 w-40"
                  />
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelected(med);
                          setOpenDetails(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setSelected(med);
                          setOpenEditUser(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar perfil do usuário
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setSelected(med);
                          setOpenEdit(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar dados do médico
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelected(med);
                          setOpenDelete(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <MedicoDetailsModal
        medico={selected}
        open={openDetails}
        setOpen={setOpenDetails}
      />

      <EditMedicoModal
        medico={selected}
        open={openEdit}
        setOpen={setOpenEdit}
      />

      <EditUserModal
        user={
          users?.find((currentUser) => {
            if (!selected?.usuario) return false;
            const userId = parseInt(
              selected?.usuario?.split("/").filter(Boolean).pop()!
            );
            return currentUser.id === userId;
          }) as Usuario
        }
        open={openEditUser}
        setOpen={setOpenEditUser}
      />

      <DeleteMedicoModal
        open={openDelete}
        medico={selected}
        onConfirm={() => {
          if (selected) deleteMutation.mutate(selected.id);
          setOpenDelete(false);
        }}
        onClose={() => setOpenDelete(false)}
      />
    </>
  );
}
