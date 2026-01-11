/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api } from "@/service/data";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

const usuarioSchema = z.object({
  nome: z
    .string({ message: "O nome é obrigatório" })
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(45, "O nome deve ter no máximo 45 caracteres"),

  sobrenome: z
    .string({ message: "O sobrenome é obrigatório" })
    .min(2, "O sobrenome deve ter no mínimo 2 caracteres")
    .max(45, "O sobrenome deve ter no máximo 45 caracteres"),

  telefone: z
    .string({ message: "O telefone é obrigatório" })
    .min(9, "O telefone deve ter 9 dígitos")
    .max(9, "O telefone deve ter 9 dígitos"),

  email: z
    .string({ message: "O e-mail é obrigatório" })
    .email("Formato de e-mail inválido"),

  password: z
    .string({ message: "A senha é obrigatória" })
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(128, "A senha deve ter no máximo 128 caracteres"),

  genero: z.enum(["M", "F"], { required_error: "O gênero é obrigatório" }),

  data_nascimento: z
    .string({ message: "A data de nascimento é obrigatória" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato da data deve ser AAAA-MM-DD"),

  img: z
    .any()
    .refine(
      (files) => !files || (files instanceof FileList && files.length > 0),
      "Selecione uma imagem válida"
    )
    .optional(),
});

type UsuarioForm = z.infer<typeof usuarioSchema>;

export default function CadastroUsuarioForm() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UsuarioForm>({
    resolver: zodResolver(usuarioSchema),
  });

  const watchImg = watch("img");

  useEffect(() => {
    if (watchImg && watchImg.length > 0) {
      const file = watchImg[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [watchImg]);

  const mutation = useMutation({
    mutationFn: (data: UsuarioForm) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]: any) => {
        if (value instanceof FileList) {
          if (value[0]) formData.append(key, value[0]);
        } else {
          formData.append(key, value);
        }
      });

      formData.append("tipo", "paciente");
      formData.append("is_active", "true");
      formData.append("is_staff", "false");
      formData.append("is_superuser", "false");

      return api.post("/usuarios/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });

  const onSubmit = (data: UsuarioForm) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast("Usuário criado com sucesso!");
        router.push("/dashboard");
      },
      onError: (err: any) => {
        const message = err.response?.data
          ? Object.values(err.response.data).flat().join("\n")
          : "Erro ao criar usuário";

        toast.error(message);
      },
    });
  };

  return (
    <div className="w-full py-12 m-auto px-2 flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>
            Preencha os campos para criar a sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <Label>Primeiro Nome</Label>
              <Input {...register("nome")} />
              {errors.nome && (
                <p className="text-red-500">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <Label>Sobrenome</Label>
              <Input {...register("sobrenome")} />
              {errors.sobrenome && (
                <p className="text-red-500">{errors.sobrenome.message}</p>
              )}
            </div>

            <div>
              <Label>Telefone</Label>
              <Input type="number" {...register("telefone")} />
              {errors.telefone && (
                <p className="text-red-500">{errors.telefone.message}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input {...register("email")} />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label>Senha</Label>
              <Input type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label>Imagem</Label>
              <Input type="file" {...register("img")} accept="image/*" />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-md"
                />
              )}
              {errors.img && (
                <p className="text-red-500">{errors.img.message as string}</p>
              )}
            </div>

            <div>
              <Label>Gênero</Label>
              <select
                {...register("genero")}
                className="border rounded-md w-full px-2 py-1"
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
              {errors.genero && (
                <p className="text-red-500">{errors.genero.message}</p>
              )}
            </div>

            <div>
              <Label>Data de Nascimento</Label>
              <Input type="date" {...register("data_nascimento")} />
              {errors.data_nascimento && (
                <p className="text-red-500">{errors.data_nascimento.message}</p>
              )}
            </div>

            <Button type="submit" className="mt-4">
              Cadastrar
            </Button>

            <Link href="/login" className="mt-12">
              Já tens uma conta?{" "}
              <span className="text-blue-800 underline">Entrar...</span>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
