"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/service/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Usuario {
  id: number;
  nome: string;
  sobrenome: string;
}

export function DeleteUserModal({
  user,
  open,
  setOpen,
}: {
  user: Usuario | null;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const mutation = useMutation({
    mutationFn: async () => api.delete(`/usuarios/${currentUser?.id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setOpen(false);
    },
  });

  if (!currentUser) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar Usuário</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja eliminar{" "}
          <strong>
            {currentUser.nome} {currentUser.sobrenome}
          </strong>
          ?
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>

          <Button variant="destructive" onClick={() => mutation.mutate()}>
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
