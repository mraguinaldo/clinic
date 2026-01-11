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
import {
  MoreHorizontal,
  Trash2,
  Plus,
  Link as LinkIcon,
  Video,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useUserDataStore } from "@/store/use-user-data-store";

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

interface Doutor {
  id: number;
  especialidade: string;
  funcionario: {
    usuario: Usuario;
  };
}

interface Agendamento {
  id: number;
  paciente: Paciente;
  doutor: Doutor;
  agendamento_tipo: "ONLINE" | "PRESENCIAL";
  data: string;
  hora_inicio: string;
  hora_fim: string;
  status: string;
  meeting_link: string | null;
}

/* =======================
   COMPONENTE
======================= */

export default function AgendamentosList() {
  const { user } = useUserDataStore();
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<Agendamento | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  const [openMeeting, setOpenMeeting] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  /* =======================
     QUERY
  ======================= */

  const { data: agendamentos = [], isLoading } = useQuery<Agendamento[]>({
    queryKey: ["agendamentos"],
    queryFn: async () => {
      const res = await api.get("/agendamentos/");
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
      data: Partial<Agendamento>;
    }) => api.patch(`/agendamentos/${id}/`, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/agendamentos/${id}/`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] }),
  });

  if (isLoading) return <p>Carregando...</p>;

  const tipoOptions = ["ONLINE", "PRESENCIAL"];
  const statusOptions = ["AGENDADA", "CANCELADA", "CONCLUIDA"];

  const agendamentosFiltrados = agendamentos.filter((ag) => {
    if (user?.tipo === "paciente") {
      return ag.paciente?.usuario?.id === user?.id;
    }
    return true;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Agendamentos</h2>

        <Link
          href="/dashboard/agendamentos/criar"
          className="flex items-center gap-2 text-white bg-gray-950 rounded-[12px] py-2 px-4"
        >
          Novo Agendamento
        </Link>
      </div>

      <ScrollArea className="h-[520px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Médico</TableHead>
              <TableHead>Especialidade - Médico</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora Início</TableHead>
              <TableHead>Hora Fim</TableHead>
              <TableHead>Tipo</TableHead>
              {/* <TableHead>Status</TableHead> */}
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {agendamentosFiltrados.map((ag) => (
              <TableRow key={ag.id}>
                <TableCell>
                  {ag.paciente.usuario.nome} {ag.paciente.usuario.sobrenome}
                </TableCell>

                <TableCell>
                  {ag.doutor.funcionario.usuario.nome}{" "}
                  {ag.doutor.funcionario.usuario.sobrenome}
                </TableCell>

                <TableCell>{ag.doutor.especialidade}</TableCell>

                <TableCell>
                  <input
                    type="date"
                    disabled={user?.tipo === "paciente"}
                    defaultValue={ag.data}
                    className="border rounded-md px-2 py-1"
                    onBlur={(e) =>
                      e.target.value !== ag.data &&
                      updateMutation.mutate({
                        id: ag.id,
                        data: { data: e.target.value },
                      })
                    }
                  />
                </TableCell>

                <TableCell>
                  <input
                    type="time"
                    disabled={user?.tipo === "paciente"}
                    defaultValue={ag.hora_inicio.slice(0, 5)}
                    className="border rounded-md px-2 py-1"
                    onBlur={(e) =>
                      updateMutation.mutate({
                        id: ag.id,
                        data: { hora_inicio: e.target.value },
                      })
                    }
                  />
                </TableCell>

                <TableCell>
                  <input
                    type="time"
                    disabled={user?.tipo === "paciente"}
                    defaultValue={ag.hora_fim.slice(0, 5)}
                    className="border rounded-md px-2 py-1"
                    onBlur={(e) =>
                      updateMutation.mutate({
                        id: ag.id,
                        data: { hora_fim: e.target.value },
                      })
                    }
                  />
                </TableCell>

                <TableCell>
                  <select
                    disabled={user?.tipo === "paciente"}
                    value={ag.agendamento_tipo}
                    onChange={(e) => {
                      const novoTipo = e.target
                        .value as Agendamento["agendamento_tipo"];

                      if (novoTipo === "ONLINE" && !ag.meeting_link) {
                        setSelected(ag);
                        setMeetingLink("");
                        setOpenMeeting(true);
                      } else {
                        updateMutation.mutate({
                          id: ag.id,
                          data: { agendamento_tipo: novoTipo },
                        });
                      }
                    }}
                    className="border rounded-md px-2 py-1"
                  >
                    {tipoOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </TableCell>

                {/* <TableCell>
                  <select
                    value={ag.status}
                    onChange={(e) =>
                      updateMutation.mutate({
                        id: ag.id,
                        data: { status: e.target.value },
                      })
                    }
                    className="border rounded-md px-2 py-1"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </TableCell> */}

                {/* AÇÕES */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {ag.agendamento_tipo === "ONLINE" && (
                        <>
                          {user?.tipo !== "paciente" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelected(ag);
                                setMeetingLink(ag.meeting_link ?? "");
                                setOpenMeeting(true);
                              }}
                            >
                              <LinkIcon className="mr-2 h-4 w-4" />
                              Alterar link
                            </DropdownMenuItem>
                          )}

                          {ag.meeting_link && (
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(ag.meeting_link!, "_blank")
                              }
                            >
                              <Video className="mr-2 h-4 w-4" />
                              Ir para reunião
                            </DropdownMenuItem>
                          )}
                        </>
                      )}

                      {user?.tipo !== "paciente" && (
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelected(ag);
                            setOpenDelete(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {openMeeting && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-[420px]">
            <h3 className="text-lg font-semibold mb-4">
              Adicionar/Alterar link da reunião
            </h3>

            <input
              type="url"
              placeholder="https://meet.google.com/..."
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpenMeeting(false)}>
                Cancelar
              </Button>

              <Button
                onClick={() => {
                  if (!meetingLink) {
                    toast.error("O link é obrigatório para agendamento ONLINE");
                    return;
                  }

                  updateMutation.mutate({
                    id: selected.id,
                    data: {
                      agendamento_tipo: "ONLINE",
                      meeting_link: meetingLink,
                    },
                  });

                  setOpenMeeting(false);
                }}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {openDelete && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Confirmar exclusão?</h3>

            <p>Tem certeza que deseja excluir este agendamento?</p>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpenDelete(false)}>
                Cancelar
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  deleteMutation.mutate(selected.id);
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
