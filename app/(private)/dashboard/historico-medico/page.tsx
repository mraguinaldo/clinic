/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/service/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paciente } from "@/app/(private)/dashboard/pacientes/interface";
import { ImageZoomr } from "@mraguinaldo/react-image-zoomr";
import { useState } from "react";
import { EditHistoricoModal } from "@/components/patients-list/modals/edit-historico";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useUserDataStore } from "@/store/use-user-data-store";

interface Historico {
  id: number;
  paciente: Paciente;
  doencas_previas: string;
  alergias: string;
  cirugias: string;
  tratamentos: string;
  observacoes: string;
}

export default function HistoricoMedicoPage() {
  const { user } = useUserDataStore();
  const searchParams = useSearchParams();
  const pacienteId = searchParams.get("pacienteId");
  const pacienteIdNumber = pacienteId ? parseInt(pacienteId) : null;
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const { data: historicos = [], isLoading } = useQuery<Historico[]>({
    queryKey: ["historicos", pacienteIdNumber],
    enabled: !!pacienteIdNumber, // só busca se houver id
    queryFn: async () => {
      const res = await api.get(
        `/historicos-medico/?paciente_id=${pacienteIdNumber}`
      );
      return res.data;
    },
  });

  if (!pacienteIdNumber) return <p>ID do paciente não fornecido.</p>;
  if (isLoading) return <p>Carregando histórico médico...</p>;
  if (!historicos.length)
    return <p>Nenhum histórico encontrado para este paciente.</p>;

  const paciente = historicos[0].paciente;
  const usuario = paciente.usuario;

  return (
    <ScrollArea className="p-4">
      <Button variant="outline" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar
      </Button>
      <div className="mb-6 border rounded-md p-4 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
        <div className="flex items-center gap-4">
          <ImageZoomr
            src={usuario.img || ""}
            width={100}
            height={100}
            borderRadius={100}
            enableZoom={false}
            alt="Paciente"
            className="rounded-full border"
          />

          <div className="flex flex-col gap-1">
            <p>
              <strong>Nome:</strong> {usuario.nome} {usuario.sobrenome}
            </p>
            <p>
              <strong>Email:</strong> {usuario.email}
            </p>
            <p>
              <strong>Telefone:</strong> {usuario.telefone}
            </p>
            <p>
              <strong>Gênero:</strong> {usuario.genero}
            </p>
            <p>
              <strong>Data de Nascimento:</strong> {usuario.data_nascimento}
            </p>
            <p>
              <strong>Tipo de Usuário:</strong> {usuario.tipo}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 border rounded-md p-4 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Informações do Paciente</h2>
        <p>
          <strong>Tipo Sanguíneo:</strong>{" "}
          {paciente.tipo_sanguineo.toUpperCase()}
        </p>
        <p>
          <strong>Peso:</strong> {paciente.peso} kg
        </p>
        <p>
          <strong>Altura:</strong> {paciente.altura} m
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {user?.tipo !== "paciente" && (
          <button
            onClick={() => setEditOpen(true)}
            className="absolute top-4 right-4 bg-gray-900 text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-800"
          >
            Atualizar Histórico Médico
          </button>
        )}
        {historicos.map((h) => (
          <div key={h.id} className="border rounded-md p-4 shadow-sm bg-white">
            <h3 className="text-lg font-semibold mb-2">Histórico #{h.id}</h3>
            <div className="flex flex-col gap-2">
              {[
                "doencas_previas",
                "alergias",
                "cirugias",
                "tratamentos",
                "observacoes",
              ].map((field) => (
                <div key={field}>
                  <p className="font-semibold">
                    {field.replace("_", " ").toUpperCase()}:
                  </p>
                  {(h as any)[field]
                    .split("\n")
                    .map((line: string, idx: number) => (
                      <p key={idx}>{line}</p>
                    ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <EditHistoricoModal
        open={editOpen}
        setOpen={setEditOpen}
        historico={historicos[0]}
      />
    </ScrollArea>
  );
}
