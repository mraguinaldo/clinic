"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/service/data";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Usuario } from "@/components/user-list";
import { ArrowLeft } from "lucide-react";

export default function CriarMedico() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [usuario, setUsuario] = useState<number | null>(null);
  const [especialidade, setEspecialidade] = useState("Cardiologia");
  const [numOrdem, setNumOrdem] = useState("");

  const { data: users = [] } = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const res = await api.get("/usuarios/");
      return res.data;
    },
  });

  const medicoUsers = users.filter((u) => u?.tipo === "funcionario");

  const createMedicoMutation = useMutation({
    mutationFn: async () =>
      api.post("/medicos/", {
        usuario: `/usuarios/${usuario}`,
        especialidade,
        num_ordem_medicos: numOrdem,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicos"] });
      router.push("/dashboard/medicos");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMedicoMutation.mutate();
  };

  const especialidadeOptions = [
    "Cardiologia",
    "Dermatologia",
    "Pediatria",
    "Ginecologia",
    "Ortopedia",
    "Neurologia",
    "Oftalmologia",
    "Psiquiatria",
  ];

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-xl font-semibold mb-4">Cadastrar Médico</h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar
        </Button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Usuário */}
        <div>
          <label className="block font-semibold mb-1">Usuário</label>
          <Select
            value={usuario?.toString() || ""}
            onValueChange={(val) => setUsuario(Number(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              {medicoUsers.map((u) => (
                <SelectItem key={u.id} value={u.id.toString()}>
                  {u.nome} {u.sobrenome} ({u.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Especialidade */}
        <div>
          <label className="block font-semibold mb-1">Especialidade</label>
          <Select value={especialidade} onValueChange={setEspecialidade}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione especialidade" />
            </SelectTrigger>
            <SelectContent>
              {especialidadeOptions.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Número da Ordem */}
        <div>
          <label className="block font-semibold mb-1">Número da Ordem</label>
          <Input
            value={numOrdem}
            onChange={(e) => setNumOrdem(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={createMedicoMutation.isPending}>
          {createMedicoMutation.isPending ? "Salvando..." : "Cadastrar Médico"}
        </Button>
      </form>
    </div>
  );
}
