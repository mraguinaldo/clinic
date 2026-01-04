/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/service/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export function DisponibilidadeMedicoModal({ open, data, onClose }: any) {
  const qc = useQueryClient();

  const { control, handleSubmit, reset, getValues } = useForm({
    defaultValues: data || {},
  });

  // ID do médico selecionado
  const [selectedMedicoId, setSelectedMedicoId] = useState<number | null>(null);
  const [selectedMedicoLabel, setSelectedMedicoLabel] = useState<string>("");

  // Buscar médicos
  const { data: medicos = [], isLoading: loadingMedicos } = useQuery({
    queryKey: ["medicos"],
    queryFn: async () => {
      const res = await api.get("/medicos/");
      return res.data;
    },
  });

  // Atualiza o formulário e selects quando o "data" mudar
  useEffect(() => {
    if (data) {
      reset(data); // atualiza os inputs com os valores do item a ser editado

      if (data.doutor && medicos.length > 0) {
        const medico = medicos.find((m: any) => m.id === data.doutor);
        if (medico) {
          setSelectedMedicoId(medico.id);
          setSelectedMedicoLabel(
            `${medico.funcionario.usuario.nome} ${medico.funcionario.usuario.sobrenome}`
          );
        }
      } else {
        setSelectedMedicoId(null);
        setSelectedMedicoLabel("");
      }
    } else {
      reset({}); // limpar formulário ao criar novo
      setSelectedMedicoId(null);
      setSelectedMedicoLabel("");
    }
  }, [data, medicos, reset]);

  const mut = useMutation({
    mutationFn: (payload: any) =>
      data?.id
        ? api.put(`/disponibilidade-medico/${data.id}/`, payload)
        : api.post("/disponibilidade-medico/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["disponibilidades"] });
      onClose();
    },
  });

  if (loadingMedicos) return <p>Carregando médicos...</p>;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disponibilidade</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(() => {
            if (!selectedMedicoId) {
              alert("Selecione um médico!");
              return;
            }
            mut.mutate({
              ...getValues(),
              doutor: selectedMedicoId, // envia o ID do médico
            });
          })}
          className="space-y-3"
        >
          {/* Data */}
          <div>
            <Label>Data</Label>
            <Controller
              name="data"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  placeholder="Selecione a data"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>

          {/* Hora início */}
          <div>
            <Label>Hora de início</Label>
            <Input
              type="time"
              placeholder="Selecione a hora de início"
              {...control.register("hora_inicio")}
            />
          </div>

          {/* Hora fim */}
          <div>
            <Label>Hora de fim</Label>
            <Input
              type="time"
              placeholder="Selecione a hora de fim"
              {...control.register("hora_fim")}
            />
          </div>

          {/* Médico */}
          <div>
            <Label>Médico</Label>
            <Select
              value={selectedMedicoId?.toString() || ""}
              onValueChange={(val) => {
                const medico = medicos.find((m: any) => m.id === Number(val));
                if (medico) {
                  setSelectedMedicoId(medico.id);
                  setSelectedMedicoLabel(
                    `${medico.funcionario.usuario.nome} ${medico.funcionario.usuario.sobrenome}`
                  );
                }
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {selectedMedicoLabel ?? "Selecione um médico"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {medicos.map((m: any) => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {m.funcionario.usuario.nome}{" "}
                    {m.funcionario.usuario.sobrenome} —{" "}
                    {m.funcionario.usuario.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
