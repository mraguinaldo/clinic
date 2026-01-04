"use client";

import { Recepcionista } from "@/app/(private)/dashboard/recepcionistas/criar/interface";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  recepcionista: Recepcionista;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteRecepcionistaModal({
  open,
  recepcionista,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Recepcionista</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          Tens certeza que desejas eliminar o recepcionista{" "}
          <strong>
            {recepcionista?.funcionario.usuario.nome}{" "}
            {recepcionista?.funcionario.usuario.sobrenome}
          </strong>
          ?
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
