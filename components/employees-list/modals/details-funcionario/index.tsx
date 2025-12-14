"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Funcionario } from "@/app/(private)/dashboard/funcionarios/interface";

interface Props {
  funcionario: Funcionario | null;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export function FuncionarioDetailsModal({ funcionario, open, setOpen }: Props) {
  if (!funcionario) return null;

  const { usuario } = funcionario;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes do Funcionário</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <strong>Nome:</strong> {usuario.nome} {usuario.sobrenome}
          </div>

          <div>
            <strong>Email:</strong> {usuario.email}
          </div>

          <div>
            <strong>Telefone:</strong> {usuario.telefone}
          </div>

          <div>
            <strong>Cargo:</strong>{" "}
            <Badge className="capitalize">{funcionario.cargo}</Badge>
          </div>

          <div>
            <strong>Departamento:</strong>{" "}
            <Badge variant="secondary" className="capitalize">
              {funcionario.departamento}
            </Badge>
          </div>

          <div>
            <strong>Turno:</strong> {funcionario.turno}
          </div>

          <div>
            <strong>NIF:</strong> {funcionario.nif}
          </div>

          <div>
            <strong>Data de admissão:</strong> {funcionario.data_admissao}
          </div>

          {funcionario.data_demissao && (
            <div>
              <strong>Data de demissão:</strong> {funcionario.data_demissao}
            </div>
          )}

          {funcionario.anos_experiencia !== undefined && (
            <div>
              <strong>Anos de experiência:</strong>{" "}
              {funcionario.anos_experiencia}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
