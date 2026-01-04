/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/service/data";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserDataStore } from "@/store/use-user-data-store";
import {
  Users,
  UserCheck,
  Calendar,
  FileText,
  DollarSign,
  ClipboardCheck,
} from "lucide-react";

interface StatCardProps {
  title: string;
  count: number;
  href: string;
  icon: any;
}

function StatCard({ title, count, href, icon: Icon }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer hover:shadow-md transition">
        <CardHeader className="flex items-start mt-1 gap-2">
          <Icon className="w-6 h-6 text-gray-600" />
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{count}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useUserDataStore();

  // Queries
  const { data: usuarios = [] } = useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => (await api.get("/usuarios/")).data,
    enabled: user?.tipo === "admin",
  });

  const { data: pacientes = [] } = useQuery({
    queryKey: ["pacientes"],
    queryFn: async () => (await api.get("/pacientes/")).data,
  });

  const { data: funcionarios = [] } = useQuery({
    queryKey: ["funcionarios"],
    queryFn: async () => (await api.get("/funcionarios/")).data,
  });

  const { data: medicos = [] } = useQuery({
    queryKey: ["medicos"],
    queryFn: async () => (await api.get("/medicos/")).data,
  });

  const { data: recepcionistas = [] } = useQuery({
    queryKey: ["recepcionistas"],
    queryFn: async () => (await api.get("/recepcionistas/")).data,
  });

  const { data: agendamentos = [] } = useQuery({
    queryKey: ["agendamentos"],
    queryFn: async () => (await api.get("/agendamentos/")).data,
  });

  const { data: consultas = [] } = useQuery({
    queryKey: ["consultas"],
    queryFn: async () => (await api.get("/consultas/")).data,
  });

  const { data: exames = [] } = useQuery({
    queryKey: ["exames"],
    queryFn: async () => (await api.get("/exames/")).data,
  });

  const { data: prescricoes = [] } = useQuery({
    queryKey: ["prescricoes"],
    queryFn: async () => (await api.get("/prescricoes/")).data,
  });

  const agendamentosFiltrados =
    user?.tipo === "paciente"
      ? agendamentos.filter((a: any) => a.paciente === user.id)
      : agendamentos;

  const consultasFiltradas =
    user?.tipo === "paciente"
      ? consultas.filter((c: any) => {
          const agendamento = agendamentos.find(
            (a: any) => a.id === c.agendamento
          );
          return agendamento?.paciente === user.id;
        })
      : consultas;

  const examesFiltrados =
    user?.tipo === "paciente"
      ? exames.filter((e: any) => {
          const consulta = consultas.find((c: any) => c.id === e.consulta);
          const agendamento = consulta
            ? agendamentos.find((a: any) => a.id === consulta.agendamento)
            : null;
          return agendamento?.paciente === user.id;
        })
      : exames;

  const prescricoesFiltradas =
    user?.tipo === "paciente"
      ? prescricoes.filter((p: any) => {
          const consulta = consultas.find((c: any) => c.id === p.consulta);
          const agendamento = consulta
            ? agendamentos.find((a: any) => a.id === consulta.agendamento)
            : null;
          return agendamento?.paciente === user.id;
        })
      : prescricoes;

  // Configuração de cards por tipo de usuário
  const cardsMap: Record<string, StatCardProps[]> = {
    admin: [
      {
        title: "Total Usuários",
        count: usuarios.length,
        href: "/dashboard/usuarios",
        icon: Users,
      },
      {
        title: "Total Pacientes",
        count: pacientes.length,
        href: "/dashboard/pacientes",
        icon: UserCheck,
      },
      {
        title: "Total Funcionários",
        count: funcionarios.length,
        href: "/dashboard/funcionarios",
        icon: Users,
      },
      {
        title: "Total Médicos",
        count: medicos.length,
        href: "/dashboard/medicos",
        icon: Users,
      },
      {
        title: "Total Recepcionistas",
        count: recepcionistas.length,
        href: "/dashboard/recepcionistas",
        icon: Users,
      },
      {
        title: "Agendamentos",
        count: agendamentos.length,
        href: "/dashboard/agendamentos",
        icon: Calendar,
      },
      {
        title: "Consultas",
        count: consultas.length,
        href: "/dashboard/consultas",
        icon: Calendar,
      },
      {
        title: "Exames",
        count: exames.length,
        href: "/dashboard/exames",
        icon: FileText,
      },
      {
        title: "Prescrições",
        count: prescricoes.length,
        href: "/dashboard/prescricoes",
        icon: ClipboardCheck,
      },
    ],
    funcionario: [
      {
        title: "Agendamentos",
        count: agendamentos.length,
        href: "/dashboard/agendamentos",
        icon: Calendar,
      },
      {
        title: "Consultas",
        count: consultas.length,
        href: "/dashboard/consultas",
        icon: Calendar,
      },
      {
        title: "Exames",
        count: exames.length,
        href: "/dashboard/exames",
        icon: FileText,
      },
    ],
    paciente: [
      {
        title: "Meus Agendamentos",
        count: agendamentosFiltrados.length,
        href: "/dashboard/meus-agendamentos",
        icon: Calendar,
      },
      {
        title: "Minhas Consultas",
        count: consultasFiltradas.length,
        href: "/dashboard/minhas-consultas",
        icon: Calendar,
      },
      {
        title: "Meus Exames",
        count: examesFiltrados.length,
        href: "/dashboard/meus-exames",
        icon: FileText,
      },
      {
        title: "Minhas Prescrições Médicas",
        count: prescricoesFiltradas.length,
        href: "/dashboard/minhas-prescricoes",
        icon: ClipboardCheck,
      },
    ],
    recepcionista: [
      {
        title: "Agendamentos",
        count: agendamentos.length,
        href: "/dashboard/agendamentos",
        icon: Calendar,
      },
      {
        title: "Pagamentos",
        count: 0,
        href: "/dashboard/pagamentos",
        icon: DollarSign,
      },
      {
        title: "Pacientes",
        count: pacientes.length,
        href: "/dashboard/pacientes",
        icon: UserCheck,
      },
    ],
  };

  const userCards = user ? cardsMap[user.tipo] || [] : [];

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {userCards.map((card) => (
          <StatCard key={card.href} {...card} />
        ))}
      </div>
    </div>
  );
}
