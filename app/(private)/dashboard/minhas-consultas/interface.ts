import { IUser } from "@/store/use-user-data-store";

export interface Agendamento {
  id: number;
  motivo: string;
  data_consulta: string | null;
  modelo: "presencial" | "online";
  profissional: {
    id: number;
    funcionario: {
      usuario: IUser;
    };
  };
  paciente: {
    id: number;
    usuario: IUser;
  };
}
