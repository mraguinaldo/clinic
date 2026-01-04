/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/service/data";

export function PaymentModal({ open, setOpen, consulta }: any) {
  const [valor, setValor] = useState("");
  const [metodo, setMetodo] = useState("dinheiro");
  const [loading, setLoading] = useState(false);

  if (!open || !consulta) return null;

  async function pagar() {
    setLoading(true);

    await api.post("/pagamentos/", {
      consulta_id: consulta.id,
      paciente_id: consulta.paciente_id,
      cod_medico: consulta.cod_medico,
      tipo_sanguineo: consulta.tipo_sanguineo,
      peso: consulta.peso,
      altura: consulta.altura,
      valor,
      metodo_pagamento: metodo,
    });

    setLoading(false);
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-[420px] space-y-3">
        <h3 className="text-lg font-semibold">Efetuar pagamento</h3>

        <input
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="input"
        />

        <select
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
          className="input"
        >
          <option value="dinheiro">Dinheiro</option>
          <option value="transferencia">Transferência</option>
          <option value="multicaixa">Multicaixa</option>
        </select>

        <div className="flex justify-end gap-2 pt-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button disabled={loading} onClick={pagar}>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}
