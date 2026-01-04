/* eslint-disable react-hooks/set-state-in-effect */
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
import { Funcionario } from "../../funcionarios/interface";

interface Usuario {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
}

interface ProfissionalPaciente {
  id: number;
  funcionario?: Funcionario;
  usuario: Usuario;
}

interface Agendamento {
  id: number;
  motivo: string;
  data_consulta: string | null;
  profisional: number; // só o ID
  paciente: number; // só o ID
}

interface ConsultaPayload {
  diagnostico: string;
  status: "realizada" | "pendente" | "cancelada";
  data_consulta: string | null;
  agendamento_id: number;
}

export default function ConsultasCreate() {
  const router = useRouter();

  const [form, setForm] = useState<ConsultaPayload>({
    diagnostico: "",
    status: "pendente",
    data_consulta: null,
    agendamento_id: 0,
  });

  const [agendamentoSelected, setAgendamentoSelected] =
    useState<Agendamento | null>(null);
  const [agendamentoSearch, setAgendamentoSearch] = useState("");

  const [profissional, setProfissional] = useState<ProfissionalPaciente | null>(
    null
  );
  const [paciente, setPaciente] = useState<ProfissionalPaciente | null>(null);

  /* =====================
    Queries
  ===================== */
  const { data: agendamentos = [], isLoading } = useQuery<Agendamento[]>({
    queryKey: ["agendamentos"],
    queryFn: async () => {
      const res = await api.get("/agendamentos/");
      return res.data;
    },
  });

  /* =====================
    Fetch profissional e paciente ao selecionar agendamento
  ===================== */
  useEffect(() => {
    if (!agendamentoSelected) return;

    setForm({
      ...form,
      agendamento_id: agendamentoSelected.id,
      data_consulta: agendamentoSelected.data_consulta,
    });

    api.get(`/medicos/${agendamentoSelected?.doutor.id}/`).then((res) => {
      setProfissional(res.data);
    });

    api.get(`/pacientes/${agendamentoSelected?.paciente?.id}/`).then((res) => {
      setPaciente(res.data);
    });
  }, [agendamentoSelected]);

  const createMutation = useMutation({
    mutationFn: async (data: ConsultaPayload) => api.post("/consultas/", data),
    onSuccess: () => router.push("/dashboard/consultas"),
  });

  const handleSubmit = () => {
    if (!form.diagnostico || !form.status || !agendamentoSelected) return;
    createMutation.mutate(form);
  };

  console.log(agendamentos);
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Nova Consulta</h2>

      <Textarea
        placeholder="Diagnóstico da consulta"
        value={form.diagnostico}
        maxLength={500}
        onChange={(e) => setForm({ ...form, diagnostico: e.target.value })}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-full text-left">
            {agendamentoSelected
              ? `Agendamento #${agendamentoSelected?.id} - ${agendamentoSelected?.paciente?.usuario?.nome}`
              : "Selecionar agendamento"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Pesquisar agendamento pelo ID ou motivo"
              value={agendamentoSearch}
              onValueChange={setAgendamentoSearch}
            />
            <CommandList>
              <CommandEmpty>Nenhum agendamento encontrado</CommandEmpty>
              <CommandGroup>
                {agendamentos
                  .filter(
                    (a) =>
                      a?.id?.toString()?.includes(agendamentoSearch) ||
                      a?.paciente?.usuario?.email
                        .toLowerCase()
                        .includes(agendamentoSearch.toLowerCase())
                  )
                  .map((ag) => (
                    <CommandItem
                      key={ag.id}
                      onSelect={() => {
                        setAgendamentoSelected(ag);
                        setAgendamentoSearch("");
                      }}
                    >
                      #{ag.id} - {ag.paciente?.usuario?.email}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {(profissional || paciente) && (
        <div className="p-4 border rounded-md space-y-2 bg-gray-50">
          {profissional && (
            <>
              <div>
                <strong>Médico:</strong>{" "}
                {`${profissional?.funcionario?.usuario?.nome} ${profissional?.funcionario?.usuario?.sobrenome}`}
              </div>
              <div>
                <strong>Email:</strong>{" "}
                {profissional?.funcionario?.usuario?.email}
              </div>
              <div>
                <strong>Telefone:</strong>{" "}
                {profissional?.funcionario?.usuario?.telefone}
              </div>
            </>
          )}
          <hr className="my-2" />
          {paciente && (
            <>
              <div>
                <strong>Paciente:</strong>{" "}
                {`${paciente.usuario.nome} ${paciente.usuario.sobrenome}`}
              </div>
              <div>
                <strong>Email:</strong> {paciente.usuario.email}
              </div>
              <div>
                <strong>Telefone:</strong> {paciente.usuario.telefone}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={createMutation.isPending || !agendamentoSelected}
        >
          {createMutation.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
