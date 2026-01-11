/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "@mraguinaldo/react-image-zoomr/dist/index.css";
import { useUserDataStore } from "@/store/use-user-data-store";
import { ImageZoomr } from "@mraguinaldo/react-image-zoomr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  FileText,
  DollarSign,
  Lock,
  Home,
  Activity,
  Book,
} from "lucide-react";
import { UpdatePasswordModal } from "../update-password";
import Image from "next/image";

export function Sidebar() {
  const { user, logout } = useUserDataStore();
  const router = useRouter();

  const menus: Record<string, any[]> = {
    admin: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Usuários", href: "/dashboard/usuarios", icon: Users },
      { label: "Pacientes", href: "/dashboard/pacientes", icon: UserCheck },
      { label: "Funcionários", href: "/dashboard/funcionarios", icon: Users },
      { label: "Médicos", href: "/dashboard/medicos", icon: Users },
      {
        label: "Recepcionistas",
        href: "/dashboard/recepcionistas",
        icon: Users,
      },
      {
        label: "Disponibilidade Médica",
        href: "/dashboard/disponibilidade-medico",
        icon: Calendar,
      },
      {
        label: "Agendamentos",
        href: "/dashboard/agendamentos",
        icon: Calendar,
      },
      { label: "Consultas", href: "/dashboard/consultas", icon: Calendar },
      { label: "Prescrições", href: "/dashboard/prescricoes", icon: FileText },
      { label: "Pagamentos", href: "/dashboard/pagamentos", icon: DollarSign },
      { label: "Farmácia", href: "/dashboard/farmacia", icon: Home },
      { label: "Atualizar Senha", href: "#", icon: Lock, modal: true },
    ],

    paciente: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      {
        label: "Meus Agendamentos",
        href: "/dashboard/meus-agendamentos",
        icon: Calendar,
      },
      {
        label: "Minhas Consultas",
        href: "/dashboard/minhas-consultas",
        icon: Calendar,
      },
      { label: "Meus Exames", href: "/dashboard/meus-exames", icon: FileText },
      {
        label: "Minhas Prescrições Médicas",
        href: "/dashboard/minhas-prescricoes",
        icon: FileText,
      },
      {
        label: "Meu histórico",
        href: `/dashboard/historico-medico?pacienteId=${user?.id}`,
        icon: Book,
      },
      { label: "Atualizar Senha", href: "#", icon: Lock, modal: true },
    ],

    administrativo: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Pacientes", href: "/dashboard/pacientes", icon: UserCheck },
      {
        label: "Agendamentos",
        href: "/dashboard/agendamentos",
        icon: Calendar,
      },
      { label: "Atualizar Senha", href: "#", icon: Lock, modal: true },
    ],

    enfermeiro: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      {
        label: "Aprovar/Rejeitar Consultas",
        href: "/dashboard/consultas",
        icon: Calendar,
      },
      {
        label: "Aprovar/Rejeitar Exames",
        icon: FileText,
      },
      { label: "Atualizar Senha", href: "#", icon: Lock, modal: true },
    ],

    farmaceutico: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Prescrições", href: "/dashboard/prescricoes", icon: FileText },
      { label: "Farmácia", href: "/dashboard/farmacia", icon: Home },
      { label: "Atualizar Senha", href: "#", icon: Lock, modal: true },
    ],

    gestor: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Usuários", href: "/dashboard/usuarios", icon: Users },
      { label: "Funcionários", href: "/dashboard/funcionarios", icon: Users },
      { label: "Relatórios", href: "/dashboard/relatorios", icon: FileText },
      { label: "Atualizar Senha", href: "#", icon: Lock, modal: true },
    ],

    medico: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Consultas", href: "/dashboard/consultas", icon: Calendar },
      { label: "Exames", href: "/dashboard/exames", icon: FileText },
      { label: "Pacientes", href: "/dashboard/pacientes", icon: UserCheck },
      {
        label: "Agendamentos",
        href: "/dashboard/agendamentos",
        icon: Calendar,
      },
      { label: "Prescrições", href: "/dashboard/prescricoes", icon: FileText },
      {
        label: "Disponibilidade Médica",
        href: "/dashboard/disponibilidade-medico",
        icon: Calendar,
      },
      { label: "Atualizar Senha", href: "#", icon: Lock, modal: true },
    ],

    recepcionista: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      {
        label: "Marcar Consulta",
        href: "/dashboard/marcar-consulta",
        icon: Calendar,
      },
      {
        label: "Efetuar Pagamento",
        href: "/dashboard/pagamentos",
        icon: DollarSign,
      },
      { label: "Pacientes", href: "/dashboard/pacientes", icon: UserCheck },
      { label: "Atualizar Senha", href: "#", icon: Lock, modal: true },
    ],

    tecnico: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Atualizar Senha", href: "#", icon: Lock, modal: true },
    ],
  };

  const userMenus = user ? menus[user.tipo] || [] : [];

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm fixed z-50 flex flex-col justify-between">
      <div>
        <div>
          <Image
            src="/header/logo.png"
            alt="logo"
            width={274}
            height={72}
            className="object-contain"
          />
        </div>

        <nav className="flex flex-col gap-2 p-4 h-[500px] overflow-y-auto">
          {userMenus.map((menu: any) => {
            const Icon = menu.icon;

            if (menu.modal) {
              return (
                <div key={menu.label} className="flex items-start gap-2">
                  <Icon className="w-5 h-5 text-gray-600 mt-1" />
                  <UpdatePasswordModal userId={user?.id as any} />
                </div>
              );
            }

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className="flex items-start gap-2 p-2 rounded hover:bg-gray-100"
              >
                <Icon className="w-5 h-5 text-gray-600 mt-1" />
                <span>{menu.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {user && (
        <div className="p-4 border-t w-full flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div>
              <ImageZoomr
                src={user?.img as string}
                alt={user?.nome}
                objectFit="cover"
                borderRadius={100}
                height={48}
                width={48}
                imageClass="border-2 border-gray-100"
                enableZoom={false}
              />
            </div>

            <div className="flex-1 w-[120px]">
              <div className="font-semibold truncate">
                {user.nome} {user.sobrenome}
              </div>
              <div className="text-sm text-gray-500 truncate">{user.email}</div>
              <div className="text-xs text-gray-400 capitalize">
                {user.tipo === "administrativo"
                  ? "Administrativo"
                  : user.tipo === "enfermeiro"
                  ? "Enfermeiro"
                  : user.tipo === "farmaceutico"
                  ? "Farmacêutico"
                  : user.tipo === "gestor"
                  ? "Gestor"
                  : user.tipo === "medico"
                  ? "Médico"
                  : user.tipo === "recepcionista"
                  ? "Recepcionista"
                  : user.tipo === "tecnico"
                  ? "Técnico"
                  : user.tipo === "admin"
                  ? "Administrador"
                  : "Paciente"}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-[14px] whitespace-nowrap w-full justify-center"
          >
            <Activity className="w-4 h-4" />
            Terminar sessão
          </button>
        </div>
      )}
    </div>
  );
}
