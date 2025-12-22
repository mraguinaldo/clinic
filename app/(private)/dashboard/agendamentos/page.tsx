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
import { MoreHorizontal, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { Funcionario } from "../funcionarios/interface";
import { Paciente } from "../pacientes/interface";

interface Agendamento {
  id: number;
  motivo: string;
  data_consulta: string | null;
  modelo: "presencial" | "online";
  profisional: number; // ID do médico
  paciente: number; // ID do paciente
}

export interface Profissional {
  id: number;
  funcionario: Funcionario;
}

export default function AgendamentosList() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Agendamento | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  // Buscar agendamentos
  const { data: agendamentosRaw = [], isLoading: loadingAgendamentos } =
    useQuery<Agendamento[]>({
      queryKey: ["agendamentos"],
      queryFn: async () => {
        const res = await api.get("/agendamentos/");
        return res.data;
      },
    });

  // Buscar médicos
  const { data: medicos = [], isLoading: loadingMedicos } = useQuery<
    Profissional[]
  >({
    queryKey: ["medicos"],
    queryFn: async () => {
      const res = await api.get("/medicos/");
      return res.data;
    },
  });

  // Buscar pacientes
  const { data: pacientes = [], isLoading: loadingPacientes } = useQuery<
    Paciente[]
  >({
    queryKey: ["pacientes"],
    queryFn: async () => {
      const res = await api.get("/pacientes/");
      return res.data;
    },
  });

  // Mutation de atualizar
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Record<string, any>;
    }) => api.patch(`/agendamentos/${id}/`, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] }),
  });

  // Mutation de deletar
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/agendamentos/${id}/`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] }),
  });

  if (loadingAgendamentos || loadingMedicos || loadingPacientes)
    return <p>Carregando...</p>;

  // Mapear agendamentos para incluir médico e paciente completos
  const agendamentos = agendamentosRaw.map((ag) => {
    const medico = medicos.find((m) => m.id === ag.profisional);
    const paciente = pacientes.find((p) => p.id === ag.paciente);

    return {
      ...ag,
      profissional: medico || {
        funcionario: { usuario: { nome: "—", email: "—" } },
        id: 0,
      },
      paciente: paciente || { usuario: { nome: "—", email: "—" }, id: 0 },
    };
  });

  const modeloOptions = ["presencial", "online"];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Agendamentos</h2>
        <Link
          href="/dashboard/agendamentos/criar"
          className="flex items-center gap-2 text-white bg-gray-950 rounded-[12px] py-2 px-4 w-fit"
        >
          <Plus size={18} />
          Cadastrar Agendamento
        </Link>
      </div>

      <ScrollArea className="h-[520px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Motivo</TableHead>
              <TableHead>Data Consulta</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Profissional</TableHead>
              <TableHead>Email Profissional</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Email Paciente</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {agendamentos.map((agendamento) => (
              <TableRow key={agendamento.id}>
                <TableCell>
                  <input
                    defaultValue={agendamento.motivo}
                    className="border rounded-md px-2 py-1 w-full"
                    onBlur={(e) => {
                      if (e.target.value !== agendamento.motivo) {
                        updateMutation.mutate({
                          id: agendamento.id,
                          data: { motivo: e.target.value },
                        });
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{agendamento.data_consulta || "—"}</TableCell>
                <TableCell>
                  <select
                    value={agendamento.modelo}
                    onChange={(e) =>
                      updateMutation.mutate({
                        id: agendamento.id,
                        data: { modelo: e.target.value },
                      })
                    }
                    className="border rounded-md px-2 py-1"
                  >
                    {modeloOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </TableCell>

                <TableCell>
                  {agendamento.profissional.funcionario.usuario.nome}{" "}
                  {agendamento.profissional.funcionario.usuario.nome}
                </TableCell>
                <TableCell>
                  {agendamento.profissional.funcionario.usuario.email}
                </TableCell>
                <TableCell>{agendamento.paciente.usuario.nome}</TableCell>
                <TableCell>{agendamento.paciente.usuario.email}</TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelected(agendamento as any);
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
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {openDelete && selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Confirmar exclusão?</h3>
            <p>Tem certeza que deseja excluir este agendamento?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpenDelete(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteMutation.mutate(selected.id);
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
