/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/service/data";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Agendamento, Consulta, Usuario } from "../../consultas/page";

export interface ExamePayload {
  nome_exame: string;
  descricao: string;
  status: "realizado" | "nao realizado";
  data_resultado: string;
  consulta: number;
}

export default function ExamesCreate() {
  const router = useRouter();

  const [form, setForm] = useState<ExamePayload>({
    nome_exame: "",
    descricao: "",
    status: "nao realizado",
    data_resultado: "",
    consulta: 0,
  });

  const [consultaSelected, setConsultaSelected] = useState<Consulta | null>(
    null
  );
  const [consultaSearch, setConsultaSearch] = useState("");

  const [medico, setMedico] = useState<Usuario | null>(null);
  const [paciente, setPaciente] = useState<Usuario | null>(null);

  // ---------------- Queries ----------------
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
  const medicoMap: Record<number, Usuario> = {};
  medicos?.forEach((m: any) => (medicoMap[m.id] = m.funcionario.usuario));

  const pacienteMap: Record<number, Usuario> = {};
  pacientes?.forEach((p: any) => (pacienteMap[p.id] = p.usuario));

  const agendamentoMap: Record<number, Agendamento> = {};
  agendamentos?.forEach((a) => (agendamentoMap[a.id] = a));

  // ---------------- Effect: Seleção da consulta ----------------
  useEffect(() => {
    if (!consultaSelected) return;

    setForm((prev) => ({
      ...prev,
      consulta: consultaSelected.id,
      data_resultado: consultaSelected.data_consulta || "",
    }));

    const agendamento = agendamentoMap[consultaSelected.agendamento];
    if (agendamento) {
      setMedico(
        agendamento.profisional ? medicoMap[agendamento.profisional] : null
      );
      setPaciente(
        agendamento.paciente ? pacienteMap[agendamento.paciente] : null
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultaSelected]);

  // ---------------- Mutation ----------------
  const createMutation = useMutation({
    mutationFn: async (data: ExamePayload) => api.post("/exames/", data),
    onSuccess: () => router.push("/dashboard/exames"),
  });

  const handleSubmit = () => {
    if (!form.nome_exame || !form.descricao || !form.consulta) return;
    createMutation.mutate(form);
  };

  // ---------------- Render ----------------
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Novo Exame</h2>

      {/* Nome do exame */}
      <input
        type="text"
        placeholder="Nome do exame"
        value={form.nome_exame}
        className="border rounded-md px-2 py-1 w-full"
        onChange={(e) => setForm({ ...form, nome_exame: e.target.value })}
      />

      {/* Descrição */}
      <Textarea
        placeholder="Descrição do exame"
        value={form.descricao}
        maxLength={500}
        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
      />

      {/* Status */}
      <select
        value={form.status}
        className="border rounded-md px-2 py-1 w-full"
        onChange={(e) =>
          setForm({ ...form, status: e.target.value as ExamePayload["status"] })
        }
      >
        <option value="realizado">Realizado</option>
        <option value="nao realizado">Não realizado</option>
      </select>

      {/* Data do resultado */}
      <input
        type="datetime-local"
        value={form.data_resultado}
        className="border rounded-md px-2 py-1 w-full"
        onChange={(e) => setForm({ ...form, data_resultado: e.target.value })}
      />

      {/* Select pesquisável de consulta */}
      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-full text-left">
            {consultaSelected
              ? `Consulta #${consultaSelected.id} - ${consultaSelected.diagnostico}`
              : "Selecionar consulta"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Pesquisar consulta pelo ID"
              value={consultaSearch}
              onValueChange={setConsultaSearch}
            />
            <CommandList>
              <CommandEmpty>Nenhuma consulta encontrada</CommandEmpty>
              <CommandGroup>
                {consultas
                  .filter((c) => c.id.toString().includes(consultaSearch))
                  .map((c) => (
                    <CommandItem
                      key={c.id}
                      onSelect={() => {
                        setConsultaSelected(c);
                        setConsultaSearch("");
                      }}
                    >
                      #{c.id} - {c.diagnostico}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Exibir médico e paciente */}
      {(medico || paciente) && (
        <div className="p-4 border rounded-md space-y-2 bg-gray-50">
          {medico && (
            <>
              <div>
                <strong>Médico:</strong> {`${medico.nome} ${medico.sobrenome}`}
              </div>
              <div>
                <strong>Email:</strong> {medico.email}
              </div>
              <div>
                <strong>Telefone:</strong> {medico.telefone}
              </div>
            </>
          )}
          <hr className="my-2" />
          {paciente && (
            <>
              <div>
                <strong>Paciente:</strong>{" "}
                {`${paciente.nome} ${paciente.sobrenome}`}
              </div>
              <div>
                <strong>Email:</strong> {paciente.email}
              </div>
              <div>
                <strong>Telefone:</strong> {paciente.telefone}
              </div>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={createMutation.isPending || !consultaSelected}
        >
          {createMutation.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
