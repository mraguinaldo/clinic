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
  tipo: z.enum(["admin", "funcionario", "paciente"]),
  is_active: z.boolean().optional(),
  is_staff: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
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
      onError: (err: any) => {
        const message = err.response?.data
          ? Object.values(err.response.data).flat().join("\n")
          : "Erro ao criar usuário";

        toast.error(message);
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
