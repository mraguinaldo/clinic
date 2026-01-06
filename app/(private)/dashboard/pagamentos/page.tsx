/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/service/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/* =======================
   TIPAGENS
======================= */

interface Usuario {
  nome: string;
  sobrenome: string;
  email: string;
}

interface Paciente {
  id: number;
  usuario: Usuario;
}

interface Agendamento {
  id: number;
  paciente: Paciente;
}

interface Pagamento {
  id: number;
  consulta_id: number;
  consulta: Agendamento;
  paciente_id: number;
  paciente: Paciente;
  valor: string;
  metodo_pagamento: string;
  status: string;
  data_pagamento: string | null;
}

/* =======================
   COMPONENTE
======================= */

export default function PagamentosList() {
  const queryClient = useQueryClient();

  const [selectedDelete, setSelectedDelete] = useState<Pagamento | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  /* =======================
     QUERY
  ======================= */

  const { data: pagamentos = [], isLoading } = useQuery<Pagamento[]>({
    queryKey: ["pagamentos"],
    queryFn: async () => {
      const res = await api.get("/pagamentos/");
      return res.data;
    },
  });

  /* =======================
     MUTATIONS
  ======================= */

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Pagamento>;
    }) => api.patch(`/pagamentos/${id}/`, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/pagamentos/${id}/`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] }),
  });

  if (isLoading) return <p>Carregando pagamentos...</p>;

  const metodoOptions = ["DINHEIRO", "CARTAO", "PIX"];
  const statusOptions = ["PENDENTE", "PAGO", "CANCELADO"];

  /* =======================
     RENDER
  ======================= */

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Pagamentos</h2>
        <Link
          href="/dashboard/pagamentos/criar"
          className="flex items-center gap-2 text-white bg-gray-950 rounded-[12px] py-2 px-4"
        >
          <Plus size={18} />
          Novo Pagamento
        </Link>
      </div>

      <ScrollArea className="h-[520px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Consulta</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Método Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Pagamento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pagamentos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.paciente.usuario.nome} {p.paciente.usuario.sobrenome}
                </TableCell>

                <TableCell>#{p.consulta_id}</TableCell>

                <TableCell>
                  <input
                    type="text"
                    defaultValue={p.valor}
                    className="border rounded-md px-2 py-1 w-full"
                    onBlur={(e) =>
                      e.target.value !== p.valor &&
                      updateMutation.mutate({
                        id: p.id,
                        data: { valor: e.target.value },
                      })
                    }
                  />
                </TableCell>

                <TableCell>
                  <select
                    defaultValue={p.metodo_pagamento}
                    className="border rounded-md px-2 py-1 w-full"
                    onBlur={(e) =>
                      e.target.value !== p.metodo_pagamento &&
                      updateMutation.mutate({
                        id: p.id,
                        data: { metodo_pagamento: e.target.value },
                      })
                    }
                  >
                    {metodoOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </TableCell>

                <TableCell>
                  <select
                    defaultValue={p.status}
                    className="border rounded-md px-2 py-1 w-full"
                    onBlur={(e) =>
                      e.target.value !== p.status &&
                      updateMutation.mutate({
                        id: p.id,
                        data: { status: e.target.value },
                      })
                    }
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </TableCell>

                <TableCell>
                  <input
                    type="date"
                    defaultValue={
                      p.data_pagamento ? p.data_pagamento.slice(0, 10) : ""
                    }
                    className="border rounded-md px-2 py-1 w-full"
                    onBlur={(e) =>
                      e.target.value !==
                        (p.data_pagamento?.slice(0, 10) || "") &&
                      updateMutation.mutate({
                        id: p.id,
                        data: { data_pagamento: e.target.value },
                      })
                    }
                  />
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelectedDelete(p);
                          setOpenDelete(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* MODAL DELETE */}
      {openDelete && selectedDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Confirmar exclusão?</h3>
            <p>Tem certeza que deseja excluir este pagamento?</p>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpenDelete(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteMutation.mutate(selectedDelete.id);
                  setOpenDelete(false);
                }}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
