/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/service/data";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";

import { EditUserModal } from "./modals/edit";
import { UserDetailsModal } from "./modals/details";
import { DeleteUserModal } from "./modals/delete";
import { ImageZoomr } from "@mraguinaldo/react-image-zoomr";

export interface Usuario {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  tipo: string;
  genero: string;
  telefone: string;
  is_active: boolean;
  data_nascimento: string;
  last_login: string | null;
  img?: string | null;
}

export function UserList() {
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [global, setGlobal] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [emailFiltro, setEmailFiltro] = useState("");
  const [telefoneFiltro, setTelefoneFiltro] = useState("");

  const { data, isLoading, error } = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const res = await api.get("/usuarios/");
      return res.data;
    },
  });

  const mutationEstado = useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) =>
      api.patch(`/usuarios/${id}/`, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });

  const mutationTipo = useMutation({
    mutationFn: async ({ id, tipo }: { id: number; tipo: string }) =>
      api.patch(`/usuarios/${id}/`, { tipo }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });

  const dadosFiltrados = React.useMemo(() => {
    if (!data) return [];

    return data.filter((user) => {
      const texto = global.toLowerCase();

      const passaBuscaGeral =
        !global ||
        Object.values(user).some((v) =>
          String(v).toLowerCase().includes(texto)
        );

      const passaTipo = tipoFiltro ? user.tipo === tipoFiltro : true;
      const passaGenero = generoFiltro ? user.genero === generoFiltro : true;
      const passaEstado =
        estadoFiltro === ""
          ? true
          : estadoFiltro === "ativo"
          ? user.is_active === true
          : user.is_active === false;

      const passaEmail = emailFiltro
        ? user.email.toLowerCase().includes(emailFiltro.toLowerCase())
        : true;

      const passaTelefone = telefoneFiltro
        ? user.telefone.includes(telefoneFiltro)
        : true;

      return (
        passaBuscaGeral &&
        passaTipo &&
        passaGenero &&
        passaEstado &&
        passaEmail &&
        passaTelefone
      );
    });
  }, [
    data,
    global,
    tipoFiltro,
    generoFiltro,
    estadoFiltro,
    emailFiltro,
    telefoneFiltro,
  ]);

  if (isLoading) return <p>Carregando usuários...</p>;
  if (error) return <p>Erro ao carregar usuários.</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        <input
          type="text"
          placeholder="Busca global..."
          value={global}
          onChange={(e) => setGlobal(e.target.value)}
          className="border rounded-md px-3 py-2"
        />

        <input
          type="text"
          placeholder="Buscar por email..."
          value={emailFiltro}
          onChange={(e) => setEmailFiltro(e.target.value)}
          className="border rounded-md px-3 py-2"
        />

        <input
          type="text"
          placeholder="Buscar por telefone..."
          value={telefoneFiltro}
          onChange={(e) => setTelefoneFiltro(e.target.value)}
          className="border rounded-md px-3 py-2"
        />

        <select
          className="border rounded-md px-3 py-2"
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
        >
          <option value="">Tipo (Todos)</option>
          <option value="paciente">Paciente</option>
          <option value="funcionario">Funcionário</option>
          <option value="admin">Admin</option>
        </select>

        <select
          className="border rounded-md px-3 py-2"
          value={generoFiltro}
          onChange={(e) => setGeneroFiltro(e.target.value)}
        >
          <option value="">Gênero (Todos)</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>

        <select
          className="border rounded-md px-3 py-2"
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          <option value="">Estado (Todos)</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>

      <ScrollArea className="h-[500px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dadosFiltrados.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-3">
                  {user.img ? (
                    <ImageZoomr
                      src={user.img}
                      objectFit="cover"
                      height={40}
                      width={40}
                      imageClass="h-10 w-10"
                      borderRadius={100}
                      alt={`${user.nome} ${user.sobrenome}`}
                      enableZoom={false}
                    />
                  ) : (
                    <UserIcon className="w-10 h-10 rounded-full p-1 border bg-gray-100 text-gray-400" />
                  )}
                  <span>
                    {user.nome} {user.sobrenome}
                  </span>
                </TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>{user.telefone}</TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 border px-3 py-1 rounded-md text-sm">
                        {user.tipo}
                        <ChevronDown size={14} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      {["paciente", "funcionario", "admin"].map((t) => (
                        <DropdownMenuItem
                          key={t}
                          onClick={() =>
                            mutationTipo.mutate({ id: user.id, tipo: t })
                          }
                        >
                          {t}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>
                  <Badge
                    className="cursor-pointer rounded-full px-3"
                    variant={user.is_active ? "default" : "secondary"}
                    onClick={() =>
                      mutationEstado.mutate({
                        id: user.id,
                        is_active: !user.is_active,
                      })
                    }
                  >
                    {user.is_active ? "Ativo" : "Inativo"}
                  </Badge>
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
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenEdit(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Atualizar
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          mutationEstado.mutate({
                            id: user.id,
                            is_active: !user.is_active,
                          })
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {user.is_active ? "Desativar" : "Ativar"}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenDetails(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenDelete(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <EditUserModal
        user={selectedUser}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <UserDetailsModal
        user={selectedUser}
        open={openDetails}
        setOpen={setOpenDetails}
      />
      <DeleteUserModal
        user={selectedUser}
        open={openDelete}
        setOpen={setOpenDelete}
      />
    </>
  );
}
