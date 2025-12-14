"use client";

import { Funcionario } from "@/app/(private)/dashboard/funcionarios/interface";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  funcionario: Funcionario | null;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteFuncionarioModal({
  open,
  funcionario,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Funcionário</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          Tens certeza que desejas eliminar o funcionário{" "}
          <strong>
            {funcionario?.usuario.nome} {funcionario?.usuario.sobrenome}
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
