/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/service/data";

export function SaidaMedicamentoModal({ open, data, onClose }: any) {
  const qc = useQueryClient();

  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      ...data,
      medicamento_id: data?.id, // medicamento selecionado
    },
  });

  const [selectedMedicamentoId, setSelectedMedicamentoId] = useState<
    number | null
  >(data?.medicamento_id || null);
  const [selectedMedicamentoLabel, setSelectedMedicamentoLabel] =
    useState<string>("");

  const [selectedPacienteId, setSelectedPacienteId] = useState<number | null>(
    data?.paciente_id || null
  );
  const [selectedPacienteLabel, setSelectedPacienteLabel] =
    useState<string>("");

  const [selectedTipoSaida, setSelectedTipoSaida] = useState<string>(
    data?.tipo_saida || ""
  );

  // Buscar medicamentos
  const { data: medicamentos = [], isLoading: loadingMedicamentos } = useQuery({
    queryKey: ["medicamentos"],
    queryFn: async () => (await api.get("/medicamentos/")).data,
  });

  // Buscar pacientes
  const { data: pacientes = [], isLoading: loadingPacientes } = useQuery({
    queryKey: ["pacientes"],
    queryFn: async () => (await api.get("/pacientes/")).data,
  });

  // Atualiza labels se estivermos editando
  useEffect(() => {
    if (data) {
      if (data.medicamento_id && medicamentos.length > 0) {
        const med = medicamentos.find((m: any) => m.id === data.medicamento_id);
        if (med) setSelectedMedicamentoLabel(med.nome);
      }
      if (data.paciente_id && pacientes.length > 0) {
        const pac = pacientes.find((p: any) => p.id === data.paciente_id);
        if (pac)
          setSelectedPacienteLabel(
            `${pac.usuario.nome} ${pac.usuario.sobrenome}`
          );
      }
      if (data.tipo_saida) setSelectedTipoSaida(data.tipo_saida);
    }
  }, [data, medicamentos, pacientes]);

  const mut = useMutation({
    mutationFn: (payload: any) =>
      data?.id
        ? api.put(`/saida-medicamentos/${data.id}/`, payload)
        : api.post("/saida-medicamentos/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saida-medicamentos"] });
      onClose();
    },
  });

  if (loadingMedicamentos || loadingPacientes) return <p>Carregando...</p>;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saída de Medicamento</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(() => {
            if (
              !selectedMedicamentoId ||
              !selectedPacienteId ||
              !selectedTipoSaida
            ) {
              alert("Preencha todos os campos obrigatórios!");
              return;
            }
            mut.mutate({
              ...getValues(),
              medicamento_id: selectedMedicamentoId,
              paciente_id: selectedPacienteId,
              tipo_saida: selectedTipoSaida,
            });
          })}
          className="space-y-3"
        >
          {/* Medicamento */}
          <div>
            <Label>Medicamento</Label>
            <Select
              value={selectedMedicamentoId?.toString() || ""}
              onValueChange={(val) => {
                const med = medicamentos.find((m: any) => m.id === Number(val));
                if (med) {
                  setSelectedMedicamentoId(med.id);
                  setSelectedMedicamentoLabel(med.nome);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {selectedMedicamentoLabel || "Selecione um medicamento"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {medicamentos.map((m: any) => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {m.nome} — {m.unidade_medida} (Estoque: {m.estoque_atual})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Paciente */}
          <div>
            <Label>Paciente</Label>
            <Select
              value={selectedPacienteId?.toString() || ""}
              onValueChange={(val) => {
                const pac = pacientes.find((p: any) => p.id === Number(val));
                if (pac) {
                  setSelectedPacienteId(pac.id);
                  setSelectedPacienteLabel(
                    `${pac.usuario.nome} ${pac.usuario.sobrenome}`
                  );
                }
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {selectedPacienteLabel || "Selecione um paciente"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {pacientes.map((p: any) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.usuario.nome} {p.usuario.sobrenome} — {p.tipo_sanguineo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de saída */}
          <div>
            <Label>Tipo de saída</Label>
            <Select
              value={selectedTipoSaida || ""}
              onValueChange={(val) => setSelectedTipoSaida(val)}
            >
              <SelectTrigger>
                <SelectValue>
                  {selectedTipoSaida || "Selecione o tipo de saída"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PACIENTE">Paciente</SelectItem>
                <SelectItem value="PRESCRICAO">Prescrição</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantidade */}
          <div>
            <Label>Quantidade</Label>
            <Input
              type="number"
              min={1}
              {...control.register("quantidade")}
              placeholder="Informe a quantidade"
            />
          </div>

          {/* Observação */}
          <div>
            <Label>Observação</Label>
            <Input
              {...control.register("observacao")}
              placeholder="Observações adicionais"
            />
          </div>

          <Button type="submit" className="w-full">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
