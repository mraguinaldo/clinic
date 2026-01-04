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

// Zod Schema atualizado para novo Agendamento
const agendamentoSchema = z.object({
  paciente_id: z.number().int().positive({ message: "Selecione um paciente" }),
  doutor_id: z.number().int().positive({ message: "Selecione um doutor" }),
  agendamento_tipo: z.enum(["Presencial", "Online"], {
    errorMap: () => ({ message: "Selecione o tipo de agendamento" }),
  }),
  data: z.string().min(1, "Data obrigatória"),
  hora_inicio: z.string().min(1, "Hora início obrigatória"),
  hora_fim: z.string().min(1, "Hora fim obrigatória"),
});

type AgendamentoForm = z.infer<typeof agendamentoSchema>;

export default function CadastroAgendamentoForm() {
  const router = useRouter();
  const [selectedMedicoEmail, setSelectedMedicoEmail] = useState("");
  const [selectedPacienteEmail, setSelectedPacienteEmail] = useState("");

  // Query Médicos
  const { data: medicos = [], isLoading: loadingMedicos } = useQuery({
    queryKey: ["medicos"],
    queryFn: async () => {
      const res = await api.get("/medicos/");
      return res.data;
    },
  });

  // Query Pacientes
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
      paciente_id: undefined,
      doutor_id: undefined,
      agendamento_tipo: "Presencial",
      data: "",
      hora_inicio: "",
      hora_fim: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: any) => api.post("/agendamentos/", payload),
  });

  const onSubmit = (data: AgendamentoForm) => {
    const paciente = pacientes.find((p: any) => p.id === data.paciente_id);
    const medico = medicos.find((m: any) => m.id === data.doutor_id);

    if (!paciente || !medico) {
      toast.error("Paciente ou médico inválido");
      return;
    }

    const payload = {
      paciente_id: data.paciente_id,
      doutor_id: data.doutor_id,
      agendamento_tipo: data.agendamento_tipo.toUpperCase(),
      data: data.data,
      hora_inicio: data.hora_inicio,
      hora_fim: data.hora_fim,

      // Dados automáticos do paciente
      cod_medico: paciente.cod_medico,
      tipo_sanguineo: paciente.tipo_sanguineo,
      peso: paciente.peso,
      altura: paciente.altura,

      // Dados automáticos do médico
      especialidade: medico.especialidade,
      num_ordem_medicos: medico.num_ordem_medicos,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Agendamento criado com sucesso!");
        router.push("/dashboard/agendamentos");
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.non_field_errors[0];
        if (errorMessage === "O doutor não está disponível neste horário.") {
          toast.error("O doutor não está disponível neste horário.");
        } else if (
          errorMessage === "A hora de início deve ser menor que a hora de fim."
        ) {
          toast.error("A hora de início deve ser menor que a hora de fim.");
        } else {
          toast.error("Erro ao criar agendamento");
        }
      },
    });
  };

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
          {/* Tipo de Agendamento */}
          <div>
            <Label>Tipo de Agendamento</Label>
            <Controller
              name="agendamento_tipo"
              control={control}
              defaultValue="Presencial"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.agendamento_tipo && (
              <p className="text-red-500">{errors.agendamento_tipo.message}</p>
            )}
          </div>

          {/* Data */}
          <div>
            <Label>Data</Label>
            <Input
              type="date"
              {...register("data")}
              min={new Date().toISOString().split("T")[0]} // desabilita datas passadas
            />
            {errors.data && (
              <p className="text-red-500">{errors.data.message}</p>
            )}
          </div>

          {/* Hora Início */}
          <div>
            <Label>Hora Início</Label>
            <Input type="time" {...register("hora_inicio")} />
            {errors.hora_inicio && (
              <p className="text-red-500">{errors.hora_inicio.message}</p>
            )}
          </div>

          {/* Hora Fim */}
          <div>
            <Label>Hora Fim</Label>
            <Input type="time" {...register("hora_fim")} />
            {errors.hora_fim && (
              <p className="text-red-500">{errors.hora_fim.message}</p>
            )}
          </div>

          {/* Médico */}
          <div>
            <Label>Profissional (Médico)</Label>
            <Controller
              name="doutor_id"
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
            {errors.doutor_id && (
              <p className="text-red-500">{errors.doutor_id.message}</p>
            )}
          </div>

          {/* Paciente */}
          <div>
            <Label>Paciente</Label>
            <Controller
              name="paciente_id"
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
            {errors.paciente_id && (
              <p className="text-red-500">{errors.paciente_id.message}</p>
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
