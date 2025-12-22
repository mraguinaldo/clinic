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
import { ArrowLeft } from "lucide-react";
import { Medico } from "../interface";
import { Funcionario } from "../../funcionarios/interface";

export default function CriarMedico() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [usuario, setUsuario] = useState<number | null>(null);
  const [especialidade, setEspecialidade] = useState("Cardiologia");
  const [numOrdem, setNumOrdem] = useState("");

  const { data: medicos = [] } = useQuery<Medico[]>({
    queryKey: ["medicos"],
    queryFn: async () => {
      const res = await api.get("/medicos/");
      return res.data;
    },
  });

  const { data: medicoUsers = [] } = useQuery<Funcionario[]>({
    queryKey: ["funcionarios", medicos],
    queryFn: async () => {
      const res = await api.get("/funcionarios/");
      return res.data.filter((usuario: Funcionario) => {
        const isTipoValido = usuario.cargo === "medico";

        const jaEhFuncionario = medicos.some(
          (func) => func?.funcionario?.id === usuario.id
        );

        return isTipoValido && !jaEhFuncionario;
      });
    },
  });

  const createMedicoMutation = useMutation({
    mutationFn: async () =>
      api.post("/medicos/", {
        funcionario_id: usuario,
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
              {medicoUsers.map((medico) => (
                <SelectItem key={medico?.id} value={medico?.id.toString()}>
                  {medico?.usuario?.nome} {medico?.usuario.sobrenome} (
                  {medico?.usuario?.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
