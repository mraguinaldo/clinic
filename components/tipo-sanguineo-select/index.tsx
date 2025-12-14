/* eslint-disable react-hooks/set-state-in-effect */
import { Paciente } from "@/app/(private)/dashboard/pacientes/interface";
import { useState, useEffect } from "react";

interface Props {
  paciente: Paciente;
  bloodTypes: string[];
  onUpdate: (field: string, value: string) => void;
}

export function TipoSanguineoSelect({ paciente, bloodTypes, onUpdate }: Props) {
  const initialValue = paciente.tipo_sanguineo.toUpperCase();
  const [selected, setSelected] = useState(initialValue);

  useEffect(() => {
    setSelected(paciente.tipo_sanguineo.toUpperCase());
  }, [paciente.tipo_sanguineo]);

  const handleChange = (value: string) => {
    setSelected(value);
    onUpdate("tipo_sanguineo", value.toLowerCase());
  };

  return (
    <select
      value={selected}
      onChange={(e) => handleChange(e.target.value)}
      className="border rounded-md px-2 py-1"
    >
      {bloodTypes.map((b) => (
        <option key={b} value={b}>
          {b}
        </option>
      ))}
    </select>
  );
}
