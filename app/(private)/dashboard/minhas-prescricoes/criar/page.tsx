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

export interface PrescricaoPayload {
  medicamento: string;
  dosagem: string;
  frequencia: string;
  duracao: string;
  observacao: string;
  consulta: number;
}

export default function PrescricoesCreate() {
  const router = useRouter();

  const [form, setForm] = useState<PrescricaoPayload>({
    medicamento: "",
    dosagem: "",
    frequencia: "",
    duracao: "",
    observacao: "",
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
    mutationFn: async (data: PrescricaoPayload) =>
      api.post("/prescricoes/", data),
    onSuccess: () => router.push("/dashboard/prescricoes"),
  });

  const handleSubmit = () => {
    if (
      !form.medicamento ||
      !form.dosagem ||
      !form.frequencia ||
      !form.duracao ||
      !form.observacao ||
      !form.consulta
    )
      return;

    createMutation.mutate(form);
  };

  // ---------------- Render ----------------
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Nova Prescrição</h2>

      <input
        type="text"
        placeholder="Medicamento"
        value={form.medicamento}
        className="border rounded-md px-2 py-1 w-full"
        onChange={(e) => setForm({ ...form, medicamento: e.target.value })}
      />

      <input
        type="text"
        placeholder="Dosagem"
        value={form.dosagem}
        className="border rounded-md px-2 py-1 w-full"
        onChange={(e) => setForm({ ...form, dosagem: e.target.value })}
      />

      <input
        type="text"
        placeholder="Frequência"
        value={form.frequencia}
        className="border rounded-md px-2 py-1 w-full"
        onChange={(e) => setForm({ ...form, frequencia: e.target.value })}
      />

      <input
        type="text"
        placeholder="Duração"
        value={form.duracao}
        className="border rounded-md px-2 py-1 w-full"
        onChange={(e) => setForm({ ...form, duracao: e.target.value })}
      />

      <Textarea
        placeholder="Observação"
        value={form.observacao}
        maxLength={500}
        onChange={(e) => setForm({ ...form, observacao: e.target.value })}
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
