/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/service/data";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Eye, Trash2, Plus } from "lucide-react";
import Link from "next/link";

import { ConsultaDetailsModal } from "@/components/consultation/modals/details-consulta";
import { Consulta, Agendamento, Usuario } from "../consultas/page";
import { useUserDataStore } from "@/store/use-user-data-store";

export interface Prescricao {
  id: number;
  medicamento: string;
  dosagem: string;
  frequencia: string;
  duracao: string;
  observacao: string;
  data_prescricao: string;
  consulta: number;
}

export default function PrescricoesList() {
  const { user } = useUserDataStore();
  const queryClient = useQueryClient();
  const [selectedPrescricao, setSelectedPrescricao] =
    useState<Prescricao | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<Prescricao | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  // ---------------- Queries ----------------
  const { data: prescricoes = [], isLoading } = useQuery<Prescricao[]>({
    queryKey: ["prescricoes"],
    queryFn: async () => (await api.get("/prescricoes/")).data,
  });

  const { data: consultas = [] } = useQuery<Consulta[]>({
    queryKey: ["consultas"],
    queryFn: async () => (await api.get("/consultas/")).data,
  });

  const { data: agendamentos = [] } = useQuery<Agendamento[]>({
    queryKey: ["agendamentos"],
    queryFn: async () => (await api.get("/agendamentos/")).data,
  });

  const { data: medicos = [] } = useQuery({
    queryKey: ["medicos"],
    queryFn: async () => (await api.get("/medicos/")).data,
  });

  const { data: pacientes = [] } = useQuery({
    queryKey: ["pacientes"],
    queryFn: async () => (await api.get("/pacientes/")).data,
  });

  // ---------------- Maps ----------------
  const agendamentoMap: Record<number, Agendamento> = {};
  agendamentos?.forEach((a) => (agendamentoMap[a.id] = a));

  const medicoMap: Record<number, Usuario> = {};
  medicos?.forEach((m: any) => (medicoMap[m.id] = m.funcionario.usuario));

  const pacienteMap: Record<number, Usuario> = {};
  pacientes?.forEach((p: any) => (pacienteMap[p.id] = p.usuario));

  const consultaMap: Record<number, Consulta> = {};
  consultas?.forEach((c) => (consultaMap[c.id] = c));

  // ---------------- Mutations ----------------
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Prescricao>;
    }) => api.patch(`/prescricoes/${id}/`, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["prescricoes"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/prescricoes/${id}/`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["prescricoes"] }),
  });

  if (isLoading) return <p>Carregando prescrições...</p>;

  const prescricoesFiltradas = prescricoes.filter((p) => {
    const consulta = consultaMap[p.consulta];
    const agendamento = consulta ? agendamentoMap[consulta.agendamento] : null;
    if (!agendamento) return false;

    if (user?.tipo === "paciente") {
      return agendamento.paciente === user.id;
    }

    return true;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Prescrições</h2>
        {user?.tipo !== "paciente" && (
          <Link href="/dashboard/prescricoes/criar">
            <Button className="flex gap-2">
              <Plus size={16} />
              Nova Prescrição
            </Button>
          </Link>
        )}
      </div>

      <ScrollArea className="h-[520px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicamento</TableHead>
              <TableHead>Dosagem</TableHead>
              <TableHead>Frequência</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead>Consulta</TableHead>
              <TableHead className="text-right">Médico / Paciente</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {prescricoesFiltradas.map((p) => {
              const consulta = consultaMap[p.consulta];
              const agendamento = consulta
                ? agendamentoMap[consulta?.agendamento?.id]
                : null;
              const medico = agendamento?.doutor
                ? medicoMap[agendamento?.doutor?.funcionario?.usuario?.id]
                : null;
              const paciente = agendamento?.paciente
                ? pacienteMap[agendamento?.paciente?.id]
                : null;

              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <input
                      disabled={user?.tipo === "paciente"}
                      defaultValue={p.medicamento}
                      className="border rounded-md px-2 py-1 w-full"
                      onBlur={(e) =>
                        e.target.value !== p.medicamento &&
                        updateMutation.mutate({
                          id: p.id,
                          data: { medicamento: e.target.value },
                        })
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <input
                      disabled={user?.tipo === "paciente"}
                      defaultValue={p.dosagem}
                      className="border rounded-md px-2 py-1 w-full"
                      onBlur={(e) =>
                        e.target.value !== p.dosagem &&
                        updateMutation.mutate({
                          id: p.id,
                          data: { dosagem: e.target.value },
                        })
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <input
                      disabled={user?.tipo === "paciente"}
                      defaultValue={p.frequencia}
                      className="border rounded-md px-2 py-1 w-full"
                      onBlur={(e) =>
                        e.target.value !== p.frequencia &&
                        updateMutation.mutate({
                          id: p.id,
                          data: { frequencia: e.target.value },
                        })
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <input
                      disabled={user?.tipo === "paciente"}
                      defaultValue={p.duracao}
                      className="border rounded-md px-2 py-1 w-full"
                      onBlur={(e) =>
                        e.target.value !== p.duracao &&
                        updateMutation.mutate({
                          id: p.id,
                          data: { duracao: e.target.value },
                        })
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <input
                      disabled={user?.tipo === "paciente"}
                      defaultValue={p.observacao}
                      className="border rounded-md px-2 py-1 w-full"
                      onBlur={(e) =>
                        e.target.value !== p.observacao &&
                        updateMutation.mutate({
                          id: p.id,
                          data: { observacao: e.target.value },
                        })
                      }
                    />
                  </TableCell>

                  <TableCell>#{p.consulta}</TableCell>

                  <TableCell className="text-right">
                    {medico && paciente ? (
                      <div className="text-sm space-y-1">
                        <div>
                          <strong>Médico:</strong> {medico.nome} ({medico.email}
                          )
                        </div>
                        <div>
                          <strong>Paciente:</strong> {paciente.nome} (
                          {paciente.email})
                        </div>
                      </div>
                    ) : (
                      <span>Carregando...</span>
                    )}
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
                            setSelectedPrescricao(p);
                            setOpenDetails(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>

                        {user?.tipo !== "paciente" && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedDelete(p);
                              setOpenDelete(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Modal de detalhes */}
      {openDetails && selectedPrescricao && (
        <ConsultaDetailsModal
          consulta={consultaMap[selectedPrescricao.consulta] as Consulta}
          open={openDetails}
          setOpen={setOpenDetails}
        />
      )}

      {/* Modal de exclusão */}
      {openDelete && selectedDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-md w-[400px]">
            <h3 className="text-lg font-semibold mb-3">Excluir prescrição</h3>
            <p>Tem certeza que deseja excluir esta prescrição?</p>

            <div className="flex justify-end gap-2 mt-5">
              <Button variant="outline" onClick={() => setOpenDelete(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteMutation.mutate(selectedDelete.id);
                  setOpenDelete(false);
                }}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
