/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/service/data";

export async function resolveUserRole(user: any) {
  if (user.tipo !== "funcionario") return user;

  const funcionarios = (await api.get("/funcionarios/")).data;

  const funcionario = funcionarios.find((f: any) => f?.usuario?.id === user.id);

  if (!funcionario) return user;

  return {
    ...user,
    tipo: funcionario.cargo.toLowerCase(),
    cargo: funcionario.cargo,
    funcionario_id: funcionario.id,
  };
}
