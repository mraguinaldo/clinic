/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User as UserIcon } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  tipo: string;
  genero: string;
  data_nascimento: string;
  last_login: string | null;
  is_active: boolean;
  img?: string | null;
}

export function UserDetailsModal({
  user,
  open,
  setOpen,
}: {
  user: Usuario | null;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  if (!currentUser) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mb-4">
          {currentUser.img ? (
            <img
              src={currentUser.img}
              alt={`${currentUser.nome} ${currentUser.sobrenome}`}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <UserIcon className="h-24 w-24 text-gray-400" />
          )}
        </div>

        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {currentUser.id}
          </p>
          <p>
            <strong>Nome:</strong> {currentUser.nome} {currentUser.sobrenome}
          </p>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <p>
            <strong>Telefone:</strong> {currentUser.telefone}
          </p>
          <p>
            <strong>Tipo:</strong> {currentUser.tipo}
          </p>
          <p>
            <strong>Gênero:</strong> {currentUser.genero}
          </p>
          <p>
            <strong>Data de Nascimento:</strong> {currentUser.data_nascimento}
          </p>
          <p>
            <strong>Último Login:</strong> {currentUser.last_login ?? "Nunca"}
          </p>
          <p>
            <strong>Ativo?:</strong> {currentUser.is_active ? "Sim" : "Não"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
