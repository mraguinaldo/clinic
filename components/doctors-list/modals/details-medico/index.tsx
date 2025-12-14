"use client";

import { Medico } from "@/app/(private)/dashboard/medicos/interface";
import { Dialog } from "@/components/ui/dialog";

interface Props {
  medico: Medico | null;
  open: boolean;
  setOpen: (val: boolean) => void;
}

export function MedicoDetailsModal({ medico, open, setOpen }: Props) {
  if (!medico) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Detalhes do Médico</h2>
        <p>
          <strong>ID Usuário:</strong> {medico.usuario.id}
        </p>
        <p>
          <strong>Especialidade:</strong> {medico.especialidade}
        </p>
        <p>
          <strong>Nº Ordem Médicos:</strong> {medico.num_ordem_medicos}
        </p>
      </div>
    </Dialog>
  );
}
