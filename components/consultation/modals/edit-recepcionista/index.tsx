/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/service/data";
import { Funcionario } from "@/app/(private)/dashboard/funcionarios/interface";

interface Props {
  funcionario: Funcionario | null;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export function EditFuncionarioModal({ funcionario, open, setOpen }: Props) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    cargo: "",
    departamento: "",
    turno: "",
    nif: "",
    data_admissao: "",
    data_demissao: "",
    anos_experiencia: "",
  });

  useEffect(() => {
    if (funcionario) {
      setForm({
        cargo: funcionario.cargo,
        departamento: funcionario.departamento,
        turno: funcionario.turno,
        nif: funcionario.nif,
        data_admissao: funcionario.data_admissao,
        data_demissao: funcionario.data_demissao || "",
        anos_experiencia: funcionario.anos_experiencia?.toString() || "",
      });
    }
  }, [funcionario]);

  const mutation = useMutation({
    mutationFn: async () =>
      api.patch(`/funcionarios/${funcionario?.id}/`, {
        ...form,
        anos_experiencia: form.anos_experiencia
          ? Number(form.anos_experiencia)
          : null,
        data_demissao: form.data_demissao || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      setOpen(false);
    },
  });

  if (!funcionario) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Atualizar Funcionário</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Cargo</Label>
            <select
              className="w-full border rounded-md px-2 py-1"
              value={form.cargo}
              onChange={(e) => setForm({ ...form, cargo: e.target.value })}
            >
              {[
                "administrativo",
                "enfermeiro",
                "farmaceutico",
                "gestor",
                "medico",
                "recepcionista",
                "tecnico",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Departamento</Label>
            <select
              className="w-full border rounded-md px-2 py-1"
              value={form.departamento}
              onChange={(e) =>
                setForm({
                  ...form,
                  departamento: e.target.value,
                })
              }
            >
              {["recepcao", "cardiologia", "farmacia", "laboratorio"].map(
                (d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <Label>Turno</Label>
            <select
              className="w-full border rounded-md px-2 py-1"
              value={form.turno}
              onChange={(e) => setForm({ ...form, turno: e.target.value })}
            >
              {["manhã", "tarde", "noite", "rotativo"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>NIF</Label>
            <Input
              value={form.nif}
              onChange={(e) => setForm({ ...form, nif: e.target.value })}
            />
          </div>

          <div>
            <Label>Data de admissão</Label>
            <Input
              type="date"
              value={form.data_admissao}
              onChange={(e) =>
                setForm({
                  ...form,
                  data_admissao: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Data de demissão</Label>
            <Input
              type="date"
              value={form.data_demissao}
              onChange={(e) =>
                setForm({
                  ...form,
                  data_demissao: e.target.value,
                })
              }
            />
          </div>

          <div className="col-span-2">
            <Label>Anos de experiência</Label>
            <Input
              type="number"
              value={form.anos_experiencia}
              onChange={(e) =>
                setForm({
                  ...form,
                  anos_experiencia: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
