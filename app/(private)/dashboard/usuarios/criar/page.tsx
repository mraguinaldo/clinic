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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { api } from "@/service/data";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const usuarioSchema = z.object({
  nome: z.string().min(1).max(45),
  sobrenome: z.string().min(1).max(45),
  telefone: z.string().min(1).max(13),
  email: z.string().email(),
  password: z.string().min(1).max(128),
  tipo: z.enum(["admin", "funcionario", "paciente"]),
  genero: z.enum(["M", "F"]),
  data_nascimento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido"),
  is_active: z.boolean().optional(),
  is_staff: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
  img: z
    .any()
    .refine(
      (files) => !files || (files instanceof FileList && files.length > 0),
      "Selecione um arquivo"
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
    defaultValues: {
      is_active: true,
      is_staff: false,
      is_superuser: false,
      tipo: "paciente",
      genero: "M",
    },
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
      return api.post("/usuarios/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });

  const onSubmit = (data: UsuarioForm) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast("Usuário criado com sucesso!");
        router.push("/dashboard/usuarios");
      },
      onError: () => {
        toast("Erro ao criar usuário");
      },
    });
  };

  return (
    <Card className="mx-auto mt-10 w-full">
      <CardHeader>
        <CardTitle>Cadastro de Usuário</CardTitle>
        <CardDescription>
          Preencha os campos para criar um novo usuário.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
            <Input {...register("telefone")} />
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
            <Label>Tipo</Label>
            <Select {...register("tipo")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="funcionario">Funcionário</SelectItem>
                <SelectItem value="paciente">Paciente</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p className="text-red-500">{errors.tipo.message}</p>
            )}
          </div>

          <div>
            <Label>Gênero</Label>
            <Select {...register("genero")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
              </SelectContent>
            </Select>
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

          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox {...register("is_active")} id="is_active" />
              <Label htmlFor="is_active">Usuário Ativo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("is_staff")} id="is_staff" />
              <Label htmlFor="is_staff">Usuário Funcionário</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox {...register("is_superuser")} id="is_superuser" />
              <Label htmlFor="is_superuser">Superuser</Label>
            </div>
          </div>

          <Button type="submit" className="mt-4">
            Cadastrar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
