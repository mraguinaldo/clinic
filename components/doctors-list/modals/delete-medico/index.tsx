"use client";

import { Button } from "@/components/ui/button";
import { Medico } from "@/app/(private)/dashboard/medicos/interface";
import { Dialog } from "@/components/ui/dialog";

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
      <div className="p-4 flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Confirmar deleção</h2>
        <p>Tem certeza que deseja eliminar o médico {medico.usuario.nome}?</p>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Dialog>
  );
}
