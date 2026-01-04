"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Consulta } from "@/app/(private)/dashboard/consultas/page";

interface Props {
  consulta: Consulta;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export function ConsultaDetailsModal({ consulta, open, setOpen }: Props) {
  if (!consulta) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes da Consulta</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <strong>ID da Consulta:</strong> {consulta.id}
          </div>

          <div>
            <strong>Diagnóstico:</strong>
            <p className="mt-1 text-muted-foreground">{consulta.diagnostico}</p>
          </div>

          <div>
            <strong>Status:</strong>{" "}
            <Badge
              className="capitalize"
              variant={
                consulta.status === "realizada"
                  ? "default"
                  : consulta.status === "pendente"
                  ? "secondary"
                  : "destructive"
              }
            >
              {consulta.status}
            </Badge>
          </div>

          <div>
            <strong>Data da consulta:</strong>{" "}
            {new Date(consulta.data_consulta ?? "").toLocaleString()}
          </div>

          <div>
            <strong>Data de criação:</strong>{" "}
            {new Date(consulta.data_criacao).toLocaleString()}
          </div>

          <div>
            <strong>ID do agendamento:</strong>{" "}
            <Badge variant="outline">{consulta.agendamento}</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
