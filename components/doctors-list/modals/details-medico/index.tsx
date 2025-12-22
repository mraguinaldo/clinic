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
  setOpen: (value: boolean) => void;
}

export function MedicoDetailsModal({ medico, open, setOpen }: Props) {
  if (!medico) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Médico</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          <div>
            <span className="font-semibold">Usuário:</span>{" "}
            {medico.funcionario.usuario.nome}{" "}
            {medico.funcionario.usuario.sobrenome}
          </div>

          <div>
            <span className="font-semibold">Especialidade:</span>{" "}
            {medico.especialidade}
          </div>

          <div>
            <span className="font-semibold">Nº Ordem dos Médicos:</span>{" "}
            {medico.num_ordem_medicos}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={() => setOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
