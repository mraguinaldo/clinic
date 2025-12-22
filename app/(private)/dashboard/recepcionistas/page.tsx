/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { MoreHorizontal, Edit, Trash2, UserPlus } from "lucide-react";
import { ImageZoomr } from "@mraguinaldo/react-image-zoomr";
import Link from "next/link";
import { EditUserModal } from "@/components/user-list/modals/edit";
import { Usuario } from "@/components/user-list";
import { Recepcionista } from "./criar/interface";
import { DeleteRecepcionistaModal } from "@/components/receptionist-list/modals/delete-recepcionista";

export default function RecepcionistasList() {
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<Recepcionista | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);

  const { data: users } = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const res = await api.get("/usuarios/");
      return res.data;
    },
  });

  const { data: recepcionistas = [], isLoading } = useQuery<Recepcionista[]>({
    queryKey: ["recepcionistas"],
    queryFn: async () => {
      const res = await api.get("/recepcionistas/");
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
    }) => api.patch(`/recepcionistas/${id}/`, { [field]: value }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["recepcionistas"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/recepcionistas/${id}/`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["recepcionistas"] }),
  });

  const postoOptions = ["principal", "emergencia", "exames", "internamento"];

  if (isLoading) return <p>Carregando recepcionistas...</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recepcionistas</h2>
        <Link
          href="/dashboard/recepcionistas/criar"
          className="flex items-center gap-2 text-white bg-gray-950 rounded-[12px] py-2 px-4 w-fit"
        >
          <UserPlus size={18} />
          Cadastrar Recepcionista
        </Link>
      </div>

      <ScrollArea className="h-[520px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Posto Atendimento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {recepcionistas.map((recepcionista) => (
              <TableRow key={recepcionista?.funcionario?.id}>
                <TableCell className="flex items-center gap-3">
                  <ImageZoomr
                    src={recepcionista?.funcionario?.usuario?.img as string}
                    height={40}
                    width={40}
                    borderRadius={100}
                    enableZoom={false}
                    alt={recepcionista?.funcionario?.usuario?.nome}
                  />

                  <div>
                    <div className="font-medium">
                      {recepcionista?.funcionario?.usuario?.nome}{" "}
                      {recepcionista?.funcionario?.usuario?.sobrenome}
                    </div>
                    <div className="text-xs text-gray-500">
                      NIF: {recepcionista?.funcionario?.nif}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {recepcionista?.funcionario?.usuario?.email}
                </TableCell>

                <TableCell>
                  <select
                    value={recepcionista?.posto_atendimento || "principal"}
                    onChange={(e) =>
                      updateFieldMutation.mutate({
                        id: recepcionista?.id as any,
                        field: "posto_atendimento",
                        value: e.target.value,
                      })
                    }
                    className="border rounded-md px-2 py-1"
                  >
                    {postoOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
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
                          setSelected(recepcionista);
                          setOpenEditUser(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar perfil do usuário
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelected(recepcionista);
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

      <EditUserModal
        user={
          users?.find(
            (u) => u.id === selected?.funcionario.usuario.id
          ) as Usuario
        }
        open={openEditUser}
        setOpen={setOpenEditUser}
      />

      <DeleteRecepcionistaModal
        open={openDelete}
        recepcionista={selected as Recepcionista}
        onConfirm={() => {
          if (selected) deleteMutation.mutate(selected.id as any);
          setOpenDelete(false);
        }}
        onClose={() => setOpenDelete(false)}
      />
    </>
  );
}
