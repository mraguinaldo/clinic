import { Funcionario } from "../interface";

export interface Recepcionista {
  id: string;
  funcionario: Funcionario;
  posto_atendimento: string;
}
