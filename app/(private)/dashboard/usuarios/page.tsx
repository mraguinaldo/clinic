"use client";

import { Separator } from "@/components/ui/separator";
import { UserList } from "@/components/user-list";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="w-full">
      <div>
        <h1 className="text-3xl font-bold mb-6">Usuarios</h1>
        <p className="text-gray-600 mb-4">
          Gerencie os usuários do sistema aqui. Você pode adicionar, editar ou
          remover usuários conforme necessário.
        </p>
      </div>

      <Separator className="my-6" />
      <div className="flex flex-col justify-end w-full">
        <Link
          className="mb-4 btn btn-primary self-end"
          href="/dashboard/usuarios/criar"
        >
          Adicionar Usuário
        </Link>
        <UserList />
      </div>
    </div>
  );
}
