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
import { Plus, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { DisponibilidadeMedicoModal } from "@/components/disponibilidade-medico/modals/edit-disponibilidade";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUserDataStore } from "@/store/use-user-data-store";

export default function DisponibilidadesPage() {
  const { user } = useUserDataStore();
  const qc = useQueryClient();
  const [edit, setEdit] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: disponibilidades = [] } = useQuery({
    queryKey: ["disponibilidades"],
    queryFn: async () => (await api.get("/disponibilidade-medico/")).data,
  });

  const del = useMutation({
    mutationFn: (id: number) => api.delete(`/disponibilidade-medico/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["disponibilidades"] }),
  });

  const { data: medicos = [] } = useQuery({
    queryKey: ["medicos"],
    queryFn: async () => (await api.get("/medicos/")).data,
  });

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      del.mutate(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Disponibilidade Médica</h2>
        {user?.tipo === "medico" && (
          <Button onClick={() => setEdit({})}>
            <Plus size={16} /> Nova
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Nome Médico</TableHead>
            <TableHead>Especialidade</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disponibilidades.map((d: any) => {
            const medico = medicos.find((m: any) => m.id === d.doutor);

            return (
              <TableRow key={d.id}>
                <TableCell>{d.data}</TableCell>
                <TableCell>{d.hora_inicio}</TableCell>
                <TableCell>{d.hora_fim}</TableCell>
                <TableCell>{d.is_active ? "Ativo" : "Inativo"}</TableCell>

                <TableCell>
                  {medico?.funcionario?.usuario?.nome}{" "}
                  {medico?.funcionario?.usuario?.sobrenome}
                </TableCell>
                <TableCell>{medico?.especialidade}</TableCell>
                <TableCell>{medico?.funcionario?.cargo}</TableCell>
                <TableCell>{medico?.funcionario?.departamento}</TableCell>

                {user?.id === medico?.funcionario?.usuario?.id && (
                  <TableCell className="flex gap-2">
                    <Button size="sm" onClick={() => setEdit(d)}>
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(d.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Modal de edição */}
      <DisponibilidadeMedicoModal
        open={!!edit}
        data={edit}
        onClose={() => setEdit(null)}
      />

      {/* Modal de confirmação de deleção */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar deleção</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja deletar esta disponibilidade?</p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
