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
import { ImageZoomr } from "@mraguinaldo/react-image-zoomr";
import Link from "next/link";
import { Funcionario } from "./interface";
import { FuncionarioDetailsModal } from "@/components/employees-list/modals/details-funcionario";
import { EditFuncionarioModal } from "@/components/employees-list/modals/edit-funcionario";
import { DeleteFuncionarioModal } from "@/components/employees-list/modals/delete-funcionario";
import { EditUserModal } from "@/components/user-list/modals/edit";
import { Usuario } from "@/components/user-list";

export default function RecepcionistasList() {
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<Funcionario | null>(null);
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

  const { data: funcionarios = [], isLoading } = useQuery<Funcionario[]>({
    queryKey: ["funcionarios", "recepcionistas"],
    queryFn: async () => {
      const res = await api.get("/funcionarios/");
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
    }) => api.patch(`/funcionarios/${id}/`, { [field]: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["funcionarios", "recepcionistas"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/funcionarios/${id}/`),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["funcionarios", "recepcionistas"],
      }),
  });

  const cargoOptions = [
    "administrativo",
    "enfermeiro",
    "farmaceutico",
    "gestor",
    "medico",
    "recepcionista",
    "tecnico",
  ];
  const turnoOptions = ["manhã", "tarde", "noite", "rotativo"];
  const departamentoOptions = [
    "recepcao",
    "cardiologia",
    "farmacia",
    "laboratorio",
  ];

  if (isLoading) return <p>Carregando recepcionistas...</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Funcionários</h2>
        <Link
          href="/dashboard/funcionarios/criar"
          className="flex items-center gap-2 text-white bg-gray-950 rounded-[12px] py-2 px-4 w-fit"
        >
          <UserPlus size={18} />
          Cadastrar Funcionário
        </Link>
      </div>

      <ScrollArea className="h-[520px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Admissão</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {funcionarios.map((func) => (
              <TableRow key={func.id}>
                <TableCell className="flex items-center gap-3">
                  {func.usuario.img ? (
                    <ImageZoomr
                      src={func.usuario.img}
                      height={40}
                      width={40}
                      borderRadius={100}
                      enableZoom={false}
                      alt={func.usuario.nome}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-100" />
                  )}

                  <div>
                    <div className="font-medium">
                      {func.usuario.nome} {func.usuario.sobrenome}
                    </div>
                    <div className="text-xs text-gray-500">NIF: {func.nif}</div>
                  </div>
                </TableCell>

                <TableCell>{func.usuario.email}</TableCell>

                <TableCell className="capitalize">
                  <select
                    value={func.cargo}
                    onChange={(e) =>
                      updateFieldMutation.mutate({
                        id: func.id,
                        field: "cargo",
                        value: e.target.value,
                      })
                    }
                    className="border rounded-md px-2 py-1"
                  >
                    {cargoOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </TableCell>

                <TableCell className="capitalize">
                  <select
                    value={func.departamento}
                    onChange={(e) =>
                      updateFieldMutation.mutate({
                        id: func.id,
                        field: "departamento",
                        value: e.target.value,
                      })
                    }
                    className="border rounded-md px-2 py-1"
                  >
                    {departamentoOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </TableCell>

                <TableCell className="capitalize">
                  <select
                    value={func.turno}
                    onChange={(e) =>
                      updateFieldMutation.mutate({
                        id: func.id,
                        field: "turno",
                        value: e.target.value,
                      })
                    }
                    className="border rounded-md px-2 py-1"
                  >
                    {turnoOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </TableCell>

                <TableCell>{func.data_admissao}</TableCell>

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
                          setSelected(func);
                          setOpenDetails(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setSelected(func);
                          setOpenEditUser(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar perfil do usuário
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setSelected(func);
                          setOpenEdit(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar dados do funcionário
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelected(func);
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

      <FuncionarioDetailsModal
        funcionario={selected}
        open={openDetails}
        setOpen={setOpenDetails}
      />

      <EditFuncionarioModal
        funcionario={selected}
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

      <DeleteFuncionarioModal
        open={openDelete}
        funcionario={selected}
        onConfirm={() => {
          if (selected) deleteMutation.mutate(selected.id);
          setOpenDelete(false);
        }}
        onClose={() => setOpenDelete(false)}
      />
    </>
  );
}
