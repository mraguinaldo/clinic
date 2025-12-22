/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/service/data";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Funcionario } from "../../funcionarios/interface";

export default function CriarRecepcionista() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [funcionarioId, setFuncionarioId] = useState<number | null>(null);
  const [postoAtendimento, setPostoAtendimento] = useState("principal");

  const { data: recepcionistas = [] } = useQuery<any[]>({
    queryKey: ["recepcionistas"],
    queryFn: async () => {
      const res = await api.get("/recepcionistas/");
      return res.data;
    },
  });

  const { data: funcionariosDisponiveis = [] } = useQuery<Funcionario[]>({
    queryKey: ["funcionarios", "recepcionistas"],
    queryFn: async () => {
      const res = await api.get("/funcionarios/");
      return res.data.filter((f: Funcionario) => {
        const isRecepcionista = f.cargo === "recepcionista";
        const jaCadastrado = recepcionistas.some(
          (r) => r.funcionario?.id === f.id
        );
        return isRecepcionista && !jaCadastrado;
      });
    },
  });

  const createRecepcionistaMutation = useMutation({
    mutationFn: async () =>
      api.post("/recepcionistas/", {
        funcionario_id: funcionarioId,
        posto_atendimento: postoAtendimento,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recepcionistas"] });
      router.push("/dashboard/recepcionistas");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRecepcionistaMutation.mutate();
  };

  const postoOptions = ["principal", "emergencia", "exames", "internamento"];

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-xl font-semibold mb-4">Cadastrar Recepcionista</h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar
        </Button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold mb-1">Funcionário</label>
          <Select
            value={funcionarioId?.toString() || ""}
            onValueChange={(val) => setFuncionarioId(Number(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um funcionário" />
            </SelectTrigger>
            <SelectContent>
              {funcionariosDisponiveis.map((f) => (
                <SelectItem key={f.id} value={f.id.toString()}>
                  {f.usuario.nome} {f.usuario.sobrenome} ({f.usuario.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Posto Atendimento</label>
          <Select value={postoAtendimento} onValueChange={setPostoAtendimento}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o posto de atendimento" />
            </SelectTrigger>
            <SelectContent>
              {postoOptions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={createRecepcionistaMutation.isPending}>
          {createRecepcionistaMutation.isPending
            ? "Salvando..."
            : "Cadastrar Recepcionista"}
        </Button>
      </form>
    </div>
  );
}
