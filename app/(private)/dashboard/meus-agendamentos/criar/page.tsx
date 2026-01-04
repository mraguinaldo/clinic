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

/* =======================
   ZOD SCHEMA
======================= */

const agendamentoSchema = z
  .object({
    paciente_id: z.number().int().positive("Selecione um paciente"),
    doutor_id: z.number().int().positive("Selecione um doutor"),
    agendamento_tipo: z.enum(["Presencial", "Online"]),
    data: z.string().min(1, "Data obrigatória"),
    hora_inicio: z.string().min(1, "Hora início obrigatória"),
    hora_fim: z.string().min(1, "Hora fim obrigatória"),
    meeting_link: z.string().optional(),
  })
  .refine(
    (data) =>
      data.agendamento_tipo === "Presencial" ||
      (data.agendamento_tipo === "Online" &&
        !!data.meeting_link &&
        data.meeting_link.length > 5),
    {
      message: "Link da reunião é obrigatório para agendamento online",
      path: ["meeting_link"],
    }
  );

type AgendamentoForm = z.infer<typeof agendamentoSchema>;

/* =======================
   COMPONENTE
======================= */

export default function CadastroAgendamentoForm() {
  const router = useRouter();
  const [selectedMedicoEmail, setSelectedMedicoEmail] = useState("");
  const [selectedPacienteEmail, setSelectedPacienteEmail] = useState("");

  /* =======================
     QUERIES
  ======================= */

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

  /* =======================
     FORM
  ======================= */

  const {
    control,
    register,
    handleSubmit,
    watch,
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
      meeting_link: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: any) => api.post("/agendamentos/", payload),
  });

  /* =======================
     SUBMIT
  ======================= */

  const { data: agendamentos = [] } = useQuery<any[]>({
    queryKey: ["agendamentos"],
    queryFn: async () => {
      const res = await api.get("/agendamentos/");
      return res.data;
    },
  });

  const onSubmit = (data: AgendamentoForm) => {
    const paciente = pacientes.find((p: any) => p.id === data.paciente_id);
    const medico = medicos.find((m: any) => m.id === data.doutor_id);

    if (!paciente || !medico) {
      toast.error("Paciente ou médico inválido");
      return;
    }

    const agendamentosDoDoutor = agendamentos.filter(
      (a) => a.doutor.id === data.doutor_id && a.data === data.data
    );

    const conflito = agendamentosDoDoutor.some(
      (a) =>
        (data.hora_inicio >= a.hora_inicio && data.hora_inicio < a.hora_fim) ||
        (data.hora_fim > a.hora_inicio && data.hora_fim <= a.hora_fim)
    );

    if (conflito) {
      toast.error("Este médico já possui agendamento neste horário.");
      return;
    }

    if (data.hora_inicio >= data.hora_fim) {
      toast.error("Hora de fim deve ser maior que hora de início");
      return;
    }

    const payload = {
      paciente_id: data.paciente_id,
      doutor_id: data.doutor_id,
      agendamento_tipo: data.agendamento_tipo.toUpperCase(),
      data: data.data,
      hora_inicio: data.hora_inicio,
      hora_fim: data.hora_fim,
      meeting_link:
        data.agendamento_tipo === "Online" ? data.meeting_link : null,

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
      onError: (error: any) => {
        const msg = error?.response?.data?.non_field_errors?.[0];
        if (msg) toast.error(msg);
        else toast.error("Erro ao criar agendamento");
      },
    });
  };

  if (loadingMedicos || loadingPacientes) return <p>Carregando...</p>;

  /* =======================
     RENDER
  ======================= */

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
          {/* TIPO */}
          <div>
            <Label>Tipo de Agendamento</Label>
            <Controller
              name="agendamento_tipo"
              control={control}
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
          </div>

          {/* LINK REUNIÃO */}
          {watch("agendamento_tipo") === "Online" && (
            <div>
              <Label>Link da Reunião</Label>
              <Input
                type="url"
                placeholder="https://meet.google.com/..."
                {...register("meeting_link")}
              />
              {errors.meeting_link && (
                <p className="text-red-500">{errors.meeting_link.message}</p>
              )}
            </div>
          )}

          {/* DATA */}
          <div>
            <Label>Data</Label>
            <Input
              type="date"
              {...register("data")}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* HORA INICIO */}
          <div>
            <Label>Hora Início</Label>
            <Input type="time" {...register("hora_inicio")} />
          </div>

          {/* HORA FIM */}
          <div>
            <Label>Hora Fim</Label>
            <Input type="time" {...register("hora_fim")} />
          </div>

          {/* MÉDICO */}
          <div>
            <Label>Médico</Label>
            <Controller
              name="doutor_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(val) => {
                    field.onChange(Number(val));
                    const m = medicos.find((x: any) => x.id === Number(val));
                    setSelectedMedicoEmail(m?.funcionario.usuario.email || "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o médico">
                      {selectedMedicoEmail}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {medicos.map((m: any) => (
                      <SelectItem key={m.id} value={m.id.toString()}>
                        {m.funcionario.usuario.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

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

          <Button type="submit" className="mt-4">
            Criar Agendamento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
