/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { api } from "@/service/data";
import { Usuario } from "@/app/(private)/dashboard/consultas/page";

interface ExameDetailsModalProps {
  exame: any; // Objeto exame da listagem
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function ExameDetailsModal({
  exame,
  open,
  setOpen,
}: ExameDetailsModalProps) {
  const [consulta, setConsulta] = useState<any>(null);
  const [medico, setMedico] = useState<Usuario | null>(null);
  const [paciente, setPaciente] = useState<Usuario | null>(null);

  useEffect(() => {
    if (!exame || !open) return;

    // Buscar consulta
    api.get(`/consultas/${exame.consulta}/`).then((res) => {
      const consultaData = res.data;
      setConsulta(consultaData);

      // Buscar agendamento para pegar medico e paciente
      api.get(`/agendamentos/${consultaData.agendamento}/`).then((resAg) => {
        const agendamento = resAg.data;

        // Buscar médico
        if (agendamento.profissional) {
          api.get(`/medicos/${agendamento.profissional}/`).then((resMed) => {
            setMedico(resMed.data.funcionario.usuario);
          });
        }

        // Buscar paciente
        if (agendamento.paciente) {
          api.get(`/pacientes/${agendamento.paciente}/`).then((resPac) => {
            setPaciente(resPac.data.usuario);
          });
        }
      });
    });
  }, [exame, open]);

  if (!exame) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes do Exame #{exame.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div>
            <strong>Nome do exame:</strong> {exame.nome_exame}
          </div>
          <div>
            <strong>Descrição:</strong> {exame.descricao}
          </div>
          <div>
            <strong>Status:</strong> {exame.status}
          </div>
          <div>
            <strong>Data da solicitação:</strong>{" "}
            {exame.data_solicitacao ?? "—"}
          </div>
          <div>
            <strong>Data do resultado:</strong> {exame.data_resultado}
          </div>

          {consulta && (
            <div className="pt-2 border-t space-y-2">
              <div>
                <strong>Consulta:</strong> #{consulta.id} -{" "}
                {consulta.diagnostico}
              </div>
              {medico && (
                <div>
                  <strong>Médico:</strong> {medico.nome} ({medico.email})
                </div>
              )}
              {paciente && (
                <div>
                  <strong>Paciente:</strong> {paciente.nome} ({paciente.email})
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
