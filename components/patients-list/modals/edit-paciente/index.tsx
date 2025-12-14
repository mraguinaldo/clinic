/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
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
import { Paciente } from "@/app/(private)/dashboard/pacientes/interface";

interface Props {
  paciente: Paciente | null;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const bloodTypes = ["A+", "A-", "B-", "AB+", "AB-", "O+", "O-"];

export function EditPacienteModal({ paciente, open, setOpen }: Props) {
  const queryClient = useQueryClient();
  const [codMedico, setCodMedico] = useState("");
  const [tipoSanguineo, setTipoSanguineo] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");

  useEffect(() => {
    if (paciente) {
      setCodMedico(paciente.cod_medico);
      setTipoSanguineo(paciente.tipo_sanguineo);
      setPeso(paciente.peso);
      setAltura(paciente.altura);
    }
  }, [paciente]);

  const updateMutation = useMutation({
    mutationFn: async () =>
      api.patch(`/pacientes/${paciente?.id}/`, {
        cod_medico: codMedico,
        tipo_sanguineo: tipoSanguineo.toLowerCase(),
        peso,
        altura,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      setOpen(false);
    },
  });

  if (!paciente) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="block font-semibold mb-1">Código Médico</label>
            <input
              type="text"
              value={codMedico}
              onChange={(e) => setCodMedico(e.target.value)}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Tipo Sanguíneo</label>
            <select
              value={tipoSanguineo}
              onChange={(e) => setTipoSanguineo(e.target.value)}
              className="border rounded-md px-2 py-1 w-full"
            >
              {bloodTypes.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Peso (kg)</label>
            <input
              type="text"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Altura (m)</label>
            <input
              type="text"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              className="border rounded-md px-2 py-1 w-full"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => updateMutation.mutate()}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
