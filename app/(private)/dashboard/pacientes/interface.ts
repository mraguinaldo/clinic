import { IUser } from "@/store/use-user-data-store";

export interface Paciente {
  id: number;
  usuario: IUser;
  cod_medico: string;
  tipo_sanguineo: string;
  peso: string;
  altura: string;
}
