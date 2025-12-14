/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { api } from "@/service/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User as UserIcon } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  sobrenome: string;
  telefone: string;
  email: string;
  genero: string;
  data_nascimento: string;
  is_active: boolean;
  tipo: string;
  img?: string | null;
}

export function EditUserModal({
  user,
  open,
  setOpen,
}: {
  user: Usuario | null;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: user ?? {},
  });

  useEffect(() => {
    if (user) {
      reset(user);
      setPreview(user.img ?? null);
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (
          data[key] !== user?.[key as keyof Usuario] &&
          key !== "groups" &&
          key !== "user_permissions"
        ) {
          formData.append(key, data[key]);
        }
      });

      if (file) {
        formData.append("img", file);
      }

      const response = await api.patch(`/usuarios/${user?.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setOpen(false);
    },
  });

  if (!user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Atualizar Usuário</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
        >
          <div className="flex justify-center mb-4">
            {preview ? (
              <img
                src={preview}
                alt={`${user.nome} ${user.sobrenome}`}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <UserIcon className="h-24 w-24 text-gray-400" />
            )}
          </div>

          <div>
            <Label>Alterar Imagem</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div>
            <Label>Nome</Label>
            <Input {...register("nome")} />
          </div>

          <div>
            <Label>Sobrenome</Label>
            <Input {...register("sobrenome")} />
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" {...register("email")} />
          </div>

          <div>
            <Label>Telefone</Label>
            <Input {...register("telefone")} />
          </div>

          <div>
            <Label>Gênero</Label>
            <select
              {...register("genero")}
              className="w-full border rounded-md p-2"
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>

          <div>
            <Label>Data de Nascimento</Label>
            <Input type="date" {...register("data_nascimento")} />
          </div>

          <div>
            <Label>Tipo</Label>
            <select
              {...register("tipo")}
              className="w-full border rounded-md p-2"
            >
              <option value="paciente">Paciente</option>
              <option value="funcionario">Funcionário</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
