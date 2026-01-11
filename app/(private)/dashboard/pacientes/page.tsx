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
import { MoreHorizontal, Eye, Edit, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { ImageZoomr } from "@mraguinaldo/react-image-zoomr";

import { EditUserModal } from "@/components/user-list/modals/edit";
import { Paciente } from "./interface";
import { DeletePacienteModal } from "@/components/patients-list/modals/delete-paciente";
import { EditPacienteModal } from "@/components/patients-list/modals/edit-paciente";
import { PacienteDetailsModal } from "@/components/patients-list/modals/details-paciente";
import { TipoSanguineoSelect } from "@/components/tipo-sanguineo-select";
import { EditableInput } from "@/components/editable-input";
import { IUser, useUserDataStore } from "@/store/use-user-data-store";
import { AddHistoricoModal } from "@/components/patients-list/modals/add-historico";
import { useRouter } from "next/navigation";

export default function PacientesList() {
  const { user } = useUserDataStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selected, setSelected] = useState<Paciente | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [openAddHistorico, setOpenAddHistorico] = useState(false);
  const [openListHistoricos, setOpenListHistoricos] = useState(false);

  const { data: pacientes = [], isLoading } = useQuery<Paciente[]>({
    queryKey: ["pacientes"],
    queryFn: async () => {
      const res = await api.get("/pacientes/");
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
    }) => api.patch(`/pacientes/${id}/`, { [field]: value }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pacientes"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/pacientes/${id}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pacientes"] }),
  });

  const bloodTypes = ["A+", "A-", "B-", "AB+", "AB-", "O+", "O-"];

  const { data: historicos = [] } = useQuery({
    queryKey: ["historicos"],
    queryFn: async () => (await api.get("/historicos-medico/")).data,
  });

  const historicoPorPaciente = new Map<number, any>();
  historicos.forEach((h: any) => {
    historicoPorPaciente.set(h.paciente.id, h);
  });

  if (isLoading) return <p>Carregando pacientes...</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Pacientes</h2>
        {(user?.tipo === "admin" || user?.tipo === "recepcionista") && (
          <Link
            href="/dashboard/pacientes/criar"
            className="flex items-center gap-2 text-white bg-gray-950 rounded-[12px] py-2 px-4 w-fit"
          >
            <UserPlus size={18} />
            Cadastrar Paciente
          </Link>
        )}
      </div>

      <ScrollArea className="h-[520px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Código Médico</TableHead>
              <TableHead>Tipo Sanguíneo</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Altura</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pacientes.map((pac) => (
              <TableRow key={pac.id}>
                <TableCell>
                  {pac.usuario ? (
                    <div className="flex items-center gap-3">
                      <ImageZoomr
                        src={pac.usuario?.img || ""}
                        height={40}
                        width={40}
                        borderRadius={100}
                        enableZoom={false}
                        alt="Paciente"
                      />
                      <div className="font-medium">
                        {pac.usuario.nome} {pac.usuario.sobrenome}
                      </div>
                    </div>
                  ) : (
                    <div className="font-medium">{pac.usuario}</div>
                  )}
                </TableCell>

                <TableCell>{pac.cod_medico}</TableCell>

                <TableCell>
                  <TipoSanguineoSelect
                    paciente={pac}
                    bloodTypes={bloodTypes}
                    onUpdate={(field, value) =>
                      updateFieldMutation.mutate({ id: pac.id, field, value })
                    }
                  />
                </TableCell>

                <TableCell>
                  <EditableInput
                    value={pac.peso}
                    onSave={(val) =>
                      updateFieldMutation.mutate({
                        id: pac.id,
                        field: "peso",
                        value: val,
                      })
                    }
                  />
                </TableCell>

                <TableCell>
                  <EditableInput
                    value={pac.altura}
                    onSave={(val) =>
                      updateFieldMutation.mutate({
                        id: pac.id,
                        field: "altura",
                        value: val,
                      })
                    }
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
                          setSelected(pac);
                          setOpenDetails(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      {!historicoPorPaciente.has(pac.id) &&
                        user?.tipo === "medico" && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(pac);
                              setOpenAddHistorico(true);
                            }}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Adicionar Histórico
                          </DropdownMenuItem>
                        )}

                      {historicoPorPaciente.has(pac.id) && (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/historico-medico?pacienteId=${pac.id}`
                              )
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Histórico
                          </DropdownMenuItem>

                          {user?.tipo === "medico" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelected(pac);
                                setOpenAddHistorico(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Atualizar Histórico
                            </DropdownMenuItem>
                          )}
                        </>
                      )}

                      {user?.tipo === "admin" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(pac);
                              setOpenEditUser(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar perfil do usuário
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(pac);
                              setOpenEdit(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar dados do paciente
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelected(pac);
                              setOpenDelete(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <PacienteDetailsModal
        paciente={selected}
        open={openDetails}
        setOpen={setOpenDetails}
      />

      <EditPacienteModal
        paciente={selected}
        open={openEdit}
        setOpen={setOpenEdit}
      />

      <EditUserModal
        user={selected?.usuario as unknown as IUser}
        open={openEditUser}
        setOpen={setOpenEditUser}
      />

      <AddHistoricoModal
        pacienteId={selected?.id || null}
        open={openAddHistorico}
        setOpen={setOpenAddHistorico}
      />

      <DeletePacienteModal
        open={openDelete}
        paciente={selected}
        onConfirm={() => {
          if (selected) deleteMutation.mutate(selected.id);
          setOpenDelete(false);
        }}
        onClose={() => setOpenDelete(false)}
      />
    </>
  );
}
