"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "@/service/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
}

export default function CriarFuncionarioPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    usuario_id: "",
    cargo: "",
    departamento: "",
    turno: "",
    nif: "",
    data_admissao: "",
    data_demissao: "",
    anos_experiencia: "",
  });

  const { data: usuarios } = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const res = await api.get("/usuarios/");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () =>
      api.post("/funcionarios/", {
        id: Number(form.usuario_id),
        cargo: form.cargo,
        departamento: form.departamento,
        turno: form.turno,
        nif: form.nif,
        data_admissao: form.data_admissao,
        data_demissao: form.data_demissao || null,
        anos_experiencia: form.anos_experiencia
          ? Number(form.anos_experiencia)
          : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
      router.push("/dashboard/funcionarios");
    },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cadastrar Funcionário</h1>
          <p className="text-sm text-gray-500">
            Preencha os dados do funcionário
          </p>
        </div>

        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar
        </Button>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Usuário</Label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={form.usuario_id}
              onChange={(e) => setForm({ ...form, usuario_id: e.target.value })}
            >
              <option value="">Selecione um usuário</option>
              {usuarios?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome} {u.sobrenome} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Cargo</Label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={form.cargo}
              onChange={(e) => setForm({ ...form, cargo: e.target.value })}
            >
              <option value="">Selecione</option>
              {[
                "administrativo",
                "enfermeiro",
                "farmaceutico",
                "gestor",
                "medico",
                "recepcionista",
                "tecnico",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Departamento</Label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={form.departamento}
              onChange={(e) =>
                setForm({ ...form, departamento: e.target.value })
              }
            >
              <option value="">Selecione</option>
              {["recepcao", "cardiologia", "farmacia", "laboratorio"].map(
                (d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <Label>Turno</Label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={form.turno}
              onChange={(e) => setForm({ ...form, turno: e.target.value })}
            >
              <option value="">Selecione</option>
              {["manhã", "tarde", "noite", "rotativo"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>NIF</Label>
            <Input
              value={form.nif}
              onChange={(e) => setForm({ ...form, nif: e.target.value })}
            />
          </div>

          <div>
            <Label>Data de admissão</Label>
            <Input
              type="date"
              value={form.data_admissao}
              onChange={(e) =>
                setForm({ ...form, data_admissao: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Data de demissão</Label>
            <Input
              type="date"
              value={form.data_demissao}
              onChange={(e) =>
                setForm({ ...form, data_demissao: e.target.value })
              }
            />
          </div>

          <div className="col-span-2">
            <Label>Anos de experiência</Label>
            <Input
              type="number"
              value={form.anos_experiencia}
              onChange={(e) =>
                setForm({
                  ...form,
                  anos_experiencia: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>

          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            <Save className="w-4 h-4 mr-1" />
            Salvar Funcionário
          </Button>
        </div>
      </div>
    </div>
  );
}
