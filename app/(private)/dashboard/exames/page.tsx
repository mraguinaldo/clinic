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
import { Agendamento, Consulta, Usuario } from "../consultas/page";
import ExameDetailsModal from "@/components/exames/modals/details-exame";

export interface Exame {
  id: number;
  nome_exame: string;
  descricao: string;
  status: "realizado" | "nao realizado";
  data_solicitacao: string;
  data_resultado: string;
  consulta: number;
}

export default function ExamesList() {
  const queryClient = useQueryClient();
  const [selectedExame, setSelectedExame] = useState<Exame | null>(null);
  const [openDetails, setOpenDetails] = useState(false);

  const [selectedDelete, setSelectedDelete] = useState<Exame | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  // ---------------- Queries ----------------
  const { data: exames = [], isLoading: loadingExames } = useQuery<Exame[]>({
    queryKey: ["exames"],
    queryFn: async () => {
      const res = await api.get("/exames/");
      return res.data;
    },
  });

  const { data: consultas = [] } = useQuery<Consulta[]>({
    queryKey: ["consultas"],
    queryFn: async () => {
      const res = await api.get("/consultas/");
      return res.data;
    },
  });

  const { data: agendamentos = [] } = useQuery<Agendamento[]>({
    queryKey: ["agendamentos"],
    queryFn: async () => {
      const res = await api.get("/agendamentos/");
      return res.data;
    },
  });

  const { data: medicos = [] } = useQuery({
    queryKey: ["medicos"],
    queryFn: async () => {
      const res = await api.get("/medicos/");
      return res.data;
    },
  });

  const { data: pacientes = [] } = useQuery({
    queryKey: ["pacientes"],
    queryFn: async () => {
      const res = await api.get("/pacientes/");
      return res.data;
    },
  });

  // ---------------- Maps ----------------
  const consultaMap: Record<number, Consulta> = {};
  consultas.forEach((c) => (consultaMap[c.id] = c));

  const agendamentoMap: Record<number, Agendamento> = {};
  agendamentos.forEach((a) => (agendamentoMap[a.id] = a));

  const medicoMap: Record<number, Usuario> = {};
  medicos.forEach((m: any) => {
    medicoMap[m.id] = m.funcionario.usuario;
  });

  const pacienteMap: Record<number, Usuario> = {};
  pacientes.forEach((p: any) => {
    pacienteMap[p.id] = p.usuario;
  });

  // ---------------- Mutations ----------------
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Exame> }) =>
      api.patch(`/exames/${id}/`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exames"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/exames/${id}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exames"] }),
  });

  if (loadingExames) return <p>Carregando exames...</p>;

  const statusOptions = ["realizado", "nao realizado"];

  // ---------------- Render ----------------
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Exames</h2>
        <Link href="/dashboard/exames/criar">
          <Button className="flex gap-2">
            <Plus size={16} />
            Novo Exame
          </Button>
        </Link>
      </div>

      <ScrollArea className="h-[520px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Exame</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Resultado</TableHead>
              <TableHead>Consulta</TableHead>
              <TableHead className="text-right">Médico / Paciente</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {exames.map((exame) => {
              const consulta = consultaMap[exame.consulta];
              const agendamento = consulta
                ? agendamentoMap[consulta.agendamento]
                : null;
              const medico = agendamento
                ? medicoMap[agendamento.profisional]
                : null;
              const paciente = agendamento
                ? pacienteMap[agendamento.paciente]
                : null;

              return (
                <TableRow key={exame.id}>
                  <TableCell>
                    <input
                      defaultValue={exame.nome_exame}
                      className="border rounded-md px-2 py-1 w-full"
                      onBlur={(e) => {
                        if (e.target.value !== exame.nome_exame) {
                          updateMutation.mutate({
                            id: exame.id,
                            data: { nome_exame: e.target.value },
                          });
                        }
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <input
                      defaultValue={exame.descricao}
                      className="border rounded-md px-2 py-1 w-full"
                      onBlur={(e) => {
                        if (e.target.value !== exame.descricao) {
                          updateMutation.mutate({
                            id: exame.id,
                            data: { descricao: e.target.value },
                          });
                        }
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <select
                      value={exame.status}
                      className="border rounded-md px-2 py-1"
                      onChange={(e) =>
                        updateMutation.mutate({
                          id: exame.id,
                          data: { status: e.target.value as any },
                        })
                      }
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </TableCell>

                  <TableCell>
                    <input
                      type="datetime-local"
                      value={exame.data_resultado.slice(0, 16)}
                      className="border rounded-md px-2 py-1"
                      onBlur={(e) =>
                        updateMutation.mutate({
                          id: exame.id,
                          data: { data_resultado: e.target.value },
                        })
                      }
                    />
                  </TableCell>

                  <TableCell>#{exame.consulta}</TableCell>

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
                            setSelectedExame(exame);
                            setOpenDetails(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedDelete(exame);
                            setOpenDelete(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      <ExameDetailsModal
        exame={selectedExame as Exame}
        open={openDetails}
        setOpen={setOpenDetails}
      />

      {openDelete && selectedDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-md w-[400px]">
            <h3 className="text-lg font-semibold mb-3">Excluir exame</h3>
            <p>Tem certeza que deseja excluir este exame?</p>

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
