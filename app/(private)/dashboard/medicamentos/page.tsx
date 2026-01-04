/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/service/data";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@/components/ui/table";
import { Plus, Trash2, Pencil, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { MedicamentoModal } from "@/components/medicamentos/modals/edit-medicamentos";
import { SaidaMedicamentoModal } from "@/components/medicamentos/modals/saida-medicamentos";

export default function MedicamentosPage() {
  const qc = useQueryClient();
  const [edit, setEdit] = useState<any>(null);
  const [saida, setSaida] = useState<any>(null);
  const [showDeleteId, setShowDeleteId] = useState<number | null>(null);

  const { data = [] } = useQuery({
    queryKey: ["medicamentos"],
    queryFn: async () => (await api.get("/medicamentos/")).data,
  });

  const del = useMutation({
    mutationFn: (id: number) => api.delete(`/medicamentos/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medicamentos"] }),
  });

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Medicamentos</h2>
        <Button onClick={() => setEdit({})}>
          <Plus size={16} /> Novo
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Estoque Atual</TableHead>
            <TableHead>Estoque Mínimo</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((med: any) => (
            <TableRow key={med.id}>
              <TableCell>{med.nome}</TableCell>
              <TableCell>{med.unidade_medida}</TableCell>
              <TableCell>{med.estoque_atual}</TableCell>
              <TableCell>{med.estoque_minimo}</TableCell>
              <TableCell>{med.ativo ? "Sim" : "Não"}</TableCell>
              <TableCell className="flex gap-2">
                {/* Editar medicamento */}
                <Button size="sm" onClick={() => setEdit(med)}>
                  <Pencil size={14} />
                </Button>

                {/* Saída de medicamento */}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSaida(med)}
                >
                  <ArrowUpRight size={14} />
                </Button>

                {/* Deletar medicamento */}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowDeleteId(med.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de criação/edição */}
      <MedicamentoModal
        open={!!edit}
        data={edit}
        onClose={() => setEdit(null)}
      />

      {/* Modal de saída de medicamento */}
      <SaidaMedicamentoModal
        open={!!saida}
        data={saida}
        onClose={() => setSaida(null)}
      />

      {/* Modal de confirmação de deleção */}
      {showDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded shadow-lg space-y-4 w-[320px]">
            <p>Tem certeza que deseja deletar este medicamento?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteId(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  del.mutate(showDeleteId);
                  setShowDeleteId(null);
                }}
              >
                Deletar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
