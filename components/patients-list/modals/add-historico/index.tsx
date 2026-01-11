/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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

interface Props {
  pacienteId: number | null;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function AddHistoricoModal({ pacienteId, open, setOpen }: Props) {
  const queryClient = useQueryClient();
  const [doencasPrevias, setDoencasPrevias] = useState("");
  const [alergias, setAlergias] = useState("");
  const [cirugias, setCirugias] = useState("");
  const [tratamentos, setTratamentos] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const createMutation = useMutation({
    mutationFn: async (data: any) =>
      api.post("/historicos-medico/", { paciente_id: pacienteId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["historicos", pacienteId] });
      toast("Historico médico guardado com sucesso");
      setOpen(false);
      setDoencasPrevias("");
      setAlergias("");
      setCirugias("");
      setTratamentos("");
      setObservacoes("");
    },
  });

  const handleSubmit = () => {
    createMutation.mutate({
      doencas_previas: doencasPrevias,
      alergias,
      cirugias,
      tratamentos,
      observacoes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Histórico Médico</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="block font-semibold mb-1">Doenças Prévias</label>
            <textarea
              value={doencasPrevias}
              onChange={(e) => setDoencasPrevias(e.target.value)}
              maxLength={200}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Alergias</label>
            <textarea
              value={alergias}
              onChange={(e) => setAlergias(e.target.value)}
              maxLength={200}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Cirurgias</label>
            <textarea
              value={cirugias}
              onChange={(e) => setCirugias(e.target.value)}
              maxLength={200}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Tratamentos</label>
            <textarea
              value={tratamentos}
              onChange={(e) => setTratamentos(e.target.value)}
              maxLength={200}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Observações</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              maxLength={200}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
