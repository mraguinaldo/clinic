/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/service/data";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// ---------------- Zod Schema ----------------
const passwordSchema = z
  .object({
    password: z.string().min(1, "Senha obrigatória").max(128),
    confirmPassword: z.string().min(1, "Confirmação obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

interface UpdatePasswordControlledModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
}

export function UpdatePasswordControlledModal({
  open,
  onOpenChange,
  userId,
}: UpdatePasswordControlledModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: PasswordForm) =>
      api.post(`/usuarios/reset-senha/`, {
        user_id: userId,
        nova_senha: data.password,
      }),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      reset();
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || "Erro ao alterar senha");
    },
  });

  const onSubmit = (data: PasswordForm) => mutation.mutate(data);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Senha</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nova Senha</label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Confirmar Senha</label>
            <Input type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
