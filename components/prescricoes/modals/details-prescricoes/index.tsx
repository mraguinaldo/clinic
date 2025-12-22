/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Prescricao } from "@/app/(private)/dashboard/prescricoes/page";
import {
  Agendamento,
  Consulta,
  Usuario,
} from "@/app/(private)/dashboard/consultas/page";

interface PrescricaoDetailsModalProps {
  prescricao: Prescricao;
  open: boolean;
  setOpen: (open: boolean) => void;
  consultas?: Consulta[];
  agendamentos?: Agendamento[];
  medicos?: any[];
  pacientes?: any[];
}

export function PrescricaoDetailsModal({
  prescricao,
  open,
  setOpen,
  consultas = [],
  agendamentos = [],
  medicos = [],
  pacientes = [],
}: PrescricaoDetailsModalProps) {
  const consultaMap: Record<number, Consulta> = {};
  consultas.forEach((c) => (consultaMap[c.id] = c));

  const agendamentoMap: Record<number, Agendamento> = {};
  agendamentos.forEach((a) => (agendamentoMap[a.id] = a));

  const medicoMap: Record<number, Usuario> = {};
  medicos.forEach((m: any) => (medicoMap[m.id] = m.funcionario.usuario));

  const pacienteMap: Record<number, Usuario> = {};
  pacientes.forEach((p: any) => (pacienteMap[p.id] = p.usuario));

  const consulta = consultaMap[prescricao.consulta];
  const agendamento = consulta ? agendamentoMap[consulta.agendamento] : null;
  const medico = agendamento?.profisional
    ? medicoMap[agendamento.profisional]
    : null;
  const paciente = agendamento?.paciente
    ? pacienteMap[agendamento.paciente]
    : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes da Prescrição #{prescricao.id}</DialogTitle>
          <DialogClose asChild>
            <Button variant="outline" className="absolute top-2 right-2">
              Fechar
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          <div>
            <strong>Medicamento:</strong> {prescricao.medicamento}
          </div>
          <div>
            <strong>Dosagem:</strong> {prescricao.dosagem}
          </div>
          <div>
            <strong>Frequência:</strong> {prescricao.frequencia}
          </div>
          <div>
            <strong>Duração:</strong> {prescricao.duracao}
          </div>
          <div>
            <strong>Observação:</strong> {prescricao.observacao}
          </div>
          <div>
            <strong>Data da Prescrição:</strong>{" "}
            {new Date(prescricao.data_prescricao).toLocaleString()}
          </div>
          <div>
            <strong>Consulta:</strong> #{prescricao.consulta}{" "}
            {consulta?.diagnostico ? `- ${consulta.diagnostico}` : ""}
          </div>

          {medico || paciente ? (
            <div className="p-2 border rounded-md bg-gray-50 mt-2 space-y-1">
              {medico && (
                <>
                  <div>
                    <strong>Médico:</strong> {medico.nome} ({medico.email})
                  </div>
                  <div>
                    <strong>Telefone:</strong> {medico.telefone}
                  </div>
                </>
              )}
              {paciente && (
                <>
                  <div>
                    <strong>Paciente:</strong> {paciente.nome} ({paciente.email}
                    )
                  </div>
                  <div>
                    <strong>Telefone:</strong> {paciente.telefone}
                  </div>
                </>
              )}
            </div>
          ) : (
            <p>Carregando informações de médico/paciente...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
