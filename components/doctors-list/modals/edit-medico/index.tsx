/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Medico } from "@/app/(private)/dashboard/medicos/interface";
import { Dialog } from "@/components/ui/dialog";

interface Props {
  medico: Medico | null;
  open: boolean;
  setOpen: (val: boolean) => void;
  onSave?: (data: Partial<Medico>) => void;
}

const especialidadeOptions = [
  "Cardiologia",
  "Dermatologia",
  "Pediatria",
  "Ginecologia",
  "Ortopedia",
  "Neurologia",
  "Oftalmologia",
  "Psiquiatria",
];

export function EditMedicoModal({ medico, open, setOpen, onSave }: Props) {
  const [especialidade, setEspecialidade] = useState("");
  const [numOrdem, setNumOrdem] = useState("");

  useEffect(() => {
    if (medico) {
      setEspecialidade(medico.especialidade);
      setNumOrdem(medico.num_ordem_medicos);
    }
  }, [medico]);

  const handleSave = () => {
    if (!medico) return;
    onSave?.({ especialidade, num_ordem_medicos: numOrdem });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="p-4 flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Editar Médico</h2>
        <Select onValueChange={setEspecialidade} value={especialidade}>
          <SelectTrigger>
            <SelectValue placeholder="Especialidade" />
          </SelectTrigger>
          <SelectContent>
            {especialidadeOptions.map((op) => (
              <SelectItem key={op} value={op}>
                {op}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={numOrdem}
          onChange={(e) => setNumOrdem(e.target.value)}
          placeholder="Número da Ordem"
        />

        <Button onClick={handleSave}>Salvar</Button>
      </div>
    </Dialog>
  );
}
