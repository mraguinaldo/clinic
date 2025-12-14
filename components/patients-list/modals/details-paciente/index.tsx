"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Paciente } from "@/app/(private)/dashboard/pacientes/interface";

interface Props {
  paciente: Paciente | null;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function PacienteDetailsModal({ paciente, open, setOpen }: Props) {
  if (!paciente) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Paciente</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          <div>
            <span className="font-semibold">Código Médico:</span>{" "}
            {paciente.cod_medico}
          </div>
          <div>
            <span className="font-semibold">Tipo Sanguíneo:</span>{" "}
            {paciente.tipo_sanguineo}
          </div>
          <div>
            <span className="font-semibold">Peso:</span> {paciente.peso} kg
          </div>
          <div>
            <span className="font-semibold">Altura:</span> {paciente.altura} m
          </div>
          <div>
            <span className="font-semibold">Usuário:</span> {paciente.usuario}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={() => setOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
