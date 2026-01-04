/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/service/data";
import { useEffect } from "react";

export function MedicamentoModal({ open, data, onClose }: any) {
  const qc = useQueryClient();

  const { control, handleSubmit, reset, getValues, register } = useForm({
    defaultValues: data || {},
  });

  useEffect(() => {
    reset(data || {});
  }, [data, reset]);

  const mut = useMutation({
    mutationFn: (payload: any) =>
      data?.id
        ? api.put(`/medicamentos/${data.id}/`, payload)
        : api.post("/medicamentos/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medicamentos"] });
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Medicamento</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(() => mut.mutate(getValues()))}
          className="space-y-3"
        >
          <div>
            <Label>Nome</Label>
            <Input
              placeholder="Nome do medicamento"
              {...register("nome")}
              maxLength={150}
              required
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Input placeholder="Descrição" {...register("descricao")} />
          </div>

          <div>
            <Label>Unidade de Medida</Label>
            <Input
              placeholder="Unidade de medida"
              {...register("unidade_medida")}
              maxLength={50}
              required
            />
          </div>

          <div>
            <Label>Estoque Atual</Label>
            <Input
              type="number"
              placeholder="Estoque atual"
              {...register("estoque_atual")}
              min={0}
            />
          </div>

          <div>
            <Label>Estoque Mínimo</Label>
            <Input
              type="number"
              placeholder="Estoque mínimo"
              {...register("estoque_minimo")}
              min={0}
            />
          </div>

          <div>
            <Label>Ativo</Label>
            <Controller
              name="ativo"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
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
