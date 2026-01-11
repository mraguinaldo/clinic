/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/service/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function EditHistoricoModal({ open, setOpen, historico }: any) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    doencas_previas: "",
    alergias: "",
    cirugias: "",
    tratamentos: "",
    observacoes: "",
  });

  useEffect(() => {
    if (!historico) return;

    setForm({
      doencas_previas: historico.doencas_previas || "",
      alergias: historico.alergias || "",
      cirugias: historico.cirugias || "",
      tratamentos: historico.tratamentos || "",
      observacoes: historico.observacoes || "",
    });
  }, [historico]);

  const mutation = useMutation({
    mutationFn: () => api.patch(`/historicos-medico/${historico.id}/`, form),
    onSuccess: () => {
      toast("Histórico Médico atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["historicos"] });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Histórico Médico</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 mt-2">
          {Object.entries(form).map(([k, v]) => (
            <div key={k}>
              <label className="font-semibold">
                {k.replace("_", " ").toUpperCase()}
              </label>
              <textarea
                value={v}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                maxLength={200}
                className="border rounded-md w-full px-2 py-1"
              />
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => mutation.mutate()}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
