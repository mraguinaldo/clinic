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
import { Paciente } from "../interface";

const bloodTypes = ["A+", "A-", "B-", "AB+", "AB-", "O+", "O-"];

export default function CriarPaciente() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [usuario, setUsuario] = useState<number | null>(null);
  const [codMedico, setCodMedico] = useState("");
  const [tipoSanguineo, setTipoSanguineo] = useState(bloodTypes[0]);
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");

  const { data: pacientes = [] } = useQuery<Paciente[]>({
    queryKey: ["pacientes"],
    queryFn: async () => {
      const res = await api.get("/pacientes/");
      return res.data;
    },
  });

  const { data: users = [] } = useQuery<Usuario[]>({
    queryKey: ["usuarios-pacientes", pacientes],
    queryFn: async () => {
      const res = await api.get("/usuarios/");

      const pacientesIds = new Set(
        pacientes.map((paciente) => paciente.usuario.id)
      );

      return res.data.filter((usuario: Usuario) => {
        const isPaciente = usuario.tipo === "paciente";
        const jaEhPaciente = pacientesIds.has(usuario.id);

        return isPaciente && !jaEhPaciente;
      });
    },
  });

  const createPacienteMutation = useMutation({
    mutationFn: async () =>
      api.post("/pacientes/", {
        usuario_id: usuario,
        cod_medico: codMedico,
        tipo_sanguineo: tipoSanguineo.toLowerCase(),
        peso,
        altura,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      router.push("/dashboard/pacientes");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPacienteMutation.mutate();
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-xl font-semibold mb-4">Cadastrar Paciente</h1>
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
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id.toString()}>
                  {u.nome} {u.sobrenome} ({u.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Código Médico</label>
          <Input
            value={codMedico}
            onChange={(e) => setCodMedico(e.target.value)}
            maxLength={32}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Tipo Sanguíneo</label>
          <Select value={tipoSanguineo} onValueChange={setTipoSanguineo}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione tipo sanguíneo" />
            </SelectTrigger>
            <SelectContent>
              {bloodTypes.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Peso */}
        <div>
          <label className="block font-semibold mb-1">Peso (kg)</label>
          <Input
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            required
          />
        </div>

        {/* Altura */}
        <div>
          <label className="block font-semibold mb-1">Altura (m)</label>
          <Input
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={createPacienteMutation.isPending}>
          {createPacienteMutation.isPending
            ? "Salvando..."
            : "Cadastrar Paciente"}
        </Button>
      </form>
    </div>
  );
}
