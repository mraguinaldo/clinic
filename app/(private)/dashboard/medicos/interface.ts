import { IUser } from "@/store/use-user-data-store";

export interface Medico {
  especialidade: string;
  num_ordem_medicos: string;
  usuario: IUser;
}
