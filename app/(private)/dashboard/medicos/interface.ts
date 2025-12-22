import { Funcionario } from "../funcionarios/interface";

export interface Medico {
  especialidade: string;
  num_ordem_medicos: string;
  funcionario: Funcionario;
}
