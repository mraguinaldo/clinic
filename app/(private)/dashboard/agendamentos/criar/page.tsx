/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { api } from "@/service/data";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Validação Zod ajustada
const agendamentoSchema = z.object({
  motivo: z.string().min(1, "O motivo é obrigatório").max(500),
  data_consulta: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Data inválida"),
  modelo: z.enum(["presencial", "online"], {
    errorMap: () => ({ message: "Modelo inválido" }),
  }),
  profissional: z
    .number({ invalid_type_error: "Profissional inválido" })
    .int()
    .positive(),
  paciente: z
    .number({ invalid_type_error: "Paciente inválido" })
    .int()
    .positive(),
});

type AgendamentoForm = z.infer<typeof agendamentoSchema>;

export default function CadastroAgendamentoForm() {
  const router = useRouter();

  const { data: medicos = [], isLoading: loadingMedicos } = useQuery({
    queryKey: ["medicos"],
    queryFn: async () => {
      const res = await api.get("/medicos/");
      return res.data;
    },
  });

  const { data: pacientes = [], isLoading: loadingPacientes } = useQuery({
    queryKey: ["pacientes"],
    queryFn: async () => {
      const res = await api.get("/pacientes/");
      return res.data;
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgendamentoForm>({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: {
      motivo: "",
      data_consulta: "",
      modelo: "presencial",
      profissional: undefined,
      paciente: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: AgendamentoForm) => api.post("/agendamentos/", data),
  });

  const onSubmit = (data: AgendamentoForm) => {
    const payload = {
      ...data,
      data_consulta: data.data_consulta
        ? new Date(data.data_consulta).toISOString()
        : null,
      profisional: Number(data.profissional),
      paciente: Number(data.paciente),
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        toast("Agendamento criado com sucesso!");
        router.push("/dashboard/agendamentos");
      },
      onError: () => {
        toast("Erro ao criar agendamento");
      },
    });
  };

  const [selectedMedicoEmail, setSelectedMedicoEmail] = useState("");
  const [selectedPacienteEmail, setSelectedPacienteEmail] = useState("");

  if (loadingMedicos || loadingPacientes) return <p>Carregando...</p>;

  return (
    <Card className="mx-auto mt-10 w-full max-w-lg">
      <CardHeader>
        <CardTitle>Criar Agendamento</CardTitle>
        <CardDescription>
          Preencha os campos para criar um novo agendamento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Motivo */}
          <div>
            <Label>Motivo</Label>
            <Input {...register("motivo")} />
            {errors.motivo && (
              <p className="text-red-500">{errors.motivo.message}</p>
            )}
          </div>

          {/* Data da Consulta */}
          <div>
            <Label>Data da Consulta</Label>
            <Input type="datetime-local" {...register("data_consulta")} />
            {errors.data_consulta && (
              <p className="text-red-500">{errors.data_consulta.message}</p>
            )}
          </div>

          {/* Modelo */}
          <div>
            <Label>Modelo</Label>
            <Controller
              name="modelo"
              control={control}
              defaultValue="presencial"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.modelo && (
              <p className="text-red-500">{errors.modelo.message}</p>
            )}
          </div>

          {/* Profissional */}
          <div>
            <Label>Profissional (Médico)</Label>
            <Controller
              name="profissional"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(val) => {
                    field.onChange(Number(val));
                    const medico = medicos.find(
                      (m: any) => m.id === Number(val)
                    );
                    setSelectedMedicoEmail(
                      medico?.funcionario.usuario.email || ""
                    );
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o médico">
                      {selectedMedicoEmail}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {medicos.map((med: any) => (
                      <SelectItem key={med.id} value={med.id.toString()}>
                        {med.funcionario.usuario.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.profissional && (
              <p className="text-red-500">{errors.profissional.message}</p>
            )}
          </div>

          {/* Paciente */}
          <div>
            <Label>Paciente</Label>
            <Controller
              name="paciente"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(val) => {
                    field.onChange(Number(val));
                    const pac = pacientes.find(
                      (p: any) => p.id === Number(val)
                    );
                    setSelectedPacienteEmail(pac?.usuario.email || "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente">
                      {selectedPacienteEmail}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map((pac: any) => (
                      <SelectItem key={pac.id} value={pac.id.toString()}>
                        {pac.usuario.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paciente && (
              <p className="text-red-500">{errors.paciente.message}</p>
            )}
          </div>

          <Button type="submit" className="mt-4">
            Criar Agendamento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
