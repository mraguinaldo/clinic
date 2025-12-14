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
  onConfirm: () => void;
  onClose: () => void;
}

export function DeletePacienteModal({
  paciente,
  open,
  onConfirm,
  onClose,
}: Props) {
  if (!paciente) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
        </DialogHeader>

        <p className="mt-2">
          Tem certeza que deseja deletar o paciente{" "}
          <strong>{paciente.cod_medico}</strong>?
        </p>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
