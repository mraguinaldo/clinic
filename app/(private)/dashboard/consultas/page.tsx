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
import { PaymentModal } from "@/components/payments/modals/add-payment";
import { useUserDataStore } from "@/store/use-user-data-store";

export interface Usuario {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
}

export interface Medico {
  id: number;
  funcionario: {
    id: number;
    usuario: Usuario;
    cargo: string;
    departamento: string;
  };
  especialidade: string;
}

export interface Paciente {
  id: number;
  usuario: Usuario;
  cod_medico: string;
  tipo_sanguineo: string;
  peso: string;
  altura: string;
}

export interface Agendamento {
  id: number;
  profisional: number;
  paciente: number;
  motivo: string;
  data_consulta: string | null;
}

export interface Consulta {
  id: number;
  diagnostico: string;
  status: string;
  data_consulta: string | null;
  data_criacao: string;
  agendamento: number;
}

export default function ConsultasList() {
  const { user } = useUserDataStore();
  const queryClient = useQueryClient();
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(
    null
  );
  const [openDetails, setOpenDetails] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  const [selectedDelete, setSelectedDelete] = useState<Consulta | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  // ---------------- Queries ----------------
  const { data: consultas = [], isLoading: loadingConsultas } = useQuery<
    Consulta[]
  >({
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

  const { data: medicos = [] } = useQuery<Medico[]>({
    queryKey: ["medicos"],
    queryFn: async () => {
      const res = await api.get("/medicos/");
      return res.data;
    },
  });

  const { data: pacientes = [] } = useQuery<Paciente[]>({
    queryKey: ["pacientes"],
    queryFn: async () => {
      const res = await api.get("/pacientes/");
      return res.data;
    },
  });

  // ---------------- Mapas ----------------
  const agendamentoMap: Record<number, Agendamento> = {};
  agendamentos.forEach((a) => (agendamentoMap[a.id] = a));

  const medicoMap: Record<number, Usuario> = {};
  medicos.forEach((m) => {
    medicoMap[m.id] = m.funcionario.usuario;
  });

  const pacienteMap: Record<number, Usuario> = {};
  pacientes.forEach((p) => {
    pacienteMap[p.id] = p.usuario;
  });

  // ---------------- Mutations ----------------
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Consulta> }) =>
      api.patch(`/consultas/${id}/`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultas"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/consultas/${id}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultas"] }),
  });

  if (loadingConsultas) return <p>Carregando consultas...</p>;

  const statusOptions = ["realizada", "pendente", "cancelada"];

  let consultasVisiveis = consultas;

  if (user?.tipo !== "admin" && user?.tipo !== "recepcionista") {
    const medicoLogado = medicos.find(
      (m) => m.funcionario.usuario.id === user?.id
    );

    if (medicoLogado) {
      consultasVisiveis = consultas.filter((c) => {
        const agendamento = agendamentoMap[c.agendamento?.id];
        return (
          agendamento?.doutor?.funcionario?.usuario?.id ===
          medicoLogado?.funcionario.usuario?.id
        );
      });
    } else {
      consultasVisiveis = [];
    }
  }

  // ---------------- Render ----------------
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Consultas</h2>
        {(user?.tipo === "admin" || user?.tipo === "recepcionista") && (
          <Link href="/dashboard/consultas/criar">
            <Button className="flex gap-2">
              <Plus size={16} />
              Nova Consulta
            </Button>
          </Link>
        )}
      </div>

      <ScrollArea className="h-[520px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Diagnóstico</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Consulta</TableHead>
              <TableHead>Agendamento</TableHead>
              <TableHead>Criada em</TableHead>
              <TableHead className="text-right">Médico / Paciente</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {consultasVisiveis.map((consulta) => {
              const agendamento = agendamentoMap[consulta?.agendamento?.id];
              const medico =
                medicoMap[agendamento?.doutor?.funcionario?.id ?? 0];
              const paciente = pacienteMap[agendamento?.paciente?.id ?? 0];
              return (
                <TableRow key={consulta.id}>
                  <TableCell>
                    <input
                      disabled={
                        user?.tipo !== "admin" && user?.tipo !== "recepcionista"
                      }
                      defaultValue={consulta.diagnostico}
                      className="border rounded-md px-2 py-1 w-full"
                      onBlur={(e) => {
                        if (e.target.value !== consulta.diagnostico) {
                          updateMutation.mutate({
                            id: consulta.id,
                            data: { diagnostico: e.target.value },
                          });
                        }
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <select
                      disabled={
                        user?.tipo !== "admin" && user?.tipo !== "recepcionista"
                      }
                      value={consulta.status}
                      className="border rounded-md px-2 py-1"
                      onChange={(e) =>
                        updateMutation.mutate({
                          id: consulta.id,
                          data: { status: e.target.value },
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

                  <TableCell>{consulta.data_consulta ?? "—"}</TableCell>

                  <TableCell>#{consulta?.agendamento?.data}</TableCell>

                  <TableCell>
                    {new Date(consulta.data_criacao).toLocaleDateString()}
                  </TableCell>

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
                            setSelectedConsulta(consulta);
                            setOpenDetails(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        {(user?.tipo === "admin" ||
                          user?.tipo === "recepcionista") && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedDelete(consulta);
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

      <ConsultaDetailsModal
        consulta={selectedConsulta as Consulta}
        open={openDetails}
        setOpen={setOpenDetails}
      />

      <PaymentModal
        open={openPayment}
        setOpen={setOpenPayment}
        consulta={selectedConsulta}
      />

      {openDelete && selectedDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-md w-[400px]">
            <h3 className="text-lg font-semibold mb-3">Excluir consulta</h3>
            <p>Tem certeza que deseja excluir esta consulta?</p>

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
