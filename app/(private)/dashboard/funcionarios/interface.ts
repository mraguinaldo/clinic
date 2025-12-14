export interface Funcionario {
  id: number;
  cargo:
    | "administrativo"
    | "enfermeiro"
    | "farmaceutico"
    | "gestor"
    | "medico"
    | "recepcionista"
    | "tecnico";
  departamento: "recepcao" | "cardiologia" | "farmacia" | "laboratorio";
  turno: "manhã" | "tarde" | "noite" | "rotativo";
  nif: string;
  data_admissao: string;
  data_demissao?: string | null;
  anos_experiencia?: number;
  usuario: {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
    telefone: string;
    img?: string | null;
  };
}
