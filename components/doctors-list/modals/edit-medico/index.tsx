/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

interface Props {
  medico: Medico | null;
  open: boolean;
  setOpen: (value: boolean) => void;
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
  const [especialidade, setEspecialidade] = useState<string>("");
  const [numOrdem, setNumOrdem] = useState<string>("");

  useEffect(() => {
    if (open && medico) {
      setEspecialidade(medico.especialidade ?? "");
      setNumOrdem(medico.num_ordem_medicos ?? "");
    } else if (!open) {
      // Limpa os campos quando o modal fecha (boa prática)
      setEspecialidade("");
      setNumOrdem("");
    }
  }, [open, medico]);

  if (!medico) return null;

  const handleSave = () => {
    onSave?.({
      especialidade: especialidade,
      num_ordem_medicos: numOrdem,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent key={medico.funcionario.id}>
        {" "}
        {/* já tens isso, ótimo */}
        <DialogHeader>
          <DialogTitle>Editar Médico</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <span className="block font-semibold mb-1">Usuário</span>
            <span>
              {medico.funcionario.usuario.nome}{" "}
              {medico.funcionario.usuario.sobrenome}
            </span>
          </div>

          <div>
            <label className="block font-semibold mb-1">Especialidade</label>
            <Select value={especialidade} onValueChange={setEspecialidade}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a especialidade" />
              </SelectTrigger>
              <SelectContent>
                {especialidadeOptions.map((op) => (
                  <SelectItem key={op} value={op}>
                    {op}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Número da Ordem</label>
            <Input
              value={numOrdem}
              onChange={(e) => setNumOrdem(e.target.value)}
              placeholder="Número da Ordem dos Médicos"
            />
          </div>
        </div>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
