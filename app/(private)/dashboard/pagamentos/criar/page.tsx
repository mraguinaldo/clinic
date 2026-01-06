/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/service/data";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
}

type PagamentoForm = z.infer<typeof pagamentoSchema>;

/* =======================
   SCHEMA ZOD
======================= */

const pagamentoSchema = z.object({
  consulta_id: z.number().int().positive("Selecione uma consulta"),
  paciente_id: z.number().int().positive("Selecione um paciente"),
  valor: z.string().min(1, "Valor obrigatório"),
  metodo_pagamento: z.enum(["DINHEIRO", "CARTAO", "PIX"]),
  status: z.enum(["PENDENTE", "PAGO", "CANCELADO"]),
  data_pagamento: z.string().optional(),
});

/* =======================
   COMPONENTE
======================= */

export default function CadastroPagamentoForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedPacienteEmail, setSelectedPacienteEmail] = useState("");

  /* =======================
     QUERIES
  ======================== */

  const { data: pacientes = [], isLoading: loadingPacientes } = useQuery({
    queryKey: ["pacientes"],
    queryFn: async () => (await api.get("/pacientes/")).data,
  });

  const { data: consultas = [], isLoading: loadingConsultas } = useQuery({
    queryKey: ["agendamentos"],
    queryFn: async () => (await api.get("/agendamentos/")).data,
  });

  /* =======================
     FORM
  ======================== */

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof pagamentoSchema>>({
    resolver: zodResolver(pagamentoSchema),
    defaultValues: {
      paciente_id: undefined,
      consulta_id: undefined,
      valor: "",
      metodo_pagamento: "DINHEIRO",
      status: "PENDENTE",
      data_pagamento: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: any) => api.post("/pagamentos/", payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] }),
  });

  /* =======================
     SUBMIT
  ======================== */

  const onSubmit = (data: any) => {
    const paciente = pacientes.find((p: any) => p.id === data.paciente_id);
    const consulta = consultas.find((c: any) => c.id === data.consulta_id);

    if (!paciente || !consulta) {
      toast.error("Paciente ou consulta inválido(a)");
      return;
    }

    const payload = {
      ...data,
      paciente_id: data.paciente_id,
      consulta_id: data.consulta_id,
      valor: data.valor,
      metodo_pagamento: data.metodo_pagamento,
      status: data.status,
      data_pagamento: data.data_pagamento || null,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Pagamento criado com sucesso!");
        router.push("/dashboard/pagamentos");
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.non_field_errors?.[0];
        if (msg) toast.error(msg);
        else toast.error("Erro ao criar pagamento");
      },
    });
  };

  if (loadingPacientes || loadingConsultas) return <p>Carregando...</p>;

  const metodoOptions = ["DINHEIRO", "CARTAO", "TRANSFERENCIA"];
  const statusOptions = ["PENDENTE", "PAGO", "CANCELADO"];

  /* =======================
     RENDER
  ======================== */

  return (
    <Card className="mx-auto mt-10 w-full max-w-lg">
      <CardHeader>
        <CardTitle>Criar Pagamento</CardTitle>
        <CardDescription>
          Preencha os campos para criar um novo pagamento.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* PACIENTE */}
          <div>
            <Label>Paciente</Label>
            <Controller
              name="paciente_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(val) => {
                    field.onChange(Number(val));
                    const p = pacientes.find((x: any) => x.id === Number(val));
                    setSelectedPacienteEmail(p?.usuario.email || "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente">
                      {selectedPacienteEmail}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map((p: any) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.usuario.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* CONSULTA */}
          <div>
            <Label>Consulta</Label>
            <Controller
              name="consulta_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a consulta" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultas.map((c: any) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        Consulta #{c.id} - {c.paciente.usuario.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* VALOR */}
          <div>
            <Label>Valor</Label>
            <Input type="text" {...register("valor")} />
            {errors.valor && (
              <p className="text-red-500">{errors.valor.message}</p>
            )}
          </div>

          {/* METODO */}
          <div>
            <Label>Método Pagamento</Label>
            <Controller
              name="metodo_pagamento"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    {metodoOptions.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* STATUS */}
          <div>
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* DATA PAGAMENTO */}
          <div>
            <Label>Data Pagamento</Label>
            <Input type="date" {...register("data_pagamento")} />
          </div>

          <Button type="submit" className="mt-4">
            Criar Pagamento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
