"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Medico } from "@/app/(private)/dashboard/medicos/interface";

interface Props {
  medico: Medico | null;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteMedicoModal({ medico, open, onConfirm, onClose }: Props) {
  if (!medico) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
        </DialogHeader>

        <p className="mt-2">
          Tem certeza que deseja deletar o médico{" "}
          <strong>
            {medico.funcionario.usuario.nome}{" "}
            {medico.funcionario.usuario.sobrenome}
          </strong>
          ?
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
